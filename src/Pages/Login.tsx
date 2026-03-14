import Navbar from '../Components/Navbar.tsx'
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css";


export default function Login(){
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const showError = (message: React.SetStateAction<string>) => {
        setError("❗"+message);

        // setTimeout(() => {
        //     setError("");
        // },3000);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError("");
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: form.email, 
                password: form.password
            }),
        });

        const result = await response.text();

        if (response.ok && result === "Login successful") {
            //localStorage.setItem("email", result.email);
            navigate("/vehicle-listing");
        } else {
            showError("Invalid credentials");
        }
    } catch (err) {
        showError("Network error: Is your backend running on port 8080?");
    } finally {
        setLoading(false);
    }
};


    return (
        <>
            <Navbar IsInside={false} showSettings={false}/>
            <main className="login-wrapper">
                <div className="login-grid">
                <h1 className="hero-title">Ride<br />Rent Images</h1>

                <div className="login-card">
                    <h2>Welcome to RideRent</h2>
                    <p className="subtitle">Please enter your details</p>

                    <div className="error-alert">{error}</div>

                    <form onSubmit={handleSubmit}>
                    <input
                        type="email"
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
                        {loading ? "Logging In..." : "Log In"}
                    </button>
                    </form>

                    <p className="switch-auth">
                    Don’t have an account?{" "}
                    <span className='link-btn' onClick={() => navigate("/register")}>Register</span>
                    </p>
                </div>
                </div>
            </main>
        </>
    );
}