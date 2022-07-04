import Register from "./Screens/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";
import Success from "./Screens/Success";
import { useEffect } from "react";
import { getBrowserInfo } from "./Utils/GetDeviceInfo";

export default function App() {

  useEffect(() => { 
    const deviceData = () => {
      await getBrowserInfo();
    };
    deviceData();
  },[]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
