import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import "../styles/vehiclelisting.css";
import api from '../../api/axiosConfig';

export default function VehicleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/api/vehicles/${id}`);
                setVehicle(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicle", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleBook = () => {
        // TODO: Later implement booking flow
        alert(`Booking flow for ${vehicle?.model} will be implemented here!`);
    };

    if (loading) return <><Navbar /><div className="vehicle-page"><p>Loading...</p></div></>;
    if (!vehicle) return <><Navbar /><div className="vehicle-page"><p>Vehicle not found.</p></div></>;

    return (
        <>
            <Navbar />
            <div className="vehicle-page details-page">
                {loading && (<p>Loading...</p>)}
                {!vehicle && (<p>Vehicle not found.</p>)}
                <div className="details-container">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back to Listings
                    </button>

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
                                <strong>Owner Name:</strong>
                                <span className="price">₱{vehicle.dailyRate} / day</span>
                            </div>
                            <div className="info-row">
                                <strong>Owner Phone number:</strong>
                                <span className="price">₱{vehicle.dailyRate} / day</span>
                            </div>
                            <div className="info-row">
                                <strong>Description:</strong>
                                <span>{vehicle.description}</span>
                            </div>
                        </div>
                    </div>

                    <div className="booking-section">
                        <button className="book-btn" onClick={handleBook}>
                            Book This Vehicle
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}