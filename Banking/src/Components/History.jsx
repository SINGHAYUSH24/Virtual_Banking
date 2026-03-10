import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AccountContext } from "./GlobalAccountContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../assets/History.module.css";

function History() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const { accounts } = useContext(AccountContext);
  const [lastPage, setLast] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
        if (!selectedAccount) return;
        const res = await axios.get(
          `http://localhost:9090/payments/history/${selectedAccount}`,
          {
            params: { page: page, size: 10 },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(res.data.content);
        setLast(res.data.last);
      } catch (err) {
        err.response.data.forEach((error) => toast.error(error));
        setInterval(()=>{
          navigate("/");
        },3500);
      }
    }
    fetchData();
  }, [selectedAccount, page]);

  useEffect(() => {
    setPage(0);
  }, [selectedAccount]);
  const parseLocalDateTime = (dateStr) => {
  if (!dateStr) return null;
  const normalized = dateStr.replace(/\.(\d{3})\d+/,".$1");
  const date = new Date(normalized);
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
  return [day,time];
}
  return (
    <div className={styles.container}>
      <ToastContainer autoClose={3000}/>
      <button className={styles.btn} onClick={()=>{navigate("/dashboard")}}>Back</button>
      <div className={styles.select}>
      <h3 className={styles.title}>Select Account</h3>
      <div className={styles.accountGrid}>
        {accounts.map((acc) => (
          <button
            key={acc}
            className={
              selectedAccount === acc ? styles.accountBtnActive : styles.accountBtn
            }
            onClick={() => setSelectedAccount(acc)}
          >
            XXXXXXXX {String(acc).substring(8)}
          </button>
        ))}
      </div>
      </div>
      {selectedAccount && (
        <>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Transaction History</span>
            <span className={styles.sectionTitle}>
              Download Statement 
              <svg width="30px" height="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="download"> <g> <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <g> <polyline data-name="Right" fill="none" id="Right-2" points="7.9 12.3 12 16.3 16.1 12.3" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> <line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="2.7" y2="14.2"></line> </g> </g> </g> </g> </g></svg>
            </span>
          </div>

          <div className={styles.tableWrapper}>
            {transactions.length === 0 ? (
              <div className={styles.emptyState}>No transactions found.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction Details</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td><b>{parseLocalDateTime(tx.createdAt)[0]}</b><br></br>{parseLocalDateTime(tx.createdAt)[1]}</td>
                      <td>
                        <div className={styles.txDetails}>
                          <span className={styles.txPrimary}>
                            {accounts.includes(tx.senderid)?'Paid To ':'Received From '}{tx.receiverName}
                          </span>
                          <span className={styles.txSecondary}>
                            Transaction ID <span className={styles.txPrimary}>{tx.id}</span>
                          </span>
                          <span className={styles.txSecondary}>
                            {accounts.includes(tx.senderid)?'Debited From ':'Credited To '}<span className={styles.txPrimary}>XXXXXXXX{String(tx.senderid).substring(8)}</span>
                          </span>
                        </div>
                      </td>
                      <td className={styles.amount}>₹{tx.amount}</td>
                      <td>
                        <span className={accounts.includes(tx.senderid)?styles.debit:styles.credit}>{accounts.includes(tx.senderid)?'DEBIT':'CREDIT'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              ← Prev
            </button>
            <span className={styles.pageInfo}>Page {page + 1}</span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={lastPage}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default History;
