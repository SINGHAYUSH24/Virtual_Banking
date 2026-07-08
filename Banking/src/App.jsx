import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login'
import {BrowserRouter,Routes,Route} from "react-router";
import Signup from './Components/Signup'
import Dashboard from './Components/Dashboard'
import BankAccount from './Components/BankAccount'
import Bill from './Components/Bill'
import NumberTransaction from './Components/NumberTransaction'
import BalanceCheck from './Components/BalanceCheck'
import History from './Components/History'
import QRGenerator from './Components/QRGenerator'
import AdminPanel from "./Components/AdminPanel"
import Merchant from './Components/Merchant'
import AddAccount from './Components/AddAccount'
import Statistics from './Components/Statistics'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/bank" element={<BankAccount/>}></Route>
      <Route path="/bill" element={<Bill/>}></Route>
      <Route path="/payment" element={<NumberTransaction/>}></Route>
      <Route path="/balance" element={<BalanceCheck/>}></Route>
      <Route path="/history" element={<History/>}></Route>
      <Route path="/qr" element={<QRGenerator/>}></Route>
      <Route path="/admin-portal" element={<AdminPanel/>}></Route>
      <Route path="/merchant" element={<Merchant/>}></Route>
      <Route path="/add/:number" element={<AddAccount/>}></Route>
      <Route path="/statistics" element={<Statistics/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
