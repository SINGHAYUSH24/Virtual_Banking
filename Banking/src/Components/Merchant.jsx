import { useState, useEffect } from "react";
import {useNavigate,useLocation} from 'react-router';
import axios from "axios";
import styles from "../assets/Merchant.module.css";

const BASE_URL = "http://localhost:9090";
export default function Merchant() {
  const [merchantName, setMerchantName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [agreedTerms, setAgreedTerms] = useState(false);
  const navigate=useNavigate();
  const location=useLocation();
  const userId=location.state?.id;
  const token=localStorage.getItem("token");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if(!token){
          navigate("/");
        }
        setLoadingCategories(true);
        setCategoryError("");
        const res = await axios.get(`${BASE_URL}/account/merchants/categories`,{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
        setCategories(res.data);
      } catch (err) {
        setCategoryError("Failed to load categories. Please refresh and try again.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!merchantName.trim()) newErrors.merchantName = "Business name is required.";
    else if (merchantName.trim().length < 3) newErrors.merchantName = "Name must be at least 3 characters.";
    if (!category) newErrors.category = "Please select a category.";
    if (!agreedTerms) newErrors.terms = "You must agree to the terms and conditions.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res=await axios.post(`${BASE_URL}/account/request`, {
        name: merchantName.trim(),
        type:category,
        id:userId
      },{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
      const message=res.data;
      setStatus({
        type: "success",
        message: message,
      });
      setMerchantName("");
      setCategory("");
      setAgreedTerms(false);
      setTimeout(()=>{
        navigate("/dashboard");
      },5000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setStatus({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameChange = (e) => {
    setMerchantName(e.target.value);
    if (errors.merchantName) setErrors((prev) => ({ ...prev, merchantName: "" }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleTermsChange = () => {
    setAgreedTerms(!agreedTerms);
    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
  };


  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Register as Merchant</h1>
          <p className={styles.subtitle}>
            Set up your merchant account to start accepting payments
          </p>
        </div>

        {/* Status Banner */}
        {status && (
          <div className={`${styles.statusBanner} ${styles[status.type]}`}>
            <span className={styles.statusIcon}>
              {status.type === "success" ? "✅" : "❌"}
            </span>
            <span>{status.message}</span>
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Merchant Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="merchantName">
              Business Name
            </label>
            <div className={`${styles.inputWrapper} ${errors.merchantName ? styles.inputError : ""}`}>
              <span className={styles.inputIcon}>🏷️</span>
              <input
                id="merchantName"
                type="text"
                className={styles.input}
                placeholder=""
                value={merchantName}
                onChange={handleNameChange}
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            {errors.merchantName && (
              <p className={styles.errorText}>{errors.merchantName}</p>
            )}
          </div>

          {/* Category */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="category">
              Business Category
            </label>
            <div className={`${styles.inputWrapper} ${errors.category ? styles.inputError : ""}`}>
              <span className={styles.inputIcon}>
                 📂
              </span>
              {loadingCategories ? (
                <div className={styles.categoryLoading}>
                  <span className={styles.spinner} />
                  Loading categories…
                </div>
              ) : categoryError ? (
                <p className={styles.errorText}>{categoryError}</p>
              ) : (
                <select
                  id="category"
                  className={styles.select}
                  value={category}
                  onChange={handleCategoryChange}
                  disabled={submitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                       {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {errors.category && (
              <p className={styles.errorText}>{errors.category}</p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className={styles.fieldGroup}>
            <div className={styles.termsRow} onClick={handleTermsChange}>
              <input
                type="checkbox"
                className={styles.termsCheckbox}
                checked={agreedTerms}
                onChange={handleTermsChange}
                onClick={(e) => e.stopPropagation()}
                disabled={submitting}
              />
              <span className={styles.termsLabel}>
                I agree to all the{" "}
                <span className={styles.termsLink}>Terms and Conditions</span>,{" "}
                <span className={styles.termsLink}>Privacy Policy</span>, and{" "}
                <span className={styles.termsLink}>Merchant Agreement</span>.
              </span>
            </div>
            {errors.terms && (
              <p className={styles.errorText}>{errors.terms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || loadingCategories || !!categoryError}
          >
            {submitting ? (
              <>
                <span className={styles.spinner} />
                Registering…
              </>
            ) : (
              "Register Merchant Account"
            )}
          </button>
        </form>

        <p className={styles.footerNote}>
          Your merchant account will be reviewed and verified by an admin before going live.
        </p>
      </div>
    </div>
  );
}
