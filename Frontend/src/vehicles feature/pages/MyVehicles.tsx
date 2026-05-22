import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import AddVehicleModal from "../components/AddVehicleModal.tsx";
import api from '../../api/axiosConfig';
import VehicleListCard from '../components/VehicleListCard.tsx';
import { usePhilippineGeography } from '../../shared/utils/PhilippinesGeography.js';
import '../styles/vehiclelisting.css';

export default function MyVehicles() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        model: '',
        type: '',
        region: '',
        province: '',
        city: ''
    });

    const { getRegions, getProvincesByRegion } = usePhilippineGeography();

    const vehicleTypes = useMemo(() => {
        const types = [...new Set(vehicles.map(v => v.type).filter(Boolean))];
        return types.sort();
    }, [vehicles]);

    const availableProvinces = useMemo(() => {
        return getProvincesByRegion(filters.region);
    }, [filters.region, getProvincesByRegion]);

    useEffect(() => {
        if (filters.region === '') {
            setFilters(prev => ({ ...prev, province: '' }));
        }
    }, [filters.region]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const storedEmail = localStorage.getItem("email");
                const response = await api.get(`/api/vehicles/my-vehicles?email=${storedEmail}`);
                setVehicles(response.data);
                setFiltered(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    useEffect(() => {
        let result = [...vehicles];

        if (filters.model) {
            const modelSearch = filters.model.toLowerCase().trim();
            result = result.filter(v => v.model?.toLowerCase().includes(modelSearch));
        }


        if (filters.type) {
            result = result.filter(v => v.type === filters.type);
        }
        if (filters.region) {
            result = result.filter(v => v.address?.region === filters.region);
        }
        if (filters.province) {
            result = result.filter(v => v.address?.province === filters.province);
        }
        if (filters.city) {
            const citySearch = filters.city.toLowerCase().trim();
            result = result.filter(v =>
                v.address?.city?.toLowerCase().includes(citySearch)
            );
        }

        setFiltered(result);
    }, [filters, vehicles]);

    const resetFilters = () => {
        setFilters({ type: '', region: '', province: '', city: '' });
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
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
                        <label>Model</label>
                        <input
                            placeholder="Toyota Camry..."
                            value={filters.model}
                            onChange={e => setFilters(p => ({ ...p, model: e.target.value }))}
                        />
                    </div>

                    <div className="vl-filter-group">
                        <label>Vehicle Type</label>
                        <select
                            value={filters.type}
                            onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}
                        >
                            <option value="">All Types</option>
                            {vehicleTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="vl-filter-group">
                        <label>Region</label>
                        <select
                            value={filters.region}
                            onChange={e => setFilters(p => ({ ...p, region: e.target.value, province: '' }))}
                        >
                            <option value="">All Regions</option>
                            {getRegions().map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>

                    <div className="vl-filter-group">
                        <label>Province</label>
                        <select
                            value={filters.province}
                            onChange={e => setFilters(p => ({ ...p, province: e.target.value }))}
                            disabled={!filters.region}
                        >
                            <option value="">All Provinces</option>
                            {availableProvinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>

                    <div className="vl-filter-group">
                        <label>City</label>
                        <input
                            placeholder="e.g. Cebu City"
                            value={filters.city}
                            onChange={e => setFilters(p => ({ ...p, city: e.target.value }))}
                        />
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
                                <VehicleListCard key={v.id} v={v} i={i} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {isModalOpen && <AddVehicleModal toggleModal={toggleModal} />}
        </>
    );
}