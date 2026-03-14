import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Navbar.css";

interface NavbarProps{
    showSettings?: boolean;
    IsInside?: boolean;
}

export default function Navbar({IsInside = true, showSettings = true}: NavbarProps) {
    const navigate = useNavigate();
    const [openDropdown,setOpenDropdown] = useState(false);

    const toggleDropdown = () => {
        setOpenDropdown(!openDropdown);
    };
    const handleLogout = () => {
        console.log("Logging out...");
        navigate("/");
    }
    const toProfile = () => {
        navigate("/profile");
    }

    return (
        <div className="navbar">
        <button className="logo-btn" onClick={() => navigate("/")}>
            RideRent
        </button>
            <div className="nav-btn-wrapper-parent">
                {IsInside && (
                    <div className="nav-btn-wrapper">
                        <button
                            className="nav-btn"
                            onClick={() => {
                            navigate("/vehicle-listing");
                        }}>
                            Vehicle Listing
                        </button>

                        <button
                            className="nav-btn"
                            onClick={() => {
                            navigate("/my-bookings");
                        }}>
                            My Bookings
                        </button>

                        <button
                            className="nav-btn"
                            onClick={() => {
                            navigate("/my-vehicles");
                        }}>
                            Vehicle Listing
                        </button>
                    </div>
                )}

                {showSettings && (
                    <div className="dropdown">
                        <button className="logout-btn" onClick={toggleDropdown}>
                            Menu
                        </button>
                        {openDropdown && (
                            <div className="dropdown choices">
                                <button onClick={toProfile}className="dropdown choices">Profile</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}