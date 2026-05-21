import React, { useState, useEffect } from "react";
import api from '../../api/axiosConfig';
import "../styles/addVehicleModal.css";

interface AddVehicleModalProps {
    toggleModal: () => void;
    vehicle?: any;
    isEditMode?: boolean;
    onSuccess?: (updatedVehicle: any) => void;
}

export default function AddVehicleModal({
    toggleModal,
    vehicle,
    isEditMode = false,
    onSuccess
}: AddVehicleModalProps) {

    const [form, setForm] = useState({
        model: "",
        description: "",
        type: "",
        dailyRate: "",
        region: "",
        province: "",
        city: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (isEditMode && vehicle) {
            setForm({
                model: vehicle.model || "",
                description: vehicle.description || "",
                type: vehicle.type || "",
                dailyRate: vehicle.dailyRate?.toString() || "",
                region: vehicle.address?.region || "",
                province: vehicle.address?.province || "",
                city: vehicle.address?.city || "",
            });
            if (vehicle.image) {
                setImagePreview(`data:image/jpeg;base64,${vehicle.image}`);
            }
        }
    }, [isEditMode, vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be smaller than 5MB");
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setError("You must be logged in");
            setLoading(false);
            return;
        }

        if (!isEditMode && !image) {
            setError("Please upload a vehicle image");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("model", form.model);
        formData.append("type", form.type);
        formData.append("dailyRate", form.dailyRate);
        formData.append("description", form.description);
        formData.append("ownerEmail", storedEmail);
        formData.append("region", form.region);
        formData.append("province", form.province);
        formData.append("city", form.city);

        if (image) {
            formData.append("image", image);
        }

        try {
            let response;
            if (isEditMode && vehicle?.id) {
                response = await api.put(`/api/vehicles/${vehicle.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                response = await api.post("/api/vehicles", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            if (response.status === 200 || response.status === 201) {
                setSuccess(isEditMode ? "Vehicle updated successfully!" : "Vehicle added successfully!");

                setTimeout(() => {
                    if (isEditMode && onSuccess) {
                        onSuccess(response.data);
                    } else {
                        toggleModal();
                        window.location.reload();
                    }
                }, 1500);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to save vehicle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditMode ? "Edit Vehicle" : "Add New Vehicle"}</h2>
                <p className="subtitle">{isEditMode ? "Update your listing" : "List your vehicle for rent"}</p>

                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert">{success}</div>}

                <form onSubmit={handleSubmit} className="add-vehicle-form">
                    <div className="image-upload-section">
                        <label className="image-label">Vehicle Image <span className="required">*</span></label>
                        <div className="image-preview-container">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder-upload">
                                    <p>Click to upload image</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="image-input"
                            />
                        </div>
                        <small>Max 5MB. Recommended: 1200x800px</small>
                    </div>

                    <input
                        type="text"
                        name="model"
                        placeholder="Model (e.g. Toyota Camry 2022)"
                        value={form.model}
                        onChange={handleChange}
                        required
                    />

                    <select name="type" value={form.type} onChange={handleChange} required>
                        <option value="">Select Vehicle Type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="MPV">MPV</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Van">Van</option>
                        <option value="Motorcycle">Motorcycle</option>
                    </select>

                    <input
                        type="number"
                        name="dailyRate"
                        placeholder="Daily Rate (₱)"
                        value={form.dailyRate}
                        onChange={handleChange}
                        required
                    />

                    <div className="address-group">
                        <h3>Location</h3>
                        <input type="text" name="region" placeholder="Region (e.g. Central Visayas)" value={form.region} onChange={handleChange} required />
                        <input type="text" name="province" placeholder="Province (e.g. Cebu)" value={form.province} onChange={handleChange} required />
                        <input type="text" name="city" placeholder="City (e.g. Cebu City)" value={form.city} onChange={handleChange} required />
                    </div>

                    <textarea
                        name="description"
                        placeholder="Detailed description of the vehicle..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        required
                    />

                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={toggleModal} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Vehicle" : "Add Vehicle")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}