import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "../api/axios";
import BackButton from "../components/BackButton";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
export default function RFQDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
const [form, setForm] = useState({
  freight: "",
  origin: "",
  destination: "",
  transitTime: "",
  validity: "",
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const [logs, setLogs] = useState([]);

useEffect(() => {
  loadDetails();
   loadLogs();

  const interval = setInterval(() => {
    loadDetails();
     loadLogs();
  }, 3000);

  return () => clearInterval(interval);
}, []);

const loadLogs = async () => {
  try {
    const res = await axios.get(`/rfq/${id}/logs`);

    setLogs(
      res.data.logs ||
      res.data.data ||
      res.data ||
      []
    );
  } catch (err) {
    console.log("Logs failed");
  }
};
  const loadDetails = async () => {
  try {
    const detailsRes = await axios.get(`/rfq/${id}/details`);
    const boardRes = await axios.get(`/rfq/${id}/leaderboard`);
    // const boardRes = await axios.get(`/rfq/${id}/leaderboard`);
console.log("Leaderboard:", boardRes.data);

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

const loadHistory = async () => {
  try {
    const res = await axios.get(`/rfq/${id}/bids`);

    setHistory(
      res.data.bids ||
      res.data.data ||
      res.data ||
      []
    );

    setShowHistory(true);
  } catch (err) {
    alert("Failed to load history");
  }
};

 const submitBid = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`/rfq/${id}/bids`, form);

    loadDetails();
    loadHistory();
    setForm({
      freight: "",
      origin: "",
      destination: "",
      transitTime: "",
      validity: "",
    });
    
  } catch (err) {
  console.log("BID ERROR:", err.response?.data || err);

  alert(
    err.response?.data?.message ||
    err.message ||
    "Bid failed"
  );
}
};

// const getLiveStatus = () => {
//   if (!rfq) return "LOADING";

//   const now = new Date();
//   const start = new Date(rfq.startTime);
//   const end = new Date(rfq.endTime);
//   const forced = new Date(rfq.forcedCloseTime);

//   if (now < start) {
//     return "UPCOMING";
//   }

//   if (now >= start && now <= end) {
//     return "ACTIVE";
//   }

//   if (now > end && now <= forced) {
//     return "EXTENDED";
//   }

//   return "CLOSED";
// };
  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div style={styles.page}>
      <BackButton />
      {/* RFQ Info */}
      <div style={styles.card}>
  <div style={styles.topBar}>
    <h1>{rfq.name}</h1>

    {role === "buyer" && (
      <button
        style={styles.editBtn}
        onClick={() => navigate(`/edit-rfq/${id}`)}
      >
        Edit RFQ
      </button>
    )}
  </div>

  <p>Ref ID: {rfq.referenceId}</p>

  <p>Status: {rfq.status}</p>

  <p>
    Close Time:{" "}
    {new Date(rfq.endTime).toLocaleString()}
  </p>
</div>

      {/* Submit Bid */}
      {role === "supplier" && (
  <div style={styles.card}>
    <h2>Submit New Bid</h2>

   <form onSubmit={submitBid}>
  <input
    placeholder="Freight Charges"
    value={form.freight}
    onChange={(e) =>
      setForm({...form, freight:e.target.value})
    }
    style={styles.input}
    required
  />

  <input
    placeholder="Origin Charges"
    value={form.origin}
    onChange={(e) =>
      setForm({...form, origin:e.target.value})
    }
    style={styles.input}
    required
  />

  <input
    placeholder="Destination Charges"
    value={form.destination}
    onChange={(e) =>
      setForm({...form, destination:e.target.value})
    }
    style={styles.input}
    required
  />

  <input
    placeholder="Transit Time"
    value={form.transitTime}
    onChange={(e) =>
      setForm({...form, transitTime:e.target.value})
    }
    style={styles.input}
    required
  />

  <input
    placeholder="Validity"
    value={form.validity}
    onChange={(e) =>
      setForm({...form, validity:e.target.value})
    }
    style={styles.input}
    required
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

      {/*  all bids hostory */}
      <div style={styles.card}>
  <h2>All Bid History</h2>

  {role === "buyer" && !showHistory && (
    <button
      style={styles.button}
      onClick={loadHistory}
    >
      Show Full History
    </button>
  )}

 {showHistory &&
  history.map((bid, index) => (
    <div key={index} style={styles.bidRow}>
      <span>
        {bid.companyName ||
         bid.name ||
         bid.supplierName ||
         `Supplier ${bid.supplierId || ""}`}
      </span>

      <span>
        ₹{bid.totalPrice}
      </span>

      <span>
        {new Date(
          bid.createdAt
        ).toLocaleTimeString()}
      </span>
    </div>
  ))}
</div>

      {/* Logs */}
      <div style={styles.card}>
  <h2>Activity Logs</h2>

  {logs.length === 0 ? (
    <p>No logs available.</p>
  ) : (
    logs.map((log, index) => (
      <div key={index} style={styles.bidRow}>
        <span>
          {log.action || log.type || "Activity"}
        </span>

        <span>
          {log.message || log.reason || ""}
        </span>
      </div>
    ))
  )}
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
  topBar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
},

editBtn: {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#111827",
  color: "white",
  cursor: "pointer",
},
};