import {useState,useEffect} from "react";
import styles from "../assets/Login.module.css"
import Bank_icon from "../assets/Bank_icon.png";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
function Login(){
    const [data,setData]=useState({number:"",password:""});
    const navigate=useNavigate();
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            navigate("/dashboard");
        }
    },[]);
    const handleChange=(e)=>{
        setData((prev)=>({...prev,[e.target.name]:e.target.value}));
    }
    const handleSubmit=async(e)=>{
        try{
            const res=await axios.post(`http://localhost:9090/user/login`,data);
            localStorage.setItem("token",res.data);
            toast.success("Login Successful");
            setTimeout(()=>{
                navigate("/dashboard");
            },3500);
        }catch(err){
            toast.error(err.response.data);
        }
    }
    return(
        <>
        <ToastContainer autoClose={3000}/>
        <div className={styles.main}>
            <div className={styles.icon}>
                <img src={Bank_icon} style={{height:"300px"}}></img>
                <h1>Welcome to Bank Of Ballia</h1>
            </div>
            <div className={styles.form}>
                <h1>Login</h1>
                <div style={{padding:"20px"}}>
                <div className={styles.label}>
                    <label htmlFor="email">Enter Your Mobile Number</label>
                </div>
                <input className={styles.input} type="text" name="number" id="number" value={data.number} onChange={handleChange}/>
                </div>
                <div>
                <div className={styles.label}>
                    <label htmlFor="password">Enter Your Password</label>
                </div>
                <input className={styles.input} type="password" name="password" id="password" value={data.password} onChange={handleChange}/>
                </div>
                <div style={{paddingTop:"30px"}}>
                    <button type="button" style={{padding:"10px",backgroundColor:"rgb(218, 83, 38)",color:"white",width:"80%"}} onClick={handleSubmit}>Login</button>
                </div>
                <p style={{color:"rgb(69, 204, 249)"}}><button style={{padding:"0px",backgroundColor:"inherit",border:"0px",cursor:"pointer",color:"inherit"}} onClick={()=>navigate("/signup")}>New User?Signup</button></p>
            </div>
        </div>
        </>
    )
}
export default Login;