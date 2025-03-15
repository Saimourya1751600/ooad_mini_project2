import axios from "axios";

export const loginUser = async (credentials) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    return await axios.post("http://localhost:5000/api/auth/register", userData);
};
