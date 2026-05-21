import '../styles/vehiclelistcard.css';
import '../styles/vehiclelisting.css';
import { useNavigate } from 'react-router-dom';

interface VehicleListCardProps {
    v: any;           // renamed for consistency
    i: number;
    isPublic?: boolean;
}

export default function VehicleListCard({ v, i, isPublic = false }: VehicleListCardProps) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (isPublic) {
            navigate(`/vehicles/${v.id}`);
        } else {
            navigate(`/my-vehicles/${v.id}`);
        }
    };

    const renderStars = (rating: number) => {
        const full = Math.floor(rating || 0);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    };

    const pending = v.pendingBookings || 0;

    return (
        <div className="vl-card"
             key={v.id}
             style={{ animationDelay: `${i * 50}ms` }}
             onClick={handleViewDetails}>

            <div className="vl-card-img">
                {v.image
                    ? <img src={`data:image/jpeg;base64,${v.image}`} alt={v.model} />
                    : <div className="vl-img-placeholder"><span>🚗</span></div>
                }
                <span className="vl-type-chip">{v.type}</span>
            </div>

            <div className="vl-card-body">
                <h3 className="vl-card-model">{v.model}</h3>
                <p className="vl-card-location">
                    📍 {[v.address?.city, v.address?.province].filter(Boolean).join(', ')}
                </p>
                <div className="vl-card-rating">
                    <span className="vl-stars">{renderStars(v.rating)}</span>
                    <span className="vl-rating-num">{v.rating?.toFixed(1) || '0.0'}</span>
                </div>

                <div className="vl-card-footer">
                    <div>
                        <span className="vl-price">₱{v.dailyRate?.toLocaleString()}</span>
                        <span className="vl-per-day"> / day</span>
                    </div>
                    <button className="vl-view-btn">View →</button>
                </div>

                {/* Pending Bookings Indicator */}
                {pending > 0 && (
                    <div className="pending-indicator">
                        ⚠️ {pending} Pending Booking{pending > 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
}