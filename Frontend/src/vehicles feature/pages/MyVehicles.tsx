import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx'
import AddVehicleModal from "../components/AddVehicleModal.tsx";
import api from '../../api/axiosConfig';
import VehicleListCard from '../components/VehicleListCard.tsx';
import '../styles/vehiclelisting.css';

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
                const r = await api.get(`/api/vehicles/my-vehicles?email=${storedEmail}`)
                .then(r => { setVehicles(r.data); setFiltered(r.data); })
                .catch(console.error)
                .finally(() => setLoading(false));
            } catch (err) {
                console.error("Failed to fetch vehicles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    useEffect(() => {
        let result = vehicles;
        if (filters.type) result = result.filter(v => v.type === filters.type);
        if (filters.region) result = result.filter(v => v.address?.region?.toLowerCase().includes(filters.region.toLowerCase()));
        if (filters.province) result = result.filter(v => v.address?.province?.toLowerCase().includes(filters.province.toLowerCase()));
        if (filters.city) result = result.filter(v => v.address?.city?.toLowerCase().includes(filters.city.toLowerCase()));
        setFiltered(result);
    }, [filters, vehicles]);

    const renderStars = (rating: number) => {
        const full = Math.floor(rating || 0);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    };

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

                <main className="vl-main">
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
                    {loading ? (
                        <div className="vl-loading">
                            <div className="vl-spinner" />
                            <p>Finding vehicles…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="vl-empty">
                            <h3>No vehicles found</h3>
                            <p>Try adjusting your filters</p>
                            <button className="vl-reset-btn" onClick={resetFilters}>Clear Filters</button>
                        </div>
                    ) : (
                        <div className="vl-grid">
                            {filtered.map((v: any, i: number) => (
                                <VehicleListCard v={v} i={i}/>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}