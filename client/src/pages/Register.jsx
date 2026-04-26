import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import BackButton from "../components/BackButton";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Register() {
  const navigate = useNavigate();
const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName:"",
    role: "supplier"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/register", form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
  console.log(err);
  setError(
    err?.response?.data?.message ||
    err?.message ||
    "Registration failed"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          Join RFQ Auction System
        </p>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
            style={styles.input}
          />          

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="supplier">
              Supplier
            </option>
            <option value="buyer">
              Buyer
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have account?{" "}
          <Link to="/">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#111827,#1e1b4b)",
  },

  card: {
    width: "500px",
    padding: "35px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: "25px",
  },

  input: {
    width: "96%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  button: {
    width: "101%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
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