export default function LogsTable({
  logs = [],
}) {
  return (
    <div style={styles.card}>
      <h2>Activity Logs</h2>

      {logs.length === 0 ? (
        <p>No logs available</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {logs.map(
              (log, index) => (
                <tr
                  key={
                    log.id ||
                    index
                  }
                >
                  <td>
                    {log.createdAt
                      ? new Date(
                          log.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    {log.type ||
                      "Update"}
                  </td>

                  <td>
                    {log.message ||
                      "Activity happened"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
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

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
  },
};