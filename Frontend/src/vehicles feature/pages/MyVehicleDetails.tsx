import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import api from '../../api/axiosConfig';
import AddVehicleModal from '../components/AddVehicleModal.tsx';
import '../styles/myvehicledetails.css';

interface Booking {
    id: number;
    bookerName: string;
    bookerEmail: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: string;
    extraInfo: string;
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
    PENDING:   { label: 'Pending',   cls: 'st-pending'   },
    CONFIRMED: { label: 'Confirmed', cls: 'st-confirmed' },
    CANCELLED: { label: 'Cancelled', cls: 'st-cancelled' },
    COMPLETED: { label: 'Completed', cls: 'st-completed' },
};

export default function MyVehicleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/api/vehicles/${id}`)
            .then(r => setVehicle({ ...r.data, id: Number(id) }))
            .catch(console.error)
            .finally(() => setLoading(false));

        api.get(`/api/bookings/vehicle/${id}`)
            .then(r => setBookings(r.data))
            .catch(console.error)
            .finally(() => setBookingsLoading(false));
    }, [id]);

    const handleVehicleUpdated = (updated: any) => {
        setVehicle(updated);
        setIsEditModalOpen(false);
    };

    const handleDeleteVehicle = async () => {
        if (!window.confirm('Are you sure you want to delete this vehicle?\n\nThis action cannot be undone.\nAll associated bookings will be automatically cancelled.')) {
            return;
        }

        try {
            await api.delete(`/api/vehicles/${id}`);
            alert('Vehicle deleted successfully. All bookings have been cancelled.');
            navigate('/my-vehicles');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete vehicle.');
        }
    };

    const handleStatusUpdate = async (bookingId: number, action: 'confirm' | 'cancel') => {
        const ownerEmail = localStorage.getItem('email') || '';
        const confirmMsg = action === 'cancel' ? 'Cancel this booking?' : 'Confirm this booking?';
        if (!window.confirm(confirmMsg)) return;
        try {
            const res = await api.put(`/api/bookings/${bookingId}/${action}?email=${encodeURIComponent(ownerEmail)}`);
            setBookings(prev => prev.map(b => b.id === bookingId ? res.data : b));
        } catch (err: any) {
            alert(err.response?.data?.message || `Failed to ${action} booking.`);
        }
    };

    const fmt = (d: string) => new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    const days = (s: string, e: string) => Math.ceil((new Date(e).getTime() - new Date(s).getTime()) / 86400000);

    if (loading) return (
        <>
            <Navbar />
            <div className="mvd-loading"><div className="mvd-spinner" /><p>Loading vehicle…</p></div>
        </>
    );

    if (!vehicle) return (
        <>
            <Navbar />
            <div className="mvd-loading"><p>Vehicle not found.</p><button className="mv-loading-button" onClick={() => navigate(-1)}>Go Back</button></div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="mvd-page">
                <button className="mvd-back" onClick={() => navigate(-1)}>
                    ← My Listings
                </button>

                <div className="mvd-top">
                    <aside className="mvd-sidebar">
                        <div className="mvd-image-box">
                            <div className="card-img">
                                {vehicle.image
                                    ? <img src={`data:image/jpeg;base64,${vehicle.image}`} alt={vehicle.model} />
                                    : <><span>🚗</span><p>No Image</p></>
                                }
                            </div>
                        </div>
                        <button className="mvd-edit-btn" onClick={() => setIsEditModalOpen(true)}>
                            Edit Details
                        </button>
                        <button className="mvd-delete-btn" onClick={handleDeleteVehicle}>
                            Delete Vehicle
                        </button>
                        <div className="mvd-sidebar-stats">
                            <div className="mvd-stat">
                                <span className="mvd-stat-val rate">₱{vehicle.dailyRate}</span>
                                <span className="mvd-stat-lbl">per day</span>
                            </div>
                            <div className="mvd-stat-divider" />
                            <div className="mvd-stat">
                                <span className="mvd-stat-val">{bookings.length}</span>
                                <span className="mvd-stat-lbl">bookings</span>
                            </div>
                            <div className="mvd-stat-divider" />
                            <div className="mvd-stat">
                                <span className="mvd-stat-val">
                                    {"★".repeat(Math.floor(vehicle.rating || 0))}
                                    {!vehicle.rating ? "—" : ""}
                                </span>
                                <span className="mvd-stat-lbl">{vehicle.rating || 0} rating</span>
                            </div>
                        </div>
                    </aside>

                    <div className="mvd-info">
                        <div className="mvd-info-header">
                            <div>
                                <h1 className="mvd-model">{vehicle.model}</h1>
                                <span className="mvd-type-badge">{vehicle.type}</span>
                            </div>
                        </div>

                        <div className="mvd-info-grid">
                            <div className="mvd-info-item">
                                <span className="mvd-info-lbl">Location</span>
                                <span className="mvd-info-val">
                                    {[vehicle.address?.city, vehicle.address?.province, vehicle.address?.region]
                                        .filter(Boolean).join(', ')}
                                </span>
                            </div>
                            <div className="mvd-info-item">
                                <span className="mvd-info-lbl">Owner</span>
                                <span className="mvd-info-val">{vehicle.ownerName}</span>
                            </div>
                            <div className="mvd-info-item">
                                <span className="mvd-info-lbl">Owner Contact #</span>
                                <span className="mvd-info-val">{vehicle.ownerPhone}</span>
                            </div>
                            <div className="mvd-info-item mvd-info-full">
                                <span className="mvd-info-lbl">Description</span>
                                <span className="mvd-info-val">{vehicle.description || '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mvd-bookings-section">
                    <h2 className="mvd-section-title">
                        Bookings
                        {!bookingsLoading && (
                            <span className="mvd-booking-count">{bookings.length}</span>
                        )}
                    </h2>

                    {bookingsLoading ? (
                        <div className="mvd-table-loading"><div className="mvd-spinner" /></div>
                    ) : bookings.length === 0 ? (
                        <div className="mvd-no-bookings">
                            <p>No bookings for this vehicle yet.</p>
                        </div>
                    ) : (
                        <div className="mvd-table-wrap">
                            <table className="mvd-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Renter</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Days</th>
                                        <th>Total Cost</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b, i) => {
                                        const meta = STATUS_META[b.status] || STATUS_META.PENDING;
                                        const d = days(b.startDate, b.endDate);
                                        const canAct = b.status === 'PENDING' || b.status === 'CONFIRMED';
                                        return (
                                            <tr key={b.id} className="mvd-table-row" onClick={() => setSelectedBooking(b)}>
                                                <td className="mvd-td-id">{b.id}</td>
                                                <td>
                                                    <div className="mvd-renter">
                                                        <span className="mvd-renter-name">{b.bookerName || '—'}</span>
                                                        <span className="mvd-renter-email">{b.bookerEmail}</span>
                                                    </div>
                                                </td>
                                                <td>{fmt(b.startDate)}</td>
                                                <td>{fmt(b.endDate)}</td>
                                                <td><span className="mvd-days-chip">{d}d</span></td>
                                                <td className="mvd-td-cost">₱{b.totalCost.toLocaleString()}</td>
                                                <td>
                                                    <span className={`mvd-status ${meta.cls}`}>{meta.label}</span>
                                                </td>
                                                <td>
                                                    <div className="mvd-row-actions">
                                                        {b.status === 'PENDING' && (
                                                            <button
                                                                className="mvd-act-btn mvd-act-confirm"
                                                                onClick={() => handleStatusUpdate(b.id, 'confirm')}
                                                            >
                                                                Confirm
                                                            </button>
                                                        )}
                                                        {canAct && (
                                                            <button
                                                                className="mvd-act-btn mvd-act-cancel"
                                                                onClick={() => handleStatusUpdate(b.id, 'cancel')}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                        {!canAct && <span className="mvd-no-action">—</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {selectedBooking && (
                <div
                    className="mvd-modal-overlay"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="mvd-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mvd-modal-header">
                            <h3>Booking #{selectedBooking.id}</h3>
                            <button
                                className="mvd-modal-close"
                                onClick={() => setSelectedBooking(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mvd-modal-content">
                            <p>
                                <strong>Renter:</strong>{" "}
                                {selectedBooking.bookerName}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedBooking.bookerEmail}
                            </p>

                            <p>
                                <strong>Extra Info:</strong>
                            </p>

                            <div className="mvd-extra-info-box">
                                {selectedBooking.extraInfo || "No extra information provided."}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <AddVehicleModal
                    toggleModal={() => setIsEditModalOpen(false)}
                    vehicle={vehicle}
                    isEditMode={true}
                    onSuccess={handleVehicleUpdated}
                />
            )}
        </>
    );
}