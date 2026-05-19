import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import styles from "../assets/Statistics.module.css";

const COLORS = ["#1565c0", "#0d47a1", "#42a5f5", "#90caf9", "#bbdefb", "#e3f2fd", "#1e88e5", "#64b5f6"];

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const token=localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_APP_API_URL;;
    fetch(`${API_URL}/user/dashboard`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
        setTimeout(() => setAnimateCards(true), 100);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner} />
        <p className={styles.loaderText}>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <span className={styles.errorIcon}>⚠</span>
        <p>{error}</p>
        <button className={styles.retryBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const { totalExpense, totalIncome, netIncome, topCategories, topMerchants } = data;

  const categoryData = Object.entries(topCategories || {}).map(([name, value]) => ({ name, value }));
  const merchantData = Object.entries(topMerchants || {}).map(([name, value]) => ({ name, value }));

  const summaryCards = [
    { label: "Total Income", value: totalIncome, icon: "📈", accent: "#43a047" },
    { label: "Total Expense", value: totalExpense, icon: "📉", accent: "#e53935" },
    { label: "Net Income", value: netIncome, icon: netIncome >= 0 ? "💰" : "🔻", accent: netIncome >= 0 ? "#1565c0" : "#e53935" },
  ];

  const activeData = activeTab === "categories" ? categoryData : merchantData;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Financial Dashboard</h1>
        <p className={styles.subtitle}>Your spending overview at a glance</p>
      </header>

      {/* Summary Cards */}
      <section className={styles.cardsRow}>
        {summaryCards.map((card, i) => (
          <div
            key={card.label}
            className={`${styles.card} ${animateCards ? styles.cardVisible : ""}`}
            style={{ borderTopColor: card.accent, transitionDelay: `${i * 120}ms` }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <span className={styles.cardIcon}>{card.icon}</span>
            <p className={styles.cardLabel}>{card.label}</p>
            <p className={styles.cardValue} style={{ color: card.accent }}>
              {hoveredCard === i ? formatCurrency(card.value) : formatCurrency(card.value)}
            </p>
            <div className={styles.cardBar} style={{ backgroundColor: card.accent, width: hoveredCard === i ? "100%" : "40%" }} />
          </div>
        ))}
      </section>

      {/* Tab Toggle */}
      <section className={styles.tabSection}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === "categories" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Top Categories
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "merchants" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("merchants")}
          >
            Top Merchants
          </button>
        </div>
      </section>

      {/* Charts */}
      <section className={styles.chartsRow}>
        {/* Pie Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            {activeTab === "categories" ? "Category Breakdown" : "Merchant Breakdown"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                animationDuration={800}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {activeData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            {activeTab === "categories" ? "Category Amounts" : "Merchant Amounts"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cfd8dc" />
              <XAxis type="number" tickFormatter={(v) => `₹${v}`} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={900}>
                {activeData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Data Table */}
      <section className={styles.tableSection}>
        <h2 className={styles.chartTitle}>
          {activeTab === "categories" ? "Category Details" : "Merchant Details"}
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {activeData.map((item, i) => {
                const total = activeData.reduce((s, d) => s + d.value, 0);
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={item.name} className={styles.tableRow}>
                    <td>
                      <span className={styles.rank} style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                        {i + 1}
                      </span>
                    </td>
                    <td>{item.name}</td>
                    <td>{formatCurrency(item.value)}</td>
                    <td>
                      <div className={styles.shareBar}>
                        <div className={styles.shareFill} style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                      <span className={styles.sharePct}>{pct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
