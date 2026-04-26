import { useEffect, useState } from "react";

export default function Countdown({
  endTime,
}) {
  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    const timer =
      setInterval(() => {
        const diff =
          new Date(endTime) -
          new Date();

        if (diff <= 0) {
          setTimeLeft(
            "Auction Closed"
          );
          return;
        }

        const hrs =
          Math.floor(
            diff /
              1000 /
              60 /
              60
          );

        const mins =
          Math.floor(
            (diff /
              1000 /
              60) %
              60
          );

        const secs =
          Math.floor(
            (diff / 1000) %
              60
          );

        setTimeLeft(
          `${hrs}h ${mins}m ${secs}s`
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [endTime]);

  return (
    <div style={styles.box}>
      <strong>
        Time Left:
      </strong>{" "}
      {timeLeft}
    </div>
  );
}

const styles = {
  box: {
    background: "#111827",
    color: "white",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
};