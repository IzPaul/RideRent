import { useNavigate } from 'react-router-dom';
export default function({vehicle}){
    const rating = Math.floor(vehicle.rating || 0);
    const navigate = useNavigate();
    const handleViewDetails = () => {
            navigate(`/my-vehicles/${vehicle.id}`);
        };

    return(
        <>
            <div className="vehicle-card">
                <div className="vehicle-image">Image</div>

                <div className="vehicle-info">
                    <h3>{vehicle.model}</h3>

                    <p>
                        <strong>Vehicle Type:</strong> {vehicle.type}
                    </p>

                    <p>
                        <strong>Daily Rate:</strong> ₱{vehicle.dailyRate}
                    </p>

                    <p>
                        <strong>Location:</strong>{" "}
                        {vehicle.address?.city}, {vehicle.address?.province}
                    </p>
                </div>

                <div className="vehicle-rating">
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                </div>
                <button
                    className="view-details-btn"
                    onClick={handleViewDetails}
                >
                    View Details
                </button>
            </div>
        </>
    );
}