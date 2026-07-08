import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../assets/AdminPanel.module.css";

export default function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle 204 No Content or empty responses
      if (res.status === 204 || !res.data) {
        setRequests([]);
      } else {
        setRequests(res.data);
      }
    } catch (err) {
      // 204 can also trigger error or empty response in some libraries
      if (err.response?.status === 204) {
        setRequests([]);
      } else {
        toast.error("Failed to load merchant requests");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchRequests();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/admin/approve/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message || "Request approved successfully!");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Approval failed.");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/admin/reject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.info(res.data.message || "Request rejected successfully.");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Rejection failed.");
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer autoClose={3000} />
      <nav className={styles.navbar}>
        <span className={styles.navBrand}>Net Pay Admin</span>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </nav>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Merchant Approvals</h1>
          <p className={styles.subtitle}>Review and approve business account requests</p>
        </div>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner} />
            <p>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>No Pending Requests</h3>
            <p>There are no merchant registration requests awaiting approval.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Business Name</th>
                  <th>Category</th>
                  <th>Account ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className={styles.tableRow}>
                    <td>
                      <span className={styles.badgeId}>#{req.id}</span>
                    </td>
                    <td>
                      <strong>{req.merchantName}</strong>
                    </td>
                    <td>
                      <span className={styles.badgeCategory}>
                        {req.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className={styles.accountId}>
                      XXXXXXXX{String(req.userId).substring(8)}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.approveBtn}
                          onClick={() => handleApprove(req.id)}
                        >
                          Approve
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() => handleReject(req.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
