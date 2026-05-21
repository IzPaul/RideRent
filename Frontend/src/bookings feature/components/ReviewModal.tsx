import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReviewModal.css';
import api from '../../api/axiosConfig';

interface ReviewModalProps {
    bookingId: number;
    vehicleModel: string;
    onClose: () => void;
    onReviewSubmitted: () => void;
}

export default function ReviewModal({ bookingId, vehicleModel, onClose, onReviewSubmitted }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        setSubmitting(true);
        try {
            const email = localStorage.getItem('email');
            await api.post(`/api/reviews?email=${encodeURIComponent(email)}`, {
                bookingId,
                rating,
                comment: comment.trim()
            });
            alert("Thank you for your review!");
            onReviewSubmitted();
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal">
                <h2>Review {vehicleModel}</h2>
                <p>How was your experience?</p>

                <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review (optional)"
                    rows={4}
                />

                <div className="modal-actions">
                    <button onClick={onClose} disabled={submitting}>Cancel</button>
                    <button onClick={handleSubmit} disabled={submitting || rating === 0}>
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}