import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.page}>
      <h1>404</h1>

      <p>Page Not Found</p>

      <Link to="/">
        Go Home
      </Link>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection:
      "column",
    justifyContent:
      "center",
    alignItems:
      "center",
    gap: "12px",
  },
};