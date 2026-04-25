import axios from "axios";

// This creates a custom Axios object named api.
const api = axios.create({
    baseURL : "http://localhost:8300/api"
});

// interceptor means Run some code before every request goes to backend
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    // Only add auth header when user is logged in.
    if(token){
        // Add JWT header
        config.headers.Authorization = `bearer ${token}`
    }
    return config;
})

export default api;