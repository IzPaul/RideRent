import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Navbar.css";

interface NavbarProps{
    showLogout?: boolean;
    IsInside?: boolean;
}

export default function Navbar({ showLogout = true, IsInside = true}: NavbarProps) {
  const navigate = useNavigate();

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

            {showLogout && (
                <button
                className="logout-btn"
                onClick={() => {
                    console.log("Logging out...");
                    navigate("/");
                }}
                >
                LOGOUT
                </button>
            )}
        </div>
    </div>
  );
}