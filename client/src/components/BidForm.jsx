import { useState } from "react";

export default function BidForm({
  onSubmit,
}) {
  const [price, setPrice] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(price);

    setPrice("");
  };

  return (
    <div style={styles.card}>
      <h2>Submit Bid</h2>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="number"
          placeholder="Enter Price"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
          required
          style={styles.input}
        />

        <button
          style={
            styles.button
          }
        >
          Submit
        </button>
      </form>
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

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border:
      "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "12px",
    background:
      "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
};