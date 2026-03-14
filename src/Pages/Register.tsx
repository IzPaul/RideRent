import Navbar from '../Components/Navbar.tsx'
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css";

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


        // Prepare the payload to match RegisterRequest.java exactly
        const registerPayload = {
            email: form.email,
            password: form.password,
            fullName: form.fullname, 
            phone: "",               
            address: ""
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerPayload),
            });

            // Since your backend returns a String, use .text()
            const result = await response.text();

            if (response.ok && result.includes("successfully")) {
                console.log("Success:", result);
                navigate("/vehicle-listing");
            } else {
                // This catches "Email already registered" from your AuthService
                showError(result);
            }
        } catch (err) {
            showError("Could not connect to backend. Ensure it is running on port 8080.");
        } finally {
            setLoading(false);
        }
    };

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