export default function EmptyState({
  message = "No Data Found",
}) {
  return (
    <div style={styles.box}>
      <p>{message}</p>
    </div>
  );
}

const styles = {
  box: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#6b7280",
  },
};