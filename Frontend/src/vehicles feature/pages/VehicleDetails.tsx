import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import "../styles/vehiclelisting.css";
import api from '../../api/axiosConfig';
import BookingModal from '../../bookings feature/components/BookingModal.tsx';

export default function VehicleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/api/vehicles/${id}`);
                // Attach the id so the modal can use it
                setVehicle({ ...response.data, id: Number(id) });
            } catch (err) {
                console.error("Failed to fetch vehicle", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setBookingSuccess(true);
    };

    if (loading) return <><Navbar /><div className="vehicle-page"><p>Loading...</p></div></>;
    if (!vehicle) return <><Navbar /><div className="vehicle-page"><p>Vehicle not found.</p></div></>;

    return (
        <>
            <Navbar />
            <div className="vehicle-page details-page">
                <div className="details-container">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back to Listings
                    </button>

                    {bookingSuccess && (
                        <div style={{
                            background: '#d1fae5',
                            color: '#065f46',
                            padding: '14px 18px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            Booking confirmed! You can view it in <button
                                style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => navigate('/my-bookings')}
                            >My Bookings</button>.
                        </div>
                    )}

                    <div className="details-header">
                        <h1>{vehicle.model}</h1>
                        <div className="rating-large">
                            {"★".repeat(Math.floor(vehicle.rating || 0))}
                            {"☆".repeat(5 - Math.floor(vehicle.rating || 0))}
                            <span> ({vehicle.rating || 0})</span>
                        </div>
                    </div>

                    <div className="details-content">
                        <div className="vehicle-image-large">
                            <div className="image-placeholder">Vehicle Image</div>
                        </div>

                        <div className="details-info">
                            <div className="info-row">
                                <strong>Type:</strong> <span>{vehicle.type}</span>
                            </div>
                            <div className="info-row">
                                <strong>Daily Rate:</strong>
                                <span className="price">₱{vehicle.dailyRate} / day</span>
                            </div>
                            <div className="info-row">
                                <strong>Location:</strong>
                                <span>{vehicle.address?.region}, {vehicle.address?.province}, {vehicle.address?.city}</span>
                            </div>
                            <div className="info-row">
                                <strong>Owner:</strong>
                                <span>{vehicle.ownerName || "N/A"}</span>
                            </div>
                            <div className="info-row">
                                <strong>Owner Contact:</strong>
                                <span>{vehicle.ownerPhone || "N/A"}</span>
                            </div>
                            <div className="info-row">
                                <strong>Description:</strong>
                                <span>{vehicle.description}</span>
                            </div>
                        </div>
                    </div>

                    <div className="booking-section" style={{ marginTop: '30px', textAlign: 'center' }}>
                        <button
                            className="book-btn"
                            onClick={() => setShowBookingModal(true)}
                            style={{
                                padding: '14px 40px',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'opacity 0.2s, transform 0.1s',
                            }}
                        >
                            Book This Vehicle
                        </button>
                    </div>
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    vehicle={vehicle}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </>
    );
}