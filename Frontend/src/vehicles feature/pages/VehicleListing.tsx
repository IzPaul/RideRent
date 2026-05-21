import {useState, useEffect} from 'react';
import Navbar from '../../shared/Navbar.tsx'
import "../styles/vehiclelisting.css";
import VehicleListCard from '../components/VehicleListCard.tsx';

export default function VehicleListing(){
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            const fetchVehicles = async () => {
                try {
                    const storedEmail = localStorage.getItem("email");
                    const response = await api.get(
                        `/api/vehicles/vehicle-listing`
                    );

                    setVehicles(response.data);
                } catch (err) {
                    console.error("Failed to fetch vehicles", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchVehicles();
        }, []);

    return(
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
                        <option value="">Select</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="motorcycle">Motorcycle</option>
                    </select>
                    </div>

                    <div className="filter-group">
                    <label>Region:</label>
                    <input type="text" />
                    </div>

                    <div className="filter-group">
                    <label>Province:</label>
                    <input type="text" />
                    </div>

                    <div className="filter-group">
                    <label>City:</label>
                    <input type="text" />
                    </div>
                </div>

                <div className="listings">
                    <div className="listing-headers">
                        <h1>Vehicle Listings</h1>
                    </div>

                    <div className="listing-container">
                        {loading ? (
                            <div className="vehicle-card">
                                <p>Loading vehicles...</p>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="vehicle-card">
                                <p>No vehicles found. Add your first listing!</p>
                            </div>
                        ) : (
                            vehicles.map((vehicle: any) => (
                                 <VehicleListCard vehicle={vehicle}/>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}