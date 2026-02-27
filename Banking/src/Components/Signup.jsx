import { useState,useEffect } from 'react';
import styles from '../assets/Signup.module.css';
import { useNavigate } from 'react-router';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Signup (){
    const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            navigate("/dashboard");
        }
    },[]);
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (formData.number.trim().length!=10) {
      console.log(formData.number.trim().length);
      newErrors.number = '10-digit mobile Number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!validateForm()){
        return;
    }
    try{
        const res=await axios.post(`http://localhost:9090/user/signup`,formData);
        const data=res.data;
        toast.success(`User ${data.name} created`);
        setFormData({name:'',number:'',password:''});
    }catch(err){
        toast.error(err.response.data);
    }
  };
  return (
    <>
    <ToastContainer/>
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Become a Member of largest growing Virtual Bank</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Enter Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Only Letters are Allowed"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="number" className={styles.label}>Enter Mobile Number</label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className={`${styles.input} ${errors.number ? styles.inputError : ''}`}
              placeholder="Enter Valid Mobile Number"
            />
            {errors.number&& <span className={styles.error}>{errors.number}</span>}
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}> Create Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Password must contain a minimum of 5 characters"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Create Account
          </button>
        </form>
        
        <p className={styles.footer}>
          Already have an account? <button style={{padding:"0px",backgroundColor:"inherit",border:"0px",cursor:"pointer",color:"inherit"}} className={styles.link} onClick={()=>navigate("/")}>Sign in</button>
        </p>
      </div>
    </div>
    </>
  );
};
export default Signup;