import api, { uploadImage } from '../../api/axiosConfig';
import Navbar from '../../shared/Navbar.tsx'
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Register(){
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullname: "",email: "", password: "" });
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

        if(!form.email){
            showError("Email is required");
            return
        }
        if(form.password.toString().length < 8){
            showError("Must be at least 8 characters");
            return
        }

        const registerPayload = {
            email: form.email,
            password: form.password,
            fullName: form.fullname, 
            phone: "",               
            address: ""
        };

        try {
            const response = await api.post("/api/auth/register", registerPayload);

            const result = await response.text();

            if (response.ok && result.includes("successfully")) {
                console.log("Success:", result);
                navigate("/");
            } else {
                showError(result.toString();
            }
        } catch (err) {
            showError(err.response?.data || "Registration failed. Please try again.");
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
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        className="input"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        name="password" 
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? "Signing In..." : "Register"}
                    </button>
                    </form>

                    <p className="switch-auth">
                    Already have an account?{" "}
                    <span className='link-btn' onClick={() => navigate("/")}>Log In</span>
                    </p>
                </div>
                </div>
            </main>
        </>
    );
}