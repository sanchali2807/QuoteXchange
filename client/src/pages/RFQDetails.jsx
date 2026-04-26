import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
export default function RFQDetails() {
  const { id } = useParams();
  const { token } = useAuth();

let role = "";

try {
  if (token) {
    role = jwtDecode(token).role;
  }
} catch (err) {
  role = "";
}

  const [rfq, setRfq] = useState(null);
  const [bids, setBids] = useState([]);
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
  try {
    const detailsRes = await axios.get(`/rfq/${id}/details`);
    const boardRes = await axios.get(`/rfq/${id}/leaderboard`);

    setRfq(
      detailsRes.data.rfq ||
      detailsRes.data.data ||
      detailsRes.data
    );

    setBids(
      boardRes.data.leaderboard ||
      boardRes.data.data ||
      boardRes.data ||
      []
    );

  } catch (err) {
    setError("Failed to load RFQ");
  } finally {
    setLoading(false);
  }
};

  const submitBid = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/rfq/${id}/bids`, {
        totalPrice: price,
      });

      setPrice("");
      loadDetails();
    } catch (err) {
      alert("Bid failed");
    }
  };

  const getLiveStatus = () => {
  const now = new Date();
  const end = new Date(rfq.endTime);
  const forced = new Date(rfq.forcedCloseTime);

  if (now > forced) return "FORCED CLOSED";
  if (now > end) return "CLOSED";
  return "ACTIVE";
};
  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div style={styles.page}>
      {/* RFQ Info */}
      <div style={styles.card}>
        <h1>{rfq.name}</h1>

        <p>
          Ref ID: {rfq.referenceId}
        </p>

        <p>
          Status: {getLiveStatus()}
        </p>

        <p>
          Close Time:
          {" "}
          {new Date(
            rfq.endTime
          ).toLocaleString()}
        </p>
      </div>

      {/* Submit Bid */}
      {role === "supplier" && (
  <div style={styles.card}>
    <h2>Submit New Bid</h2>

    <form onSubmit={submitBid}>
      <input
        type="number"
        placeholder="Enter total price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        style={styles.input}
      />

      <button style={styles.button}>
        Submit Bid
      </button>
    </form>
  </div>
)}

      {/* Rankings */}
      <div style={styles.card}>
        <h2>Leaderboard</h2>

        {bids.length === 0 ? (
          <p>No bids yet</p>
        ) : (
          bids.map((bid, index) => (
            <div
              key={bid.id}
              style={styles.bidRow}
            >
              <span>
                L{index + 1}
              </span>

              <span>
                ₹{bid.totalPrice}
              </span>

              <span>
                {bid.companyName ||
                  "Supplier"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Logs */}
      <div style={styles.card}>
        <h2>Activity Logs</h2>
        <p>
          Bid submissions and auction
          extensions will appear here.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.08)",
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
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  bidRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
};