import { useState,useEffect } from "react";
import { useNavigate,useLocation } from "react-router";
import styles from "../assets/BalanceCheck.module.css";
import BankIcon from "../assets/BankIcon";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BalanceCheck = () => {
  const [accounts, setAccount] = useState([]);
  const [data, setData] = useState({id:"",pin:""});
  const [balance,setBalance]=useState({id:"",amount:""});
  const navigate=useNavigate();
  const location=useLocation();
  const CheckIcon = ({ size = 60, color = "#1dc25c" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.15"/>
    <path d="M12 21L18 27L29 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
  useEffect(()=>{
    async function fetchDetails(){
        const token=localStorage.getItem("token");
        if(!token){
            navigate("/");
        }
        try{
            const data=location.state.data;
            setAccount(data.accounts.map(account=>(account.id)));
            console.log(accounts);
        }catch(err){
            toast.error("Could Not Fetch Account Details!");
            setTimeout(()=>{
                navigate("/");
            },3500);
        }
    }
    fetchDetails();
  },[location.state]);
  const handleConfirm = async(e) => {
    e.preventDefault();
    try{
        const token=localStorage.getItem("token");
        if(!token){
            toast.error("Please Log In Again!");
            setTimeout(()=>{
                navigate("/");
            },3500);
        }
        const res=await axios.post(`http://localhost:9090/account/balance`,data,{headers:
            {
                'Authorization':`Bearer ${token}`
            }
        });
        const response=res.data;
        setData({id:"",pin:""});
        setBalance({id:response.id,amount:response.balance});
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
  const handleCancel = () => {
    setData({id:"",pin:""});
    setBalance({id:"",amount:""});
  };

  return (
    <div className={styles.pageWrapper}>
    <ToastContainer autoClose={3000}/>
    <div className={styles.mobileWrapper}>
      <h1 className={styles.pageTitle}>Check Balance</h1>
      <p className={styles.pageSubtitle}>Select an account to view your balance</p>

      <div className={styles.accountsList}>
        {accounts.map((acc) => (
          <div
            key={acc}
            className={styles.accountItem}
            onClick={() => setData(prev=>({...prev,id:acc}))}
          >
            <div className={styles.accountLeft}>
              <span className={styles.accountName}>{acc}</span>
              <span className={styles.accountNumber}>{acc}</span>
            </div>
            <span className={styles.accountType}>SAVINGS</span>
          </div>
        ))}
      </div>
      {balance.amount&&(
        <div className={styles.checkbox}>
            <div className={styles.check}>
                <CheckIcon/>
                <h2 style={{fontWeight:"700",color:"gray"}}>Balance Check Successful</h2>
                <h4>Account:{balance.id}</h4>
                <h2 style={{fontFamily:"1.5rem",fontWeight:"800"}}>₹{balance.amount}</h2>
            </div>
        </div>
      )}
      <div>
        <BankIcon size={150} color={"hsl(206, 65%, 29%)"}/>
      </div>
      {data.id && (
        <div className={styles.overlay} onClick={handleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Enter UPI PIN</h2>
            <p className={styles.modalAccount}>
              {data.id} · SAVINGS
            </p>

            <label htmlFor="upi-pin" className={styles.fieldLabel}>
              UPI PIN
            </label>
            <input
              className={styles.pinInput}
              type="password"
              id="upi-pin"
              maxLength={6}
              placeholder="••••"
              value={data.pin}
              onChange={(e) => setData(prev=>({...prev,pin:e.target.value}))}
              autoFocus
            />

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BalanceCheck;
