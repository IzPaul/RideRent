import Navbar from '../Components/Navbar.tsx'
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css";

export default function Register(){
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullname: "",email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError("");
    };
    const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
        navigate("/vehicle-listing")
    }

    return (
        <>
            <Navbar showLogout={false} IsInside={false}/>
            <main className="login-wrapper">
                <div className="login-grid">
                <h1 className="hero-title">Ride<br />Rent Images</h1>

                <div className="login-card">
                    <h2>Register to RideRent</h2>
                    <p className="subtitle">Please enter your details on required fields</p>

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input"
                        name="fullname"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        className="input"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? "Signing In..." : "Register"}
                    </button>
                    </form>

                    <p className="switch-auth">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/")}>Log In</span>
                    </p>
                </div>
                </div>
            </main>
        </>
    );
}