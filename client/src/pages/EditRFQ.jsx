import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

export default function EditRFQ() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    referenceId: "",
    closeTime: "",
    forcedCloseTime: "",
    triggerWindow: 10,
    extensionDuration: 5,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRFQ();
  }, []);

  const loadRFQ = async () => {
    try {
      const res = await axios.get(`/rfq/${id}/details`);

      const data =
        res.data.rfq ||
        res.data.data ||
        res.data;

      setForm({
        name: data.name || "",
        referenceId:
          data.referenceId || "",
        closeTime: formatDate(
          data.closeTime
        ),
        forcedCloseTime: formatDate(
          data.forcedCloseTime
        ),
        triggerWindow:
          data.triggerWindow || 10,
        extensionDuration:
          data.extensionDuration || 5,
      });
    } catch (err) {
      setError("Failed to load RFQ");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value)
      .toISOString()
      .slice(0, 16);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await axios.put(`/rfq/${id}`, form);

      navigate(`/rfq/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Edit RFQ</h1>

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
            style={styles.input}
          />

          <input
            name="referenceId"
            placeholder="Reference ID"
            value={form.referenceId}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Close Time</label>
          <input
            type="datetime-local"
            name="closeTime"
            value={form.closeTime}
            onChange={handleChange}
            style={styles.input}
          />

          <label>
            Forced Close Time
          </label>
          <input
            type="datetime-local"
            name="forcedCloseTime"
            value={form.forcedCloseTime}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="triggerWindow"
            placeholder="Trigger Window"
            value={form.triggerWindow}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="extensionDuration"
            placeholder="Extension Duration"
            value={form.extensionDuration}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            {saving
              ? "Saving..."
              : "Update RFQ"}
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
    background: "#111827",
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