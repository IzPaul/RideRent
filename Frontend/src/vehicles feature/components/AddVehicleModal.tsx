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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Pre-fill form in edit mode
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
        }
    }, [isEditMode, vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
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

        const vehicleData = {
            model: form.model,
            type: form.type,
            dailyRate: parseFloat(form.dailyRate),
            description: form.description,
            ownerEmail: storedEmail,
            address: {
                region: form.region,
                province: form.province,
                city: form.city,
            }
        };

        try {
            let response;
            if (isEditMode && vehicle?.id) {
                // Update existing vehicle
                response = await api.put(`/api/vehicles/${vehicle.id}`, vehicleData);
            } else {
                // Create new vehicle
                response = await api.post("/api/vehicles", vehicleData);
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
                }, 1200);
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
                <p className="subtitle">{isEditMode ? "Update vehicle details" : "Enter vehicle details"}</p>

                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="model"
                        placeholder="Model (e.g. Toyota Camry)"
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

                    <h3>Address</h3>
                    <input type="text" name="region" placeholder="Region" value={form.region} onChange={handleChange} required />
                    <input type="text" name="province" placeholder="Province" value={form.province} onChange={handleChange} required />
                    <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
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