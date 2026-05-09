import { useEffect, useState } from "react";
import api, { uploadImage } from '../../api/axiosConfig';
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

        api.get(`/api/user/profile?email=${encodeURIComponent(storedEmail)}`)
            .then((res) => {
                console.log("Profile data received:", res.data);
                setUser(res.data);
                setForm(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        setLoading(true);
        const storedEmail = localStorage.getItem("email");

        try {
            const response = await api.put(
                `/api/user/profile?email=${encodeURIComponent(storedEmail || "")}`,
                form
            );

            console.log("Success:", response.data);

            setUser(form);
            if (form.email !== storedEmail) {
                localStorage.setItem("email", form.email);
            }
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (error: any) {
            console.error("Update error:", error);
            alert(error.response?.data?.message || "Error updating profile.");
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
           const response = await uploadImage(
               `/api/user/upload-image/${encodeURIComponent(user.email)}`,
               selectedFile
           );

           alert(response.data || "Profile picture updated successfully!");

           // Refresh profile
           const storedEmail = localStorage.getItem("email");
           const refreshRes = await api.get(
               `/api/user/profile?email=${encodeURIComponent(storedEmail || "")}`
           );

           setUser(refreshRes.data);
           setForm(refreshRes.data);
           setSelectedFile(null);

       } catch (error: any) {
           console.error(error);
           alert(error.response?.data || "Error uploading image.");
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