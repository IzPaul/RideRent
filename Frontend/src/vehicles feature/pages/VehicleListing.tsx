import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/Navbar.tsx';
import api from '../../api/axiosConfig';
import { usePhilippineGeography } from '../../shared/utils/PhilippinesGeography.js';
import '../styles/vehiclelisting.css';

export default function VehicleListing() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: '', region: '', province: '', city: '' });
    const navigate = useNavigate();

    const { getRegions, getProvincesByRegion } = usePhilippineGeography();

    const vehicleTypes = useMemo(() => {
        const types = [...new Set(vehicles.map(v => v.type).filter(Boolean))];
        return types.sort();
    }, [vehicles]);

    const availableProvinces = useMemo(() => {
        return getProvincesByRegion(filters.region);
    }, [filters.region, getProvincesByRegion]);

    useEffect(() => {
        api.get('/api/vehicles/vehicle-listing')
            .then(r => {
                setVehicles(r.data);
                setFiltered(r.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (filters.region === '') {
            setFilters(prev => ({ ...prev, province: '' }));
        }
    }, [filters.region]);

    useEffect(() => {
        let result = [...vehicles];

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

    const resetFilters = () => setFilters({ type: '', region: '', province: '', city: '' });

    const renderStars = (rating: number) => {
        const full = Math.floor(rating || 0);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    };

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

                    {/* Dynamic Vehicle Type */}
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

                    {/* Region Dropdown */}
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

                    {/* Province Dropdown (Cascading) */}
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

                    {/* City Text Field */}
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
                            <h1 className="vl-title">Available Vehicles</h1>
                            <p className="vl-sub">Find the perfect ride for your journey</p>
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
                                <div
                                    className="vl-card"
                                    key={v.id}
                                    style={{ animationDelay: `${i * 50}ms` }}
                                    onClick={() => navigate(`/vehicles/${v.id}`)}
                                >
                                    <div className="vl-card-img">
                                        {v.image
                                            ? <img src={`data:image/jpeg;base64,${v.image}`} alt={v.model} />
                                            : <div className="vl-img-placeholder"><span>🚗</span></div>
                                        }
                                        <span className="vl-type-chip">{v.type}</span>
                                    </div>
                                    <div className="vl-card-body">
                                        <h3 className="vl-card-model">{v.model}</h3>
                                        <p className="vl-card-location">
                                            📍 {[v.address?.city, v.address?.province].filter(Boolean).join(', ')}
                                        </p>
                                        <div className="vl-card-rating">
                                            <span className="vl-stars">{renderStars(v.rating)}</span>
                                            <span className="vl-rating-num">{v.rating?.toFixed(1) || '0.0'}</span>
                                        </div>
                                        <div className="vl-card-footer">
                                            <div>
                                                <span className="vl-price">₱{v.dailyRate?.toLocaleString()}</span>
                                                <span className="vl-per-day"> / day</span>
                                            </div>
                                            <button className="vl-view-btn">View →</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}