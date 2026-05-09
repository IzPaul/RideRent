import { useEffect, useState } from "react";
import Navbar from '../../shared/Navbar.tsx'
import "../styles/profile.css";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}
const DEFAULT_AVATAR = "../../shared/default-profile.jpg";

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [form, setForm] = useState<UserProfile>({
        fullName: "", email: "", phone: "", address: ""
    });
    const [loading, setLoading] = useState(true);
    const [isEditMode, setEditMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const toggleEditMode = () => {
        const newMode = !isEditMode;
        if(newMode === false){
            setPreviewUrl(null);
        }
        setEditMode(newMode);
        setSelectedFile(null);
        if (newMode && user) {
            setForm({...user});
        }
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/user/profile?email=${encodeURIComponent(storedEmail)}`)
            .then(res => {
                if (!res.ok) throw new Error("Profile not found");
                return res.json();
            })
            .then(data => {
                console.log("Profile data received:", data); // Debug
                setUser(data);
                setForm(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        setLoading(true);
        const storedEmail = localStorage.getItem("email");

        try {
            const response = await fetch(
                `http://localhost:8080/api/user/profile?email=${encodeURIComponent(storedEmail || "")}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) throw new Error("Update failed");

            setUser(form);
            if (form.email !== storedEmail) {
                localStorage.setItem("email", form.email);
            }
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev!, [e.target.name]: e.target.value }));
    };

   const handleImageUpload = async () => {
       if (!selectedFile || !user) return;

       setLoading(true);
       try {
           const formData = new FormData();
           formData.append("file", selectedFile);

           const response = await fetch(
               `http://localhost:8080/api/user/upload-image/${encodeURIComponent(user.email)}`,
               {
                   method: "POST",
                   body: formData,
               }
           );

           if (!response.ok) {
               const errorText = await response.text();
               throw new Error(errorText);
           }

           const storedEmail = localStorage.getItem("email");
           const refreshRes = await fetch(
               `http://localhost:8080/api/user/profile?email=${encodeURIComponent(storedEmail || "")}`
           );

           if (refreshRes.ok) {
               const updatedUser = await refreshRes.json();
               setUser(updatedUser);
               setForm(updatedUser);
           }

           alert("Profile picture updated successfully!");
           setSelectedFile(null);

       } catch (error: any) {
           console.error(error);
           alert(error.message || "Failed to upload image");
       } finally {
           setLoading(false);
       }
   };

   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       if (e.target.files && e.target.files[0]) {
           const file = e.target.files[0];
           setSelectedFile(file);

           const reader = new FileReader();
           reader.onloadend = () => {
               setPreviewUrl(reader.result as string);
           };
           reader.readAsDataURL(file);
       }
   };

    if (loading) return <div className="loading">Loading Profile...</div>;
    if (!user) return <div className="error">Profile not found. Please log in again.</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="profile-sidebar">
                    <div className="profile-card">
                        {!previewUrl && (
                        <div className="profile-avatar">
                            <img
                                src={user.image
                                    ? `data:image/jpeg;base64,${user.image}`
                                    : DEFAULT_AVATAR}
                                alt="Profile Avatar"
                                onError={(e) => {
                                    e.currentTarget.src = DEFAULT_AVATAR;
                                }}
                            />
                        </div>
                        )}
                        {isEditMode && (
                            <div className="image-upload-section">
                                    {previewUrl && (
                                        <div className="image-preview">
                                            <img src={previewUrl} alt="Preview" style={{ width: '100px', borderRadius: '50%' }} />
                                        </div>
                                    )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileChange}
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="fileInput" className={selectedFile ? "" :"profile-btn small"}>
                                    {selectedFile ? selectedFile.name : "Choose Photo"}
                                </label>
                                {selectedFile && (
                                    <button className="profile-btn small" onClick={handleImageUpload}>
                                        Upload Photo
                                    </button>
                                )}
                            </div>
                        )}
                        <h3>{user.fullName || "N/A"}</h3>
                        <p className="profile-email">{user.email || "N/A"}</p>
                        <button className="profile-btn" onClick={toggleEditMode}>
                            {isEditMode ? "Cancel Edit" : "Edit Profile"}
                        </button>
                    </div>
                </div>

                <div className="profile-content">
                    <h1>Profile Overview</h1>
                    <div className="profile-info-card">
                        {!isEditMode ? (
                            <div>
                                <h3>Personal Information</h3>
                                <div className="info-row"><label>Full Name</label><p>{user.fullName || "N/A"}</p></div>
                                <div className="info-row"><label>Email</label><p>{user.email || "N/A"}</p></div>
                                <div className="info-row"><label>Phone</label><p>{user.phone || "Not provided"}</p></div>
                                <div className="info-row"><label>Address</label><p>{user.address || "Not provided"}</p></div>
                            </div>
                        ) : (
                            <div>
                                <h3>Edit Personal Information</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="info-row">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="input"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="info-row">
                                        <label>Email</label>
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className="input"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                    </div>
                                    <div className="info-row">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            className="input"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="info-row">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            className="input"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="primary-btn" disabled={loading}>
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}