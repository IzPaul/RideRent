import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import "../styles/vehiclelisting.css";
import api from '../../api/axiosConfig';
import AddVehicleModal from "../components/AddVehicleModal.tsx";

export default function MyVehicleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/api/vehicles/${id}`);
                setVehicle(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicle details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

    const handleVehicleUpdated = (updatedVehicle: any) => {
        setVehicle(updatedVehicle);
        setIsEditModalOpen(false);
    };

    if (loading) {
        return (
            <div className="vehicle-page">
                <Navbar />
                <div className="loading">Loading vehicle details...</div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="vehicle-page">
                <Navbar />
                <div className="error">Vehicle not found.</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="vehicle-page details-page">
                <div className="details-container">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back to My Listings
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
                                <strong>Vehicle Type:</strong>
                                <span>{vehicle.type}</span>
                            </div>
                            <div className="info-row">
                                <strong>Daily Rate:</strong>
                                <span className="price">₱{vehicle.dailyRate}</span>
                            </div>
                            <div className="info-row">
                                <strong>Location:</strong>
                                <span>
                                    {vehicle.address?.region}, {vehicle.address?.province}, {vehicle.address?.city}
                                </span>
                            </div>
                            <div className="info-row">
                                <strong>Description:</strong>
                                <span>{vehicle.description}</span>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="edit-btn" onClick={toggleEditModal}>
                            Edit Details
                        </button>
                        {/* Delete button can be added later */}
                    </div>
                </div>

                {isEditModalOpen && (
                    <AddVehicleModal
                        toggleModal={toggleEditModal}
                        vehicle={vehicle}
                        isEditMode={true}
                        onSuccess={handleVehicleUpdated}
                    />
                )}
            </div>
        </>
    );
}