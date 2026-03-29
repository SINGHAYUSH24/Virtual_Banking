import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { AccountContext } from "./GlobalAccountContext";
import { QRCodeCanvas } from "qrcode.react";
import styles from "../assets/QRGenerator.module.css";
function QRGenerator() {
  const { accounts } = useContext(AccountContext);
  const [active, setAccount] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.accountList}>
          {!accounts || accounts.length === 0 ? (
            <div className={styles.emptyState}>No accounts available.</div>
          ) : (
            accounts.map((id) => (
              <div
                key={id}
                className={`${styles.accountItem} ${active === id ? styles.active : ""}`}
                onClick={() => (setAccount(id))}
              >
                <p className={styles.accountId}>{id}</p>
              </div>
            ))
          )}
        </div>
        <div className={styles.qrDisplay}>
          {active ? (
            <div key={active} className={styles.qrCodeWrapper}>
              <QRCodeCanvas value={String(active)} size={250}/>
            </div>
          ) : (
            <div className={styles.qrPlaceholder}>
              <p>Select an account to generate a QR code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default QRGenerator;