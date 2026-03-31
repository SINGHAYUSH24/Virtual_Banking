import { useState } from "react";
import {useNavigate,useLocation} from "react-router";
import { Home, User,ArrowUpLeft, ArrowUpRight } from "lucide-react";
import styles from "../assets/AccountSettings.module.css";
const AccountSettings = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const data=location?.state.data;
  const account=location?.state.account;
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft} onClick={()=>navigate("/dashboard")}>
          <Home className={styles.navIcon} />
          Dashboard
        </div>
      </nav>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Account Settings</h1>
      </div>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardBody}>
            {/* Left: Form */}
            <div className={styles.formSide}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Account Number</label>
                <input
                  className={styles.input}
                  value={account.id}
                  disabled={true}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>PIN</label>
                <input
                  className={styles.input}
                  value="****"
                  disabled={true}
                />
                <div className={styles.btngroup}>
                <button className={styles.changelink} onClick>
                  Change UPI PIN
                </button>
                <button className={styles.resetLink} onClick>
                  Reset UPI PIN
                </button>
                </div>
              </div>
            </div>
            <hr className={styles.divider} />

            {/* Right: Avatar */}
            <div className={styles.avatarSide}>
              <div className={styles.avatarCircle}>
                  <User className={styles.avatarPlaceholderIcon} />
              </div>
                <input
                  className={styles.inputName}
                  value={data.name}
                  disabled={true}
                />
            </div>
          </div>
          <div className={styles.fieldGroup}>
              <h3>Merchant Payment </h3>
              <div className={styles.toggle}>
              <div className={styles.merchantLabel} onClick={()=>navigate("/merchant",{state:{id:account.id}})}>Accept Payment as a merchant via UPI</div>
              <ArrowUpRight/>
              </div>
          </div>
          <hr className={styles.divider} />
          {/* Delete Account */}
          <div className={styles.deleteSection}>
            <button className={styles.deleteLink}>
              Delete Your Account
            </button>
            <p className={styles.deleteHint}>
              You will receive an email to confirm your decision.<br />
              Please note, that all boards you have created will be permanently erased.
            </p>
            {showDeleteConfirm && (
              <div className={styles.deleteConfirmBox}>
                <p className={styles.deleteWarning}>
                  Are you sure? This action cannot be undone.
                </p>
                <div className={styles.deleteActions}>
                  <button className={styles.btnDanger} onClick={handleDeleteAccount}>
                    Yes, Delete
                  </button>
                  <button className={styles.btnSmOutline} onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
