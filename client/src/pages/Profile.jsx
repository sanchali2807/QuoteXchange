import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.card}>
        <h1>My Profile</h1>

        <p>
          User details will load here.
        </p>

        <p>
          Name: Demo User
        </p>

        <p>
          Role: Buyer / Supplier
        </p>

        <p>
          Email: user@email.com
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
  },

  card: {
    maxWidth: "700px",
    margin: "30px auto",
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },
};