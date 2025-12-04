// import { useState } from "react";
// import { FiSettings, FiWifi, FiCpu, FiSmartphone, FiCamera } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import Dashboard from "../Dashboard/DashBoard";
// import aquafarming from "../assets/Aqua_farming.jpg"

// export default function Controller() {
//   const [clientUser, setClientUser] = useState("");
//   const [clientPass, setClientPass] = useState("");
//   const [topId, setTopId] = useState("");
//   const navigate=useNavigate();


//   const handleLogout = () => {
//   // remove all stored login data
//   localStorage.removeItem("token");
//   localStorage.removeItem("username");

//   // redirect to login
//   window.location.href = "/";
// };


//   return (
//     <div className=" relative min-h-screen font-poppins">
//       {/* Background image with overlay */}
//       <div
//         className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed -z-10"
//         style={{
//           backgroundImage: `url(${aquafarming})`,
//           opacity: 0.90,
//           filter: "brightness(0.8)",
//           backgroundAttachment: "fixed"
//         }}
//       />
//       {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" /> */}

//       {/* Navbar */}
//       <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
//         <h1 className="text-2xl font-semibold text-[#5874dc]">Controller Panel</h1>
//         <div className="flex gap-6 text-lg font-medium">
//           <a href="#" className="hover:text-[#5874dc] transition">Home</a>
//           <a href="#" className="hover:text-[#5874dc] transition">Settings</a>
//           {/* <a href="#" className="hover:text-[#5874dc] transition">Logout</a> */}
//           <button 
//       onClick={handleLogout}
//       className="hover:text-red-300 transition"
//     >
//       Logout
//     </button>
//         </div>
//       </nav>

//       {/* Main Layout */}
//       <div className="grid grid-cols-2 gap-6 p-10">

//         {/* LEFT SIDE FORM */}
//         <div className="bg-white p-8 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-semibold mb-6 text-[#5874dc]">Client Login Form</h2>

//           <div className="flex flex-col gap-5">

//             <div>
//               <label className="text-sm font-medium">Client Username</label>
//               <input
//                 value={clientUser}
//                 onChange={(e) => setClientUser(e.target.value)}
//                 type="text"
//                 className="w-full mt-1 p-3 rounded-xl border focus:border-[#5874dc] focus:outline-none"
//                 placeholder="Enter username"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Client Password</label>
//               <input
//                 value={clientPass}
//                 onChange={(e) => setClientPass(e.target.value)}
//                 type="password"
//                 className="w-full mt-1 p-3 rounded-xl border focus:border-[#5874dc] focus:outline-none"
//                 placeholder="Enter password"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Top ID</label>
//               <input
//                 value={topId}
//                 onChange={(e) => setTopId(e.target.value)}
//                 type="text"
//                 className="w-full mt-1 p-3 rounded-xl border focus:border-[#5874dc] focus:outline-none"
//                 placeholder="Enter top ID"
//               />
//             </div>

//             <button className="mt-4 bg-[#5874dc] text-white py-3 rounded-xl hover:bg-[#405ed4] transition font-medium">
//               Save Controller
//             </button>
//           </div>
//         </div>

//         {/* RIGHT SIDE - MOBILE STYLE SETTINGS CARD */}
//         <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">

//           {/* Title */}
//           <h2 className="text-xl font-semibold text-[#5874dc] mb-8">Quick Controls</h2>

//           {/* Round Icon Buttons Row */}
//           <div className="flex items-center justify-center gap-10 mb-10">

//             {/* Settings */}
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9d6ff] to-[#5874dc] flex items-center justify-center shadow-lg">
//                 <FiSettings className="text-white text-3xl" />
//               </div>
//               <p className="text-sm font-medium text-gray-700">Settings</p>
//             </div>

//             {/* WiFi */}
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9d6ff] to-[#5874dc] flex items-center justify-center shadow-lg">
//                 <FiWifi className="text-white text-3xl" />
//               </div>
//               <p className="text-sm font-medium text-gray-700">WiFi</p>
//             </div>

//             {/* Processor */}
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9d6ff] to-[#5874dc] flex items-center justify-center shadow-lg">
//                 <FiCpu className="text-white text-3xl" />
//               </div>
//               <p className="text-sm font-medium text-gray-700">CPU</p>
//             </div>
//           </div>

//           {/* IOT DEVICES LIST */}
//           <div className="w-full bg-[#f7f8ff] p-6 rounded-2xl shadow-inner">

//             <h3 className="text-lg font-semibold text-[#5874dc] mb-6 text-center">
//               IoT Devices Connected
//             </h3>

//             <div className="flex flex-col gap-4">

//               {/* Device 1 */}
//               <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow">
//                 <div className="flex items-center gap-3">
//                   <FiSmartphone className="text-[#5874dc] text-xl" />
//                   <p className="font-medium">Smart Switch</p>
//                 </div>
//                 <span className="text-green-600 font-semibold">Active</span>
//               </div>

//               {/* Device 2 */}
//               <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow">
//                 <div className="flex items-center gap-3">
//                   <FiCamera className="text-[#5874dc] text-xl" />
//                   <p className="font-medium">Security Camera</p>
//                 </div>
//                 <span className="text-green-600 font-semibold">Active</span>
//               </div>

//               {/* Device 3 */}
//               <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow">
//                 <div className="flex items-center gap-3">
//                   <FiWifi className="text-[#5874dc] text-xl" />
//                   <p className="font-medium">WiFi Sensor</p>
//                 </div>
//                 <span className="text-red-500 font-semibold">Offline</span>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//       <div className="mt-10">
//       <Dashboard />
//     </div>

//     </div>
    
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { FiCpu, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import aquafarming from "../assets/Aqua_farming.jpg";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/photonic.png"
import profilephoto from "../assets/profile/profile.png"

export default function Controller() {
  const { username, password } = useAuth();

  const [controllers, setControllers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

//   const handleControllerClick = async (id) => {
//   // const res = await axios.post(`http://localhost:8000/controller/${id}/command`, {
//   //   payload: "c0=203"
//   // });
//   // console.log(res.data);
//   navigate("/Dashboard")
// };
const handleControllerClick = (ctrl) => {
  navigate("/Dashboard", {
    state: {
      id: ctrl.id,
      name: ctrl.name,
      status: ctrl.status,
    },
  });
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.href = "/";
  };

  // 🔄 Fetch controller list (login + get controllers)
  const handleClientLogin = async () => {
    if (!username || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/login", {
        username: username,
        password: password,
      });

      setControllers(res.data.controllers);

    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
      setControllers([]);
    }

    setLoading(false);
  };

  // Fetch automatically on login ready
  useEffect(() => {
    if (!username || !password) return;

    const timeout = setTimeout(() => {
      handleClientLogin();
    }, 500);

    return () => clearTimeout(timeout);
  }, [username, password]);


  return (
    <div className="relative min-h-screen font-poppins">

      {/* Background */}
      {/* <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed -z-10"
        style={{
          backgroundImage: `url(${aquafarming})`,
          opacity: 0.9,
          filter: "brightness(0.8)",
        }}
      /> */}

{/* NAVBAR */}
<nav className="w-full py-5 bg-[#01a0e2] shadow-md">
  <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 gap-2 sm:gap-0">
    
    {/* Logo + Welcome */}
    <div className="flex gap-2 items-center">
      <img src={logo} alt="Photonic Logo" style={{ width: "100px", height: "auto" }} />
      <h1 className="font-bold text-4xl text-white">
        Welcome&nbsp;<span className="text-black">{username}</span>
      </h1>
    </div>
    
    {/* Right section */}
    <div className="flex items-center gap-3">
      <div className="text-white text-sm sm:text-base">Settings / Profile </div>
      <img 
        src={profilephoto} // replace with your profile image import
        alt="Profile" 
        className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
      />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </div>
</nav>


      {/* Main Layout */}
      <div className="p-5 w-full">

        {/* CONTROLLER LIST BOX (FULL WIDTH) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full">

          {/* Title + Refresh Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#5874dc]">
              Controller List
            </h2>

            {/* 🔄 Refresh Button */}
            <button
              onClick={handleClientLogin}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <FiRefreshCw size={18} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Controller Content */}
          {controllers.length === 0 ? (
            <p className="text-gray-500">Login to view controllers...</p>
          ) : (
            <div className="flex flex-wrap gap-4 w-full">
              {controllers.map((ctrl, index) => (
                <div
                  key={index}
                   onClick={() => handleControllerClick(ctrl)}
                  className="p-4 bg-gray-200 rounded-xl shadow flex items-center gap-3 w-[20%] cursor-pointer"
                >
                  <FiCpu size={24} className="text-[#5874dc]" />
                  <div>
                    <p className="font-semibold">{ctrl.name}</p>
                    <p className="text-sm text-gray-600">ID: {ctrl.id}</p>
                    <p className="text-sm text-gray-600">Status: {ctrl.status}</p>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
