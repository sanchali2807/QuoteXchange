import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";


import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import AuctionCard from "../components/AuctionCard";

export default function Dashboard() {
  const navigate = useNavigate();

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

  return (
    <div style={styles.page}>
   

      {loading && <Loader />}

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      {!loading && rfqs.length === 0 && (
        <EmptyState message="No RFQs Available" />
      )}

      <div style={styles.grid}>
        {rfqs.map((item) => (
  <AuctionCard
    key={item.id}
    item={item}
  />
))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
  },

  error: {
    color: "red",
    padding: "20px 30px",
  },

  grid: {
    padding: "30px",
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
    transition: "0.2s",
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