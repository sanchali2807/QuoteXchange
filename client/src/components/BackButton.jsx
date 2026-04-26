import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button onClick={handleBack} style={styles.back}>
      ← Back
    </button>
  );
}

const styles = {
  back: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#111827",
    color: "white",
    marginBottom: "20px"
  }
};