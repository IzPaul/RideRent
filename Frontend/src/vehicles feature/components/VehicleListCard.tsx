import '../styles/vehiclelistcard.css';
import { useNavigate } from 'react-router-dom';

interface VehicleListCardProps {
    vehicle: any;
    isPublic?: boolean;
}

export default function VehicleListCard({ vehicle, isPublic = false }: VehicleListCardProps) {
    const navigate = useNavigate();
    const rating = Math.floor(vehicle.rating || 0);

    const handleViewDetails = () => {
        if (isPublic) {
            navigate(`/vehicles/${vehicle.id}`);
        } else {
            navigate(`/my-vehicles/${vehicle.id}`);
        }
    };

    return (
        <div className="vehicle-card">
            <div className="vehicle-image">Image</div>

            <div className="vehicle-info">
                <h3>{vehicle.model}</h3>
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Daily Rate:</strong> ₱{vehicle.dailyRate}</p>
                <p>
                    <strong>Location:</strong> {vehicle.address?.city}, {vehicle.address?.province}
                </p>
            </div>

            <div className="vehicle-rating">
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)}
            </div>

            <button className="view-details-btn" onClick={handleViewDetails}>
                {isPublic ? "View Details & Book" : "View Details"}
            </button>
        </div>
    );
}