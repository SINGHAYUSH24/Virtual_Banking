import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../assets/PayeeManager.module.css";

function PayeeManager() {
  const [payees, setPayees] = useState([]);
  const [form, setForm] = useState({ payeeAccountId: "", payeeName: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPayees = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const API_URL = import.meta.env.VITE_APP_API_URL;
      const res = await axios.get(`${API_URL}/user/payees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayees(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch payees");
    }
  };

  useEffect(() => {
    fetchPayees();
    // Periodically update cooling statuses every 30 seconds
    const interval = setInterval(() => {
      setPayees((prev) => [...prev]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.payeeAccountId || !form.payeeName) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_APP_API_URL;
      const res = await axios.post(
        `${API_URL}/user/payee/add`,
        {
          payeeAccountId: Number(form.payeeAccountId),
          payeeName: form.payeeName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data || "Payee registered successfully!");
      setForm({ payeeAccountId: "", payeeName: "" });
      fetchPayees();
    } catch (err) {
      // Show backend mismatch validation message directly
      toast.error(err.response?.data?.message || err.response?.data || err.message || "Failed to register payee");
    }
  };

  const getCooldownStatus = (createdAtStr) => {
    const createdAt = new Date(createdAtStr);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffMins = diffMs / 1000 / 60;

    if (diffMins < 10) {
      const remainingMins = Math.ceil(10 - diffMins);
      return {
        isCooling: true,
        text: `Cooling Period (${remainingMins}m left)`,
        limitText: "Limit: ₹5,000",
      };
    }
    return {
      isCooling: false,
      text: "Active",
      limitText: "Standard Limit",
    };
  };

  const handlePay = (payeeAccountId) => {
    navigate("/bank", {
      state: {
        data: location.state?.data,
        receiver_id: payeeAccountId,
      },
    });
  };

  return (
    <div className={styles.container}>
      <ToastContainer autoClose={3000} />
      <div className={styles.wrapper}>
        
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Manage Beneficiaries</h1>
          <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>

        {/* Add Payee Form */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Register New Payee</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Recipient Account Number</label>
              <input
                className={styles.input}
                type="number"
                name="payeeAccountId"
                value={form.payeeAccountId}
                onChange={handleChange}
                placeholder="e.g. 100234567"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Recipient Registered Name</label>
              <input
                className={styles.input}
                type="text"
                name="payeeName"
                value={form.payeeName}
                onChange={handleChange}
                placeholder="Enter exact full name (e.g. John Doe)"
              />
            </div>
            <button className={styles.submitBtn} type="submit">
              Register Beneficiary
            </button>
          </form>
        </div>

        {/* Payee List */}
        <div className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Registered Beneficiaries</h2>
          <div className={styles.payeeList}>
            {payees.length === 0 ? (
              <div className={styles.emptyState}>No payees registered yet.</div>
            ) : (
              payees.map((payee) => {
                const status = getCooldownStatus(payee.createdAt);
                return (
                  <div key={payee.id} className={styles.payeeCard}>
                    <div className={styles.payeeDetails}>
                      <p className={styles.payeeName}>{payee.payeeName}</p>
                      <p className={styles.payeeAcc}>Account: #{payee.payeeAccountId}</p>
                      <div className={styles.badgeGroup}>
                        <span
                          className={`${styles.badge} ${
                            status.isCooling ? styles.badgeCooling : styles.badgeActive
                          }`}
                        >
                          {status.text}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeLimit}`}>
                          {status.limitText}
                        </span>
                      </div>
                    </div>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handlePay(payee.payeeAccountId)}
                    >
                      Pay Now
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PayeeManager;
