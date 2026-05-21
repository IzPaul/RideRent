import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import api from '../../api/axiosConfig';
import BookingModal from '../../bookings feature/components/BookingModal.tsx';
import '../styles/vehicledetails.css';

interface Review {
    id: number;
    bookerName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function VehicleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<any>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Fetch Vehicle
        api.get(`/api/vehicles/${id}`)
            .then(r => setVehicle({ ...r.data, id: Number(id) }))
            .catch(console.error)
            .finally(() => setLoading(false));

        // Fetch Reviews
        api.get(`/api/reviews/vehicle/${id}`)
            .then(r => setReviews(r.data))
            .catch(console.error)
            .finally(() => setReviewsLoading(false));
    }, [id]);

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setBookingSuccess(true);
    };

    const fmtDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="mvd-loading"><div className="mvd-spinner" /><p>Loading vehicle details...</p></div>
            </>
        );
    }

    if (!vehicle) {
        return (
            <>
                <Navbar />
                <div className="mvd-loading">
                    <p>Vehicle not found.</p>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </>
        );
    }

    const averageRating = vehicle.rating || 0;
    const totalReviews = reviews.length;

    return (
        <>
            <Navbar />
            <div className="mvd-page">
                {/* Back Button */}
                <button className="mvd-back" onClick={() => navigate(-1)}>
                    ← Back to Listings
                </button>

                <div className="mvd-top">
                    {/* Sidebar */}
                    <aside className="mvd-sidebar">
                        <div className="mvd-image-box">
                            <div className="card-img">
                                {vehicle.image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${vehicle.image}`}
                                        alt={vehicle.model}
                                    />
                                ) : (
                                    <><span>🚗</span><p>No Image</p></>
                                )}
                            </div>
                        </div>

                        <button
                            className="mvd-book-btn"
                            onClick={() => setShowBookingModal(true)}
                        >
                            Book This Vehicle
                        </button>

                        <div className="mvd-sidebar-stats">
                            <div className="mvd-stat">
                                <span className="mvd-stat-val">₱{vehicle.dailyRate}</span>
                                <span className="mvd-stat-lbl">per day</span>
                            </div>
                            <div className="mvd-stat-divider" />
                            <div className="mvd-stat">
                                <span className="mvd-stat-val">
                                    {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                                </span>
                                <span className="mvd-stat-lbl">rating</span>
                            </div>
                            <div className="mvd-stat-divider" />
                            <div className="mvd-stat">
                                <span className="mvd-stat-val">{totalReviews}</span>
                                <span className="mvd-stat-lbl">reviews</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Info */}
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
                                <span className="mvd-info-lbl">Daily Rate</span>
                                <span className="mvd-info-val mvd-price">₱{vehicle.dailyRate?.toLocaleString()}</span>
                            </div>
                            <div className="mvd-info-item">
                                <span className="mvd-info-lbl">Owner</span>
                                <span className="mvd-info-val">{vehicle.ownerName}</span>
                            </div>
                            <div className="mvd-info-item mvd-info-full">
                                <span className="mvd-info-lbl">Description</span>
                                <span className="mvd-info-val">{vehicle.description || 'No description provided.'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mvd-bookings-section">
                    <div className="mvd-section-header">
                        <h2 className="mvd-section-title">Reviews</h2>
                        {totalReviews > 0 && (
                            <div className="overall-rating">
                                Overall Rating:{" "}
                                <span className="stars-large">
                                    {"★".repeat(Math.floor(averageRating))}
                                    {"☆".repeat(5 - Math.floor(averageRating))}
                                </span>
                                <span className="rating-value"> {averageRating.toFixed(1)} </span>
                                <span className="review-count">({totalReviews} reviews)</span>
                            </div>
                        )}
                    </div>

                    {reviewsLoading ? (
                        <div className="mvd-table-loading"><div className="mvd-spinner" /></div>
                    ) : totalReviews === 0 ? (
                        <div className="mvd-no-bookings">
                            <p>No reviews yet. Be the first to review this vehicle after your trip!</p>
                        </div>
                    ) : (
                        <div className="reviews-list">
                            {reviews.map((review, index) => (
                                <div key={review.id || index} className="review-card">
                                    <div className="review-header">
                                        <strong>{review.bookerName}</strong>
                                        <div className="review-rating">
                                            {"★".repeat(review.rating)}
                                            {"☆".repeat(5 - review.rating)}
                                            <span className="review-date">
                                                {fmtDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="review-comment">"{review.comment}"</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
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