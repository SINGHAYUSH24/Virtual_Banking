import {useState,useEffect} from "react";
import styles from "../assets/Login.module.css"
import Bank_icon from "../assets/Bank_icon.png";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
function Login(){
    const [data,setData]=useState({email:"",password:"",role:""});
    const [error,setError]=useState({email:"",password:""});
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setData((prev)=>({...prev,[e.target.name]:e.target.value}));
    }
    const handleSubmit=async(e)=>{
        const {email,password}=data;
        if(!email.match(/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]+$/)){
            setError((prev)=>({...prev,email:"Invalid Email Format!"}));
            return;
        }
        else if(password.length<5||!password.match(/^[0-9]*$/)){
            setError((prev)=>({...prev,password:"Password must contain atleast 5 digits"}));
            return;
        }else{
            setError({email:"",password:""});
        }
        try{
            const res=await axios.post(`http://localhost:9090/user/login`,data);
            toast.success(res.data);
        }catch(err){
            console.log(err);
            toast.error(err.response.data);
        }
    }
    return(
        <>
        <ToastContainer/>
        <div className={styles.main}>
            <div className={styles.icon}>
                <img src={Bank_icon} style={{height:"300px"}}></img>
                <h1>Welcome to Bank Of Ballia</h1>
            </div>
            <div className={styles.form}>
                <h1>Login</h1>
                <div style={{padding:"20px"}}>
                <div className={styles.label}>
                    <label htmlFor="email">Enter Your Email</label>
                </div>
                <input className={styles.input} type="email" name="email" id="email" value={data.email} onChange={handleChange}/>
                <div style={{color:"red"}}>{error.email}</div>
                </div>
                <div>
                <div className={styles.label}>
                    <label htmlFor="password">Enter Your Password</label>
                </div>
                <input className={styles.input} type="password" name="password" id="password" value={data.password} onChange={handleChange}/>
                <div style={{color:"red"}}>{error.password}</div>
                </div>
                <div style={{padding:"20px"}}>
                <div className={styles.label}>
                    <label>Role</label>
                </div>
                <select name="role" value={data.role} style={{padding:"10px",backgroundColor:"rgb(18, 6, 89)",color:"rgb(69, 204, 249)"}} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                </div>
                <div style={{}}>
                    <button type="button" style={{padding:"10px",backgroundColor:"rgb(218, 83, 38)",color:"white",width:"80%"}} onClick={handleSubmit}>Login</button>
                </div>
                <p style={{color:"rgb(69, 204, 249)"}}><button style={{padding:"0px",backgroundColor:"inherit",border:"0px",cursor:"pointer",color:"inherit"}} onClick={()=>navigate("/signup")}>New User?Signup</button></p>
            </div>
        </div>
        </>
    )
}
export default Login;