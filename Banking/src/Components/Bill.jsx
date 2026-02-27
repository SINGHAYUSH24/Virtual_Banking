import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

function Bill() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({
    id: "",
    type: "",
    amount: "",
    account_id: "",
    time: "",
    receiver_id: "",
  });
  useEffect(() => {
    if (!location.state) return;
    const {
      id,
      type,
      amount,
      senderid,
      createdAt,
      receiverid,
    } = location.state;
    const date = parseJavaLocalDateTime(createdAt);
    if (!date) return;
    const time = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    const day = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
    setData({id,type,amount,account_id:senderid,time: `${time} on ${day}`,receiver_id: String(receiverid),});
  }, [location.state]);
  const parseJavaLocalDateTime = (dateStr) => {
  if (!dateStr) return null;
  const normalized = dateStr.replace(/\.(\d{3})\d+/,".$1");
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
};
  return (
    <div
      style={{minHeight: "100vh",background: "#f2f3f7",display: "flex",justifyContent: "center",alignItems: "center",}}>
      <div style={{width: "75%",background: "#ffffff",padding: "40px",borderRadius: "12px",boxShadow: "0 8px 24px rgba(0,0,0,0.1)",fontFamily: "Arial, sans-serif",}}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#2e7d32" }}>Transaction Successful</h1>
          <p style={{ color: "#555" }}>{data.time}</p>
        </div>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#24368d" }}>Paid To</h2>
          <p style={{ fontSize: "18px", fontWeight: "bold",color: "#555"}}>
            XXXXXXXX {data.receiver_id?.substring(8)}
          </p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#24368d" }}>Payment Details</h2>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Transaction ID</span>
            <strong style={{ fontSize: "18px", fontWeight: "bold",color: "#555"}}>{data.id}</strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <span>Debited From</span>
            <strong style={{ fontSize: "18px", fontWeight: "bold",color: "#555"}}>Account: {data.account_id}</strong>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <div style={{ textAlign: "right", fontSize: "20px" }}>
            Bill Amount: <strong style={{ fontSize: "18px", fontWeight: "bold",color: "#555"}}>₹{data.amount}</strong>
          </div>
        </div>

        <div style={{display: "flex",justifyContent: "center",gap: "20px",}}>
          <button onClick={() => navigate("/dashboard")} style={buttonStyle}>
            Home
          </button>

          <button onClick={() => navigate("/bank")} style={{ ...buttonStyle, background: "#1976d2" }}>
            Another Payment
          </button>
        </div>
      </div>
    </div>
  );
}
const buttonStyle = {
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  background: "#2e7d32",
  color: "#fff",
};

export default Bill;