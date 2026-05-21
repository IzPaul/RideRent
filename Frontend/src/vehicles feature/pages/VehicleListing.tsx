import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import "../styles/vehiclelisting.css";
import VehicleListCard from '../components/VehicleListCard.tsx';
import api from '../../api/axiosConfig';

export default function VehicleListing() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get('/api/vehicles/vehicle-listing');
                setVehicles(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <>
            <Navbar />
            <div className="vehicle-page">
                <div className="filters">
                    <div className="filters-header">
                        <h3>Filters</h3>
                        <button className="reset-btn">Reset Filters</button>
                    </div>

                    <div className="filter-group">
                        <label>Car Type:</label>
                        <select>
                            <option value="">All Types</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="MPV">MPV</option>
                            <option value="Pickup">Pickup</option>
                            <option value="Van">Van</option>
                            <option value="Motorcycle">Motorcycle</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Region:</label>
                        <input type="text" placeholder="Enter region" />
                    </div>

                    <div className="filter-group">
                        <label>Province:</label>
                        <input type="text" placeholder="Enter province" />
                    </div>

                    <div className="filter-group">
                        <label>City:</label>
                        <input type="text" placeholder="Enter city" />
                    </div>
                </div>

                <div className="listings">
                    <div className="listing-headers">
                        <h1>Available Vehicles</h1>
                    </div>

                    <div className="listing-container">
                        {loading ? (
                            <div className="vehicle-card"><p>Loading vehicles...</p></div>
                        ) : vehicles.length === 0 ? (
                            <div className="vehicle-card"><p>No vehicles available at the moment.</p></div>
                        ) : (
                            vehicles.map((vehicle: any) => (
                                <VehicleListCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    isPublic={true}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}