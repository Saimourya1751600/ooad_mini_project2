import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
    const [userData, setUserData] = useState({ username: "", password: "", role: "customer" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser(userData);
        navigate("/login");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
            <select onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
                <option value="customer">Customer</option>
                <option value="service_provider">Service Provider</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
