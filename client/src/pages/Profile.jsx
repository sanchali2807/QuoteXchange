import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
export default function Profile() {
  const { token } = useAuth();

  let user = {};

  try {
    if (token) {
      user = jwtDecode(token);
    }
  } catch (err) {
    user = {};
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <BackButton />
        <h1 style={styles.title}>
          My Profile
        </h1>
{/* 
        <div style={styles.row}>
          <span style={styles.label}>User ID</span>
          <span>{user.id || "N/A"}</span>
        </div> */}

        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <span>{user.name || "N/A"}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <span>{user.email || "N/A"}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Role</span>

          <span
            style={{
              ...styles.badge,
              background:
                user.role === "buyer"
                  ? "#2563eb"
                  : "#16a34a",
            }}
          >
            {user.role || "N/A"}
          </span>
        </div>
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

  card: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "white",
    padding: "35px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "25px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #eee",
    gap: "20px",
  },

  label: {
    fontWeight: "bold",
    color: "#374151",
  },

  badge: {
    color: "white",
    padding: "6px 12px",
    borderRadius: "999px",
    textTransform: "capitalize",
    fontSize: "14px",
  },
};