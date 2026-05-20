export default function(Vehicle vehicle){


    return(
        <>
            <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-image">Image</div>

                <div className="vehicle-info">
                    <h3>{vehicle.model}</h3>
                    <p>Vehicle Type: {vehicle.type}</p>
                    <p>Location: {vehicle.location}</p>
                </div>

                <div className="vehicle-rating">
                    {"★".repeat(vehicle.rating)}
                    {"☆".repeat(5 - vehicle.rating)}
                </div>
            </div>
        </>
    );
}