import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", form);

      // Save token in AuthContext + localStorage
      login(res.data.token);

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>RFQ Auction Login</h1>
        <p style={styles.subtitle}>
          Welcome back
        </p>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.bottomText}>
          New user?{" "}
          <Link to="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    borderRadius:"20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#1e1e2f,#111827)",
  },

  card: {
    width: "400px",
    padding: "35px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  subtitle: {
    textAlign: "center",
    color: "black",
    marginBottom: "25px",
  },

  input: {
    width: "95%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  button: {
    width: "102%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  
  },

  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
  },

  bottomText: {
    marginTop: "18px",
    textAlign: "center",
    fontSize: "14px",
  },
};


