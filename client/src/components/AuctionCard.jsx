import { useNavigate } from "react-router-dom";

export default function AuctionCard({ item }) {
  const navigate = useNavigate();

  const getStatusColor = () => {
    const status = item.status?.toUpperCase();

    if (status === "CLOSED") return "#dc2626";
    if (status === "FORCED CLOSED") return "#7c3aed";
    return "#16a34a";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <h2 style={styles.title}>{item.name}</h2>

        <span
          style={{
            ...styles.badge,
            background: getStatusColor(),
          }}
        >
          {item.status || "ACTIVE"}
        </span>
      </div>

      <p><strong>Ref ID:</strong> {item.referenceId}</p>

      <p><strong>Lowest Bid:</strong> ₹{item.lowestBid ?? "No Bid"}</p>

      <p><strong>Close Time:</strong> {formatDate(item.endTime)}</p>

      <p><strong>Forced Close:</strong> {formatDate(item.forcedCloseTime)}</p>

      <button
        style={styles.button}
        onClick={() => navigate(`/rfq/${item.id}`)}
      >
        View Auction
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    gap: "10px",
  },
  title: { margin: 0, fontSize: "20px" },
  badge: {
    color: "white",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  button: {
    marginTop: "18px",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
};