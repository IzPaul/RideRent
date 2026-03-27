
import Navbar from "../Components/Navbar.tsx";
import "../CSS/vehiclelisting.css";

export default function VehicleListing(){
    interface Vehicle {
        id: number;
        model: string;
        type: string;
        location: string;
        rating: number;
    }

    const dummyVehicles: Vehicle[] = [
    {
        id: 1,
        model: "Toyota Corolla",
        type: "Car",
        location: "Philippines, Eastern Visayas, Leyte, Ormoc City",
        rating: 4,
    },
    {
        id: 2,
        model: "Yamaha R15",
        type: "Motorcycle",
        location: "Philippines, Central Visayas, Cebu, Cebu City",
        rating: 5,
    },
    {
        id: 3,
        model: "Bike de pedal",
        type: "Bike",
        location: "Philippines, Central Visayas, Cebu, Cebu City",
        rating: 5,
    },
    {
        id: 4,
        model: "Tricycle",
        type: "Motorcycle",
        location: "Philippines, Eastern Visayas, Leyte, Ormoc City",
        rating: 5,
    },
    ];

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
                    <h1>Vehicle Listings</h1>

                    <div className="listing-container">
                    {dummyVehicles.map((vehicle) => (
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
                    ))}
                    </div>
                </div>
                </div>
        </>
    );
}