
export default function VehicleFilterSidebar(){


    return(
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
    );
}