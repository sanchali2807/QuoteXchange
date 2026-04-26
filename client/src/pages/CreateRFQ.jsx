import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function CreateRFQ() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    referenceId: "",
    startTime: "",
    closeTime: "",
    forcedCloseTime: "",
    triggerWindow: 10,
    extensionDuration: 5,
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
      await axios.post("/rfq", form);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create RFQ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Create New RFQ</h1>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="RFQ Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="referenceId"
            placeholder="Reference ID"
            value={form.referenceId}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Close Time</label>
          <input
            type="datetime-local"
            name="closeTime"
            value={form.closeTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Forced Close Time</label>
          <input
            type="datetime-local"
            name="forcedCloseTime"
            value={form.forcedCloseTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="number"
            name="triggerWindow"
            placeholder="Trigger Window (mins)"
            value={form.triggerWindow}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="extensionDuration"
            placeholder="Extension Duration (mins)"
            value={form.extensionDuration}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create RFQ"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  card: {
    width: "500px",
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "15px",
  },
};