import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import BackButton from "../components/BackButton";
export default function CreateRFQ() {
  const navigate = useNavigate();

const [form, setForm] = useState({
  name: "",
  referenceId: "",
  startTime: "",
  endTime: "",
  forcedCloseTime: "",
  pickupDate: "",
  xMinutes: 5,
  yMinutes: 10,
  triggerType: "ANY",
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

      navigate("/");
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
        <BackButton />
        <h1 style={styles.title}>Create New RFQ</h1>

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

          <label style={styles.label}>Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Close Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Forced Close Time</label>
          <input
            type="datetime-local"
            name="forcedCloseTime"
            value={form.forcedCloseTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

         <label style={styles.label}>Trigger Window</label>
          <input
            type="number"
            name="xMinutes"
            placeholder="Trigger Window (mins)"
            value={form.xMinutes}
            onChange={handleChange}
            style={styles.input}
          />
           <label style={styles.label}>Extension Duration</label>
          <input
            type="number"
            name="yMinutes"
            placeholder="Extension Duration (mins)"
            value={form.yMinutes}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={form.pickupDate}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>Trigger Type</label>
            <select
            name="triggerType"
            value={form.triggerType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="ANY">ANY</option>
            <option value="BID_LAST_X">BID_LAST_X</option>
            <option value="RANK_CHANGE">RANK_CHANGE</option>
            <option value="L1_CHANGE">L1_CHANGE</option>
          </select>
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
    alignItems: "flex-start", // top align
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "720px", // wider form
    background: "white",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
    marginTop: "10px",
  },

  input: {
    width: "100%",
    padding: "16px 18px",
    marginBottom: "18px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "18px",
    boxSizing: "border-box", // IMPORTANT FIX
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "16px",
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "15px",
    fontSize: "15px",
  },
};