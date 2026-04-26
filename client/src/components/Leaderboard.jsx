export default function Leaderboard({ bids = [] }) {
  return (
    <div style={styles.card}>
      <h2>Leaderboard</h2>

      {bids.length === 0 ? (
        <p>No bids yet</p>
      ) : (
        bids.map((bid, index) => (
          <div
            key={bid.id || index}
            style={styles.row}
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
  );
}

const styles = {
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
};