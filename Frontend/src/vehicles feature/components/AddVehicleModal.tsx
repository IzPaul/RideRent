import React, { useState } from "react";
import api from '../../api/axiosConfig';
import "../styles/addVehicleModal.css";

interface AddVehicleModalProps {
    toggleModal: () => void;
}

export default function AddVehicleModal({ toggleModal }: AddVehicleModalProps) {
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
        console.log("Stored Email:", storedEmail);

        if (!storedEmail) {
            setError("You must be logged in to add a vehicle");
            setLoading(false);
            return;
        }

        const vehicleData = {
            model: form.model,
            type: form.type,
            dailyRate: parseFloat(form.dailyRate),
            ownerEmail: storedEmail,
            address: {
                region: form.region,
                province: form.province,
                city: form.city,
            }
        };
        console.log("Sending vehicle data:", vehicleData);

        try {
            const response = await api.post("/api/vehicles", vehicleData);
            console.log("Response:", response.data);

            if (response.status === 200 || response.status === 201) {
                setSuccess("Vehicle added successfully!");
                setTimeout(() => {
                    toggleModal();
                    window.location.reload();
                }, 1500);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to add vehicle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add New Vehicle</h2>
                <p className="subtitle">Enter vehicle details</p>

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
                            {loading ? "Adding..." : "Add Vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}