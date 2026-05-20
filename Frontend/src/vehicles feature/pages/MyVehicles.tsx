import {useState, useEffect} from 'react';
import Navbar from '../../shared/Navbar.tsx'
import "../styles/vehiclelisting.css";
import AddVehicleModal from "../components/AddVehicleModal.tsx";
import api from '../../api/axiosConfig';

export default function MyVehicles(){
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get("/api/vehicles/my-vehicles"); // Adjust endpoint if needed
                setVehicles(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);



    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

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
                        <h1>My Vehicle Listings</h1>
                        <button className="add-btn" onClick={toggleModal}>Add Listing</button>
                        <div className="vehicle-modal-container">
                            {isModalOpen && <AddVehicleModal toggleModal={toggleModal} />}
                        </div>
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
                                 <div key={vehicle.id} className="vehicle-card">
                                     <div className="vehicle-image">Image</div>
                                     <div className="vehicle-info">
                                         <h3>{vehicle.model}</h3>
                                         <p>Vehicle Type: {vehicle.type}</p>
                                         <p>Daily Rate: ₱{vehicle.dailyRate}</p>
                                         <p>Location: {vehicle.address?.city}, {vehicle.address?.province}</p>
                                     </div>
                                     <div className="vehicle-rating">
                                         {"★".repeat(Math.floor(vehicle.rating || 0))}
                                     </div>
                                 </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}