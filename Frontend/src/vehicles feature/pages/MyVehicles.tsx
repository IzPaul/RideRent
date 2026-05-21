import {useState, useEffect} from 'react';
import Navbar from '../../shared/Navbar.tsx'
import AddVehicleModal from "../components/AddVehicleModal.tsx";
import api from '../../api/axiosConfig';
import VehicleListCard from '../components/VehicleListCard.tsx';

export default function MyVehicles(){
    const [filtered, setFiltered] = useState<any[]>([]);
    const [filters, setFilters] = useState({ type: '', region: '', province: '', city: '' });
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const resetFilters = () => setFilters({ type: '', region: '', province: '', city: '' });
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const storedEmail = localStorage.getItem("email");
                const response = await api.get(
                    `/api/vehicles/my-vehicles?email=${storedEmail}`
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
            <div className="vl-page">

                <aside className="vl-sidebar">
                    <div className="vl-sidebar-header">
                        <span className="vl-filter-icon">⚙</span>
                        <h3>Filters</h3>
                        <button className="vl-reset" onClick={resetFilters}>Reset</button>
                    </div>

                    <div className="vl-filter-group">
                        <label>Vehicle Type</label>
                        <select value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
                            <option value="">All Types</option>
                            <option>Sedan</option><option>SUV</option><option>MPV</option>
                            <option>Pickup</option><option>Van</option><option>Motorcycle</option>
                        </select>
                    </div>
                    <div className="vl-filter-group">
                        <label>Region</label>
                        <input placeholder="e.g. Region VII" value={filters.region}
                            onChange={e => setFilters(p => ({ ...p, region: e.target.value }))} />
                    </div>
                    <div className="vl-filter-group">
                        <label>Province</label>
                        <input placeholder="e.g. Cebu" value={filters.province}
                            onChange={e => setFilters(p => ({ ...p, province: e.target.value }))} />
                    </div>
                    <div className="vl-filter-group">
                        <label>City</label>
                        <input placeholder="e.g. Cebu City" value={filters.city}
                            onChange={e => setFilters(p => ({ ...p, city: e.target.value }))} />
                    </div>

                    <div className="vl-results-count">
                        {!loading && <span>{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found</span>}
                    </div>
                </aside>

                <main className="listings">
                    <div className="vl-main-header">
                        <div>
                            <h1 className="vl-title">My Vehicles</h1>
                            <p className="vl-sub">Track your listed vehicles</p>
                        </div>
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
                                 <VehicleListCard vehicle={vehicle}/>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}