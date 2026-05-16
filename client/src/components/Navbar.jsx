import { useNavigate } from "react-router-dom";
import { useAuth , } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout ,role} = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <h2
        style={styles.logo}
        onClick={() => navigate("/")}
      >
        RFQ Auction
      </h2>

      <div style={styles.right}>
        <button
          style={styles.btn}
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        {role === "buyer" && (
          <button
            style={styles.btn}
            onClick={() => navigate("/create-rfq")}
          >
            + New RFQ
          </button>
        )}

        <button
          style={styles.logout}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    background: "#111827",
    color: "white",
    padding: "16px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },

  logo: {
    margin: 0,
    cursor: "pointer",
  },

  right: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logout: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
};