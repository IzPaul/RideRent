import React, { useState, useEffect } from "react";
import api from '../../api/axiosConfig';
import "../styles/BookingModal.css";

interface BookingModalProps {
    vehicle: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BookingModal({ vehicle, onClose, onSuccess }: BookingModalProps) {
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        extraInfo: "",
    });
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (form.startDate && form.endDate) {
            const start = new Date(form.startDate);
            const end = new Date(form.endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (days > 0) {
                setTotalCost(days * vehicle.dailyRate);
                setError("");
            } else {
                setTotalCost(null);
                if (form.endDate) setError("End date must be after start date.");
            }
        } else {
            setTotalCost(null);
        }
    }, [form.startDate, form.endDate, vehicle.dailyRate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (totalCost === null || totalCost <= 0) {
            setError("Please select valid start and end dates.");
            return;
        }

        setLoading(true);
        const bookerEmail = localStorage.getItem("email");

        try {
            await api.post("/api/bookings", {
                bookerEmail,
                vehicleId: vehicle.id,
                startDate: form.startDate,
                endDate: form.endDate,
                extraInfo: form.extraInfo || null,
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const days = form.startDate && form.endDate && totalCost !== null
        ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="booking-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
                <button className="booking-close-btn" onClick={onClose}>×</button>

                <div className="booking-header">
                    <h2>Book Vehicle</h2>
                    <p className="booking-vehicle-name">{vehicle.model}</p>
                    <span className="booking-rate">₱{vehicle.dailyRate} / day</span>
                </div>

                {error && <div className="booking-error">{error}</div>}

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="booking-dates">
                        <div className="booking-field">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                min={today}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="booking-arrow">→</div>
                        <div className="booking-field">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                min={form.startDate || today}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="booking-field">
                        <label>Extra Info <span className="optional">(optional)</span></label>
                        <textarea
                            name="extraInfo"
                            placeholder="Any special requests or notes for the owner..."
                            value={form.extraInfo}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {totalCost !== null && totalCost > 0 && (
                        <div className="booking-summary">
                            <div className="summary-row">
                                <span>Duration</span>
                                <span>{days} {days === 1 ? "day" : "days"}</span>
                            </div>
                            <div className="summary-row">
                                <span>Daily Rate</span>
                                <span>₱{vehicle.dailyRate}</span>
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-row total">
                                <span>Total Cost</span>
                                <span className="total-amount">₱{totalCost.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="booking-submit-btn"
                        disabled={loading || totalCost === null || totalCost <= 0}
                    >
                        {loading ? "Confirming..." : "Confirm Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
}