import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { AccountContext } from "./GlobalAccountContext";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../assets/QRGenerator.module.css";

function QRGenerator() {
  const { accounts } = useContext(AccountContext);
  const [active, setAccount] = useState("");
  const [activeTab, setActiveTab] = useState("generate"); // "generate" or "scan"
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the scan tab is selected, initialize the HTML5 QR scanner
    if (activeTab !== "scan") return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    }, false);

    scanner.render(
      (decodedText) => {
        toast.success(`Scanned Account ID: ${decodedText}`);
        scanner.clear()
          .then(() => {
            navigate("/bank", {
              state: {
                data: location.state?.data,
                receiver_id: decodedText,
              },
            });
          })
          .catch((err) => {
            console.error("Error clearing scanner:", err);
            // Fallback navigation if clearing fails
            navigate("/bank", {
              state: {
                data: location.state?.data,
                receiver_id: decodedText,
              },
            });
          });
      },
      (error) => {
        // Ignored to avoid filling the log with scan check errors
      }
    );

    return () => {
      scanner.clear().catch((err) => {
        console.error("Scanner clear on unmount failed:", err);
      });
    };
  }, [activeTab, navigate, location.state]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <ToastContainer autoClose={2000} />
      <div className={styles.wrapper}>
        
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>QR Portal</h1>
          <button className={styles.backBtn} onClick={handleBack}>
            Dashboard
          </button>
        </div>

        {/* Tab Toggle */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === "generate" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("generate")}
          >
            Receive (Show QR)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "scan" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("scan")}
          >
            Pay (Scan QR)
          </button>
        </div>

        {/* Generate / Receive Tab */}
        {activeTab === "generate" && (
          <>
            <div className={styles.accountList}>
              {!accounts || accounts.length === 0 ? (
                <div className={styles.emptyState}>No accounts available.</div>
              ) : (
                accounts.map((id) => (
                  <div
                    key={id}
                    className={`${styles.accountItem} ${active === id ? styles.active : ""}`}
                    onClick={() => setAccount(id)}
                  >
                    <p className={styles.accountId}>ID: {id}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className={styles.qrDisplay}>
              {active ? (
                <div key={active} className={styles.qrCodeWrapper}>
                  <QRCodeCanvas value={String(active)} size={220} />
                  <p style={{ marginTop: "12px", fontSize: "13px", color: "#4A5568", fontFamily: "monospace" }}>
                    Scan to pay Account #{active}
                  </p>
                </div>
              ) : (
                <div className={styles.qrPlaceholder}>
                  <p>Select an account from the list above to display its QR code.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Scan / Pay Tab */}
        {activeTab === "scan" && (
          <div className={styles.scanContainer}>
            <div id="qr-reader" className={styles.scanBox}></div>
            <p className={styles.scanInstructions}>
              Position the QR code within the frame to scan, or select an image file to upload.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default QRGenerator;