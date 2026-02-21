import Navbar from '../Components/Navbar.tsx'
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css";


export default function Login(){
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
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
                    <h2>Welcome to RideRent</h2>
                    <p className="subtitle">Please enter your details</p>

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Email"
                        className="input"
                        name="username"
                        value={form.username}
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
                        {loading ? "Logging In..." : "Log In"}
                    </button>
                    </form>

                    <p className="switch-auth">
                    Don’t have an account?{" "}
                    <span onClick={() => navigate("/register")}>Register</span>
                    </p>
                </div>
                </div>
            </main>
        </>
    );
}