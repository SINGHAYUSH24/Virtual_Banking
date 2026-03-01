import {useState,useEffect} from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
import styles from "../assets/Dashboard.module.css";
function Dashboard(){
    const [data,setData]=useState({name:'',number:'',id:'',accounts:[]});
    const [userAccounts,setAccounts]=useState([]);
    const [transactions,setTransactions]=useState([]);
    const navigate=useNavigate();
    useEffect(()=>{
      async function fetchDetails(){
        const token=localStorage.getItem("token");
        if(!token){
            navigate("/");
        }
        try{
            const res=await axios.get('http://localhost:9090/user/profile',
                {
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                }
            );
            const data=res.data;
            setData({id:data.id,name:data.name,number:data.number,accounts:data.accounts});
            data.accounts.forEach(account=>(setAccounts(prev=>([...prev,account.id]))));
            const response=await axios.get(`http://localhost:9090/account/all/${data.number}`,
                {
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                }
            );
            const accounts=response.data;
            const all=[];
            accounts.forEach(account=>account.transactions.forEach(transaction=>(all.push(transaction))));
            const uniqueTransactions = [...new Map(all.map(tx => [tx.id, tx])).values()];
            uniqueTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTransactions(uniqueTransactions);
          }catch(err){
            toast.error("error");
        }
      }
      fetchDetails(); 
    },[]);
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
  return `${time} on ${day}`;
  }
    return (
    <div className={styles.dashboardWrapper}>
      <nav className={styles.navbar}>
        <span className={styles.navBrand}>Net Pay</span>
        <div className={styles.navActions}>
          <button className={styles.navBtn}>
            {//<User size={16} />
            }
            Profile
          </button>
          <button className={styles.logoutBtn}>
            {//<LogOut size={16} />
            }
            Logout
          </button>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <section className={styles.accountsSection}>
          <h2 className={styles.sectionTitle}>Your Accounts</h2>
          <div className={styles.accountsScroll}>
            {data.accounts.map((acc) => (
              <div key={acc.id} className={styles.accountCard}>
                <div className={styles.accountNumber}>XXXXXXXX {String(acc.id).substring(8)}</div>
                <div className={styles.accountName}>{data.name}</div>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Money Transfers</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionCard} onClick={()=>{navigate("/bank",{state:{data:data}})}}>
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.3085 0.293087C13.699 -0.0976958 14.3322 -0.0976956 14.7227 0.293087L17.7186 3.29095C18.1091 3.68175 18.1091 4.31536 17.7185 4.70613L14.716 7.71034C14.3255 8.10113 13.6923 8.10113 13.3018 7.71034C12.9113 7.31956 12.9113 6.68598 13.3018 6.2952L14.6087 4.98743L7 4.98743C6.44771 4.98743 6 4.53942 6 3.98677C6 3.43412 6.44771 2.98611 7 2.98611L14.5855 2.9861L13.3085 1.70824C12.918 1.31745 12.918 0.683869 13.3085 0.293087Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 20.998C14.2091 20.998 16 19.206 16 16.9954C16 14.7848 14.2091 12.9927 12 12.9927C9.79086 12.9927 8 14.7848 8 16.9954C8 19.206 9.79086 20.998 12 20.998ZM12 19.0934C10.842 19.0934 9.90331 18.1541 9.90331 16.9954C9.90331 15.8366 10.842 14.8973 12 14.8973C13.158 14.8973 14.0967 15.8366 14.0967 16.9954C14.0967 18.1541 13.158 19.0934 12 19.0934Z" fill="#0F0F0F"></path> <path d="M7 16.9954C7 17.548 6.55229 17.996 6 17.996C5.44772 17.996 5 17.548 5 16.9954C5 16.4427 5.44772 15.9947 6 15.9947C6.55229 15.9947 7 16.4427 7 16.9954Z" fill="#0F0F0F"></path> <path d="M19 16.9954C19 17.548 18.5523 17.996 18 17.996C17.4477 17.996 17 17.548 17 16.9954C17 16.4427 17.4477 15.9947 18 15.9947C18.5523 15.9947 19 16.4427 19 16.9954Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 9.99074C22.6569 9.99074 24 11.3348 24 12.9927V20.998C24 22.656 22.6569 24 21 24H3C1.34315 24 0 22.656 0 20.998V12.9927C0 11.3348 1.34315 9.99074 3 9.99074H21ZM4 11.9921H20C20 12.2549 20.0517 12.5151 20.1522 12.7579C20.2528 13.0007 20.4001 13.2214 20.5858 13.4072C20.7715 13.593 20.992 13.7405 21.2346 13.841C21.4773 13.9416 21.7374 13.9934 22 13.9934V19.9974C21.7374 19.9974 21.4773 20.0491 21.2346 20.1497C20.992 20.2503 20.7715 20.3977 20.5858 20.5835C20.4001 20.7694 20.2528 20.99 20.1522 21.2328C20.0517 21.4756 20 21.7359 20 21.9987H4C4 21.7359 3.94827 21.4756 3.84776 21.2328C3.74725 20.99 3.59993 20.7694 3.41421 20.5835C3.2285 20.3977 3.00802 20.2503 2.76537 20.1497C2.52272 20.0491 2.26264 19.9974 2 19.9974V13.9934C2.26264 13.9934 2.52272 13.9416 2.76537 13.841C3.00802 13.7405 3.2285 13.593 3.41421 13.4072C3.59993 13.2214 3.74725 13.0007 3.84776 12.7579C3.94827 12.5151 4 12.2549 4 11.9921Z" fill="#0F0F0F"></path> </g></svg>
              Bank Account</button>
            <button className={styles.actionCard} onClick={()=>{navigate("/payment",{state:{data:data}})}}>
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 15V17.8C17 18.9201 17 19.4802 16.782 19.908C16.5903 20.2843 16.2843 20.5903 15.908 20.782C15.4802 21 14.9201 21 13.8 21H8.2C7.0799 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V5.57143C5 5.04025 5 4.77465 5.05014 4.55496C5.2211 3.80597 5.80597 3.2211 6.55496 3.05014C6.77465 3 7.04025 3 7.57143 3H11M10 18H12M19 4.50003C18.5 4.37601 17.6851 4.37145 17 4.37601M17 4.37601C16.7709 4.37754 16.9094 4.3678 16.6 4.37601C15.7926 4.4012 15.0016 4.73678 15 5.68753C14.9982 6.70037 16 7.00003 17 7.00003C18 7.00003 19 7.23123 19 8.31253C19 9.12512 18.1925 9.48118 17.1861 9.59908C16.3861 9.59908 16 9.62503 15 9.50003M17 4.37601L17 3M17 9.5995V11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              Mobile Number </button>
            <button className={styles.actionCard} onClick={()=>{navigate("/balance",{state:{data:data}})}}>
              <svg width="64px" height="64px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <defs><style>{`
        .a {
          fill: none;
          stroke: #000000;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .b {
          fill: #000000;
        }
      `}
    </style>
  </defs>
  <path className="a" d="M8.0723,20.7261a12.4759,12.4759,0,0,1,3.6466-5.6695c-.9317-.7453,0-5.3767,0-5.3767s3.7264,1.65,4.3918,2.4221c0,0,2.8747-3.4868,11.2059-3.4868S43.5,15.0566,43.5,23.654s-6.2285,11.339-6.2285,11.339a19.9775,19.9775,0,0,1-1.4905,4.3918H32.48A21.3853,21.3853,0,0,1,31.07,36.8562s-2.6351.3194-4.525.3194a23.0513,23.0513,0,0,1-3.966-.4259,6.4031,6.4031,0,0,1-.9316,2.6351H18.0538c-1.1179-.9582-1.6769-3.9659-1.6769-3.9659S7.327,31.32,5.4105,28.871c-1.038-1.9431-.905-6.2551-.905-6.2551A7.9406,7.9406,0,0,1,8.0723,20.7261Z"/>
  <path className="a" d="M19.5444,13.7789a11.5482,11.5482,0,0,1,7.3464-2.156,13.1871,13.1871,0,0,1,7.9852,2.5287"/>
  <circle className="b" cx="11.6124" cy="21.285" r="0.75" />
</svg>
              Check Balance</button>
            <button className={styles.actionCard}>
              <svg fill="#000000" width="64px" height="64px" viewBox="0 0 512 512" id="_x30_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M366.364,366.309 c-60.922,60.921-159.695,60.921-220.617,0c-30.342-30.342-45.572-70.073-45.691-109.841c-0.04-13.453,10.696-24.72,24.149-24.841 c13.565-0.123,24.601,10.837,24.601,24.374h0.05c0,27.464,10.454,54.929,31.363,75.837c41.817,41.817,109.857,41.817,151.674,0 c41.986-41.985,41.986-109.69,0-151.675c-41.817-41.817-109.857-41.816-151.674,0l0,0c7.367,7.367,3.551,19.973-6.666,22.016 l-43.089,8.618c-9.128,1.826-17.176-6.222-15.35-15.35l8.618-43.089c2.043-10.217,14.649-14.033,22.016-6.666v0 c60.922-60.922,159.695-60.922,220.617,0C427.137,206.463,427.137,305.537,366.364,366.309z M305.26,263.299 c8.744,5.048,11.74,16.229,6.691,24.973v0c-5.048,8.744-16.229,11.74-24.973,6.691l-40.064-23.131l0.001-0.002 c-5.463-3.161-9.142-9.064-9.142-15.83v-64.543c0-10.096,8.185-18.281,18.281-18.281h0c10.096,0,18.281,8.185,18.281,18.281v53.989 L305.26,263.299z"></path></g></svg>
              Transaction History</button>
          </div>
        </section>
        <section className={styles.transactionsSection}>
          <h2 className={styles.sectionTitle}>Recent Transactions</h2>
          <div className={styles.transactionsList}>
            {transactions.map(transaction=>(
              <div className={styles.transactionRow} key={transaction.id}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionLeft}>
                  <div className={styles.transactionName}>Transfer</div>
                  <div className={styles.transactionDate}>{parseLocalDateTime(transaction.createdAt)}</div>
                  </div>
                  <div className={styles.transactionLeft}>
                  <div>{userAccounts.includes(transaction.senderid)?`Debited From XXXXXXXX${String(transaction.senderid).substring(8)}`:`Credited To XXXXXXXX${String(transaction.receiverid).substring(8)}`}</div>
                  <div> {userAccounts.includes(transaction.senderid)?`Sent To XXXXXXXX${String(transaction.receiverid).substring(8)}`:`Received From XXXXXXXX${String(transaction.senderid).substring(8)}`}</div>
                  </div>
                  <div className={styles.transactionLeft}>
                  <div className={styles.transactionAmount}> Amount: ₹ {transaction.amount}</div>
                  <div className={userAccounts.includes(transaction.senderid)?styles.debit:styles.credit}>{userAccounts.includes(transaction.senderid)?"Debited":"Credited"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
export default Dashboard;