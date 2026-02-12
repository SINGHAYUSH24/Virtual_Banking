import { useState } from 'react';
import styles from '../assets/Signup.module.css';
import { useNavigate } from 'react-router';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Signup = () => {
    const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role:'user'
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]+$/)) {
      newErrors.email = 'Please enter a valid email';
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
        setFormData({name:'',email:'',password:'',role:'user'});
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
            <label htmlFor="email" className={styles.label}>Enter Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Enter Valid Email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
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