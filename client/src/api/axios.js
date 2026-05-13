import axios from "axios";

// This creates a custom Axios object named api.
const api = axios.create({
    
    baseURL : import.meta.env.VITE_API_URL
});
console.log(import.meta.env.VITE_API_URL);
// interceptor means Run some code before every request goes to backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.some((route) =>
    config.url.includes(route)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use((res)=>res,(err)=>{
    if(err.response?.status === 401){
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
})

export default api;