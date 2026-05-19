import { useEffect,useState } from "react";
import {useNavigate,useParams} from "react-router";
import styles from "../assets/AddAccount.module.css";
import axios from "axios";
const AddAccount = () => {
const {number}=useParams();
  const [form, setForm] = useState({ number: "", balance: "", pin: "", bankcode:"" });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate=useNavigate();
  useEffect(()=>{
          const token=localStorage.getItem("token");
          if(!token){
              navigate("/");
            }
        setForm(prev=>({...prev,number:number}));
        },
    []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
        const token=localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_APP_API_URL;
        const res=await axios.post(`${API_URL}/account/new`,form,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        const data=res.data;
        setMessage(data);
        setIsError(false);
        setForm({ number: "", balance: "", pin: "", bankcode: "" });
    } catch (err) {
      setMessage(err.message || "Something went wrong");
      setIsError(true);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Account</h2>
      <form onSubmit={handleSubmit}>
        {[
          { name: "balance", label: "Balance", type: "number" },
          { name: "pin", label: "PIN", type: "password" },
          { name: "bankcode", label: "Bank Code", type: "number" },
        ].map(({ name, label, type }) => (
          <div className={styles.field} key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className={styles.submitBtn}>Create Account</button>
      </form>
      {message && (
        <p className={`${styles.message} ${isError ? styles.error : styles.success}`}>{message}</p>
      )}
    </div>
  );
};

export default AddAccount;
