import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const res = await axios.get("/rfq/auctions");
      setRfqs(
       Array.isArray(res.data)
        ? res.data
        : res.data.rfqs ||
        res.data.data ||
        []
   );
    } catch (err) {
      setError("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1>RFQ Dashboard</h1>

        <div>
          <button
            style={styles.createBtn}
            onClick={() => navigate("/create-rfq")}
          >
            + Create RFQ
          </button>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <p>Loading auctions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && rfqs.length === 0 && (
        <p>No RFQs available</p>
      )}

      <div style={styles.grid}>
        {rfqs.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() =>
              navigate(`/rfq/${item.id}`)
            }
          >
            <h2>{item.name}</h2>

            <p>
              Ref ID: {item.referenceId}
            </p>

            <p>
              Status: {item.status}
            </p>

            <p>
              Close Time:
              {" "}
              {new Date(
                item.closeTime
              ).toLocaleString()}
            </p>

            <button style={styles.viewBtn}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  createBtn: {
    padding: "10px 15px",
    marginRight: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "10px 15px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },

  viewBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};