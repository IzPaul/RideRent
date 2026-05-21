import api, { uploadImage } from '../../api/axiosConfig';
import Navbar from '../../shared/Navbar.tsx'
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../../shared/RideRentLogo.png";


export default function Login(){
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const showError = (message: React.SetStateAction<string>) => {
        setError("❗"+message);

        setTimeout(() => {
            setError("");
        },3000);
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
            const response = await api.post("/api/auth/login", {
                email: form.email,
                password: form.password
            });

            const result = response.data;

            if (response.status === 200 && result.includes("successful")) {
                localStorage.setItem("email", form.email);
                navigate("/vehicle-listing");
            } else {
                showError("Invalid credentials");
            }
        } catch (err: any) {
            console.error(err);
            showError("Network error: Please check your connection");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Navbar IsInside={false} showSettings={false}/>
            <main className="login-wrapper">
                <div className="login-grid">
                <img className="logo-image" src={logo} alt="RideRentLogo" />


                <div className="login-card">
                    <h2>Welcome to RideRent</h2>
                    <p className="subtitle">Please enter your details</p>

                    <div className={error && "error-alert"}>{error}</div>

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