import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import styles from "../assets/BankAccount.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
function BankAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', number: '', id: '', accounts: [] });
  const [formData, setForm] = useState({ account_id: '', receiver_id: '', amount: '', pin: '' });
  useEffect(() => {
    function fetchDetails() {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User Not Authenticated!");
                setTimeout(()=>{
                    navigate("/");
                },3500);
      }
      try {
        setData(location.state.data);
      } catch (err) {
        toast.error("Could Not Fetch Account Details!");
      }
    }
    fetchDetails();
  }, []);
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const token = localStorage.getItem("token");
      const res=await axios.post(`http://localhost:9090/payments/new`,formData,{headers:{'Authorization':`Bearer ${token}`}});
      toast.success("Payment Successful",{autoClose:2000,});
      setTimeout(()=>{
        navigate("/bill",{state:res.data});
      },2000);
    }catch(err){
      err.response.data.forEach((error)=>{
        toast.error(error);
      });
      const token = localStorage.getItem("token");
      if(token) return;
      setTimeout(()=>{
        navigate("/");
      },3500);
    }
  }
  return (
    <div className={styles.pageWrapper}>
      <ToastContainer autoClose={3000}/>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Transfer Money</h2>
        <p className={styles.formSubtitle}>Send funds securely to any bank account</p>
        <div className={styles.fieldGroup}>
          <label htmlFor="receiver_id" className={styles.fieldLabel}>
            Recipient's Bank Number
          </label>
          <input
            className={styles.fieldInput}
            type="text"
            name="receiver_id"
            id="receiver_id"
            placeholder="Enter account number"
            value={formData.receiver_id}
            onChange={handleChange}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="amount" className={styles.fieldLabel}>
            Transfer Amount
          </label>
          <input
            className={styles.fieldInput}
            type="number"
            name="amount"
            id="amount"
            placeholder="₹ 0.00"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Select Account</span>
          <div className={styles.accountsGrid}>
            {data.accounts.map((account) => (
              <span
                key={account.id}
                className={formData.account_id === account.id ? styles.accountChipActive : styles.accountChip}
                onClick={() => { setForm(prev => ({ ...prev, account_id: account.id })); }}
              >
                ID: {account.id}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="pin" className={styles.fieldLabel}>
            UPI PIN
          </label>
          <input
            className={styles.fieldInput}
            type="password"
            name="pin"
            id="pin"
            placeholder="••••"
            value={formData.pin}
            onChange={handleChange}
          />
        </div>
        <button className={styles.submitBtn} onClick={handleSubmit}>Transfer</button>
      </div>
    </div>
  );
}
export default BankAccount;