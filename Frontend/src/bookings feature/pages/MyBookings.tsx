import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import api from '../../api/axiosConfig';
import '../styles/MyBookings.css';

interface Booking {
    id: number;
    vehicleId: number;
    vehicleModel: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: string;
    extraInfo: string;
    bookerName: string;
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
    PENDING:   { label: 'Pending',   cls: 'status-pending'   },
    CONFIRMED: { label: 'Confirmed', cls: 'status-confirmed' },
    CANCELLED: { label: 'Cancelled', cls: 'status-cancelled' },
    COMPLETED: { label: 'Completed', cls: 'status-completed' },
};

export default function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) { setLoading(false); return; }
        api.get(`/api/bookings/my-bookings?email=${encodeURIComponent(email)}`)
            .then(r => setBookings(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id: number) => {
        if (!window.confirm('Cancel this booking?')) return;
        const email = localStorage.getItem('email') || '';
        try {
            const res = await api.put(`/api/bookings/${id}/cancel?email=${encodeURIComponent(email)}`);
            setBookings(prev => prev.map(b => b.id === id ? res.data : b));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        }
    };

    const fmt = (d: string) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
    const days = (s: string, e: string) => Math.ceil((new Date(e).getTime() - new Date(s).getTime()) / 86400000);

    return (
        <>
            <Navbar />
            <div className="mb-page">
                <div className="mb-header">
                    <h1 className="mb-title">My Bookings</h1>
                    <p className="mb-sub">Track and manage all your vehicle rentals</p>
                </div>

                {loading ? (
                    <div className="mb-empty">
                        <div className="mb-spinner" />
                        <p>Loading your bookings…</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="mb-empty">
                        <h3>No bookings yet</h3>
                        <p>Browse available vehicles and make your first booking.</p>
                        <button className="mb-browse-btn" onClick={() => navigate('/vehicle-listing')}>
                            Browse Vehicles
                        </button>
                    </div>
                ) : (
                    <div className="mb-grid">
                        {bookings.map((b, i) => {
                            const meta = STATUS_META[b.status] || STATUS_META.PENDING;
                            const d = days(b.startDate, b.endDate);
                            const canCancel = b.status === 'PENDING' || b.status === 'CONFIRMED';
                            return (
                                <div className="mb-card" key={b.id} style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="mb-card-top">
                                        <div className="mb-card-icon">🚗</div>
                                        <div className="mb-card-title-block">
                                            <h3 className="mb-card-model">{b.vehicleModel}</h3>
                                            <span className="mb-card-id">Booking #{b.id}</span>
                                        </div>
                                        <span className={`mb-status ${meta.cls}`}>{meta.label}</span>
                                    </div>

                                    <div className="mb-card-dates">
                                        <div className="mb-date-block">
                                            <span className="mb-date-lbl">Pick-up</span>
                                            <span className="mb-date-val">{fmt(b.startDate)}</span>
                                        </div>
                                        <div className="mb-date-line">
                                            <span className="mb-days-pill">{d}d</span>
                                        </div>
                                        <div className="mb-date-block">
                                            <span className="mb-date-lbl">Return</span>
                                            <span className="mb-date-val">{fmt(b.endDate)}</span>
                                        </div>
                                    </div>

                                    {b.extraInfo && (
                                        <p className="mb-extra">"{b.extraInfo}"</p>
                                    )}

                                    <div className="mb-card-footer">
                                        <span className="mb-cost">₱{b.totalCost.toLocaleString()}</span>
                                        <div className="mb-actions">
                                            <button
                                                className="mb-btn mb-btn-view"
                                                onClick={() => navigate(`/vehicles/${b.vehicleId}`)}
                                            >
                                                View Vehicle
                                            </button>
                                            {canCancel && (
                                                <button
                                                    className="mb-btn mb-btn-cancel"
                                                    onClick={() => handleCancel(b.id)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}