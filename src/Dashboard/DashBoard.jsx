// import React, { useEffect, useMemo, useState } from "react";
// import aquafarming from "../assets/Aqua_farming.jpg";
// import axios from "axios";
// import TestController from "./Testing/TestController";
// import { useLocation } from "react-router-dom";
// import { FiEdit, FiRefreshCcw } from "react-icons/fi";
// import api from "../api/axios.js"
// import MultiSettingManager from "./MultiSetting/MultiSettingManager.jsx";

// /**
//  * Dashboard.jsx
//  * - Layout B (gauge in center of row 2)
//  * - Semi-circle gauge (animated)
//  * - Live clock widget
//  * - Full width glass panel centered over a full-screen background image
//  *
//  * Background image path used from uploaded assets:
//  * /mnt/data/3f60aabc-5864-49be-9ce0-065d24711344.png
//  *
//  * Replace bgImage variable if you want another image.
//  */

// export default function Dashboard() {
//   // data state
  
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [runForValue, setRunForValue] = useState(""); // number
//   const [runForUnit, setRunForUnit] = useState("sec"); // sec|min|hr
//   const [feedLevel, setFeedLevel] = useState(""); // KG
//   const [timeGap, setTimeGap] = useState(180); // seconds default
//   // const [tags, setTags] = useState([]);
//   // const [tagInput, setTagInput] = useState("");
//   const [dispatch, setDispatch] = useState(250);
//   const [feedDuration, setFeedDuration] = useState("");

//   const [settingsList, setSettingsList] = useState([]);   // Dynamic settings
//   const addSetting = () => {
//     const newId = settingsList.length + 1;

//     const newItem = {
//       id: newId,
//       label: `Setting ${newId}`,
//       startTime: "",
//       endTime: "",
//       feedLevel: "",
//       feedDuration: "",
//     };

//     // Add new item
//     setSettingsList((prev) => [...prev, newItem]);

//     // Select the newly created setting
//     setSelectedSetting(newId);

//     // Clear Dashboard fields
//     setStartTime("");
//     setEndTime("");
//     setFeedLevel("");
//     setFeedDuration("");
//   };

//   const [selectedSetting, setSelectedSetting] = useState(null);
//   useEffect(() => {
//     if (!selectedSetting) return;

//     const selected = settingsList.find(s => s.id === selectedSetting);
//     if (!selected) return;

//     setStartTime(selected.startTime ?? "");
//     setEndTime(selected.endTime ?? "");
//     setFeedLevel(selected.feedLevel ?? "");
//     setFeedDuration(selected.feedDuration ?? "");
//   }, [selectedSetting, settingsList]);


// const updateCurrentSetting = (field, value) => {
//   setSettingsList(prev =>
//     prev.map(s =>
//       s.id === selectedSetting
//         ? { ...s, [field]: value }
//         : s
//     )
//   );
// };



//   const location = useLocation();
//   const { id, name, status } = location.state || {}; 

//   // live clock
//   const [now, setNow] = useState(new Date());

//   // background image (uploaded file path)
// //   const bgImage = "/mnt/data/3f60aabc-5864-49be-9ce0-065d24711344.png";




// const [showMultiSetting, setShowMultiSetting] = useState(false);
// const [currentAck, setCurrentAck] = useState(""); // previous ACK from backend





//   const fetchSettings = async () => {
//     try {
//       const res = await axios.get(`/api/controller/${id}/settings`);
//       /**
//        * Assume API returns something like:
//        * ACK,3,08:00|10:00|15:00
//        *
//        * Or JSON:
//        * { count:3, items:["08:00","10:00","15:00"] }
//        */

//       const data = res.data;

//       // If ACK string
//       if (typeof data === "string" && data.startsWith("ACK")) {
//         const parts = data.split(",");
//         const count = Number(parts[1]);
//         const times = parts[2]?.split("|") || [];

//         const formatted = times.map((t, i) => ({
//           id: i + 1,
//           label: `Setting ${i + 1}`,
//           value: t.trim(),
//         }));

//         setSettingsList(formatted);
//       }

//       // If JSON
//       if (data.items) {
//         const formatted = data.items.map((t, i) => ({
//           id: i + 1,
//           label: `Setting ${i + 1}`,
//           value: t,
//         }));
//         setSettingsList(formatted);
//       }

//     } catch (err) {
//       console.error("Failed to load settings", err);
//     }
//   };


//   // ------------ WHEN SETTING SELECTED → LOAD VALUE -----------
//   useEffect(() => {
//     if (!selectedSetting) return;

//     const s = settingsList.find((x) => x.id === Number(selectedSetting));
//     if (!s) return;

//     setStartTime(s.value);

//   }, [selectedSetting]);


//   // update clock every second
//   useEffect(() => {
//     const t = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // computed seconds (runFor normalized to seconds)
// // ---- CALCULATIONS ----
// const totalCycles = useMemo(() => {
//   if (!feedLevel || !dispatch) return 0;
//   return Math.floor((Number(feedLevel) * 1000) / Number(dispatch));
// }, [feedLevel, dispatch]);

// const totalRunningHours = useMemo(() => {
//   if (!totalCycles || !timeGap) return "0h 0m";

//   // total seconds for all cycles
//   const totalSeconds = totalCycles * Number(timeGap);

//   // convert to hours + minutes
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);

//   return `${hours}h ${minutes}m`;
// }, [totalCycles, timeGap]);


//   // gauge parameters
//   const gaugeMaxKg = 2000; // change this to desired max feeding kg
//   const feedValueNumber = Number(feedLevel) || 0;
//   const feedPercent = Math.max(0, Math.min(100, (feedValueNumber / gaugeMaxKg) * 100));

//   // Add tag handler
//   // const addTag = () => {
//   //   const t = tagInput.trim();
//   //   if (!t) return;
//   //   if (!tags.includes(t)) setTags((s) => [...s, t]);
//   //   setTagInput("");
//   // };
//   // const removeTag = (t) => setTags((s) => s.filter((x) => x !== t));
//   // const onTagKey = (e) => {
//   //   if (e.key === "Enter") {
//   //     e.preventDefault();
//   //     addTag();
//   //   }
//   // };

//   // Set button handler (replace alert with API call)
// const handleSet = async () => {
//   try {
//     // Convert HH:mm → HHMM
//     const toHHMM = (t) => t.replace(":", "").padStart(4, "0");

//     // Start time (HHMM)
//     const startHHMM = toHHMM(startTime);

//     // Convert "runForValue" (hours float) → HHMM (duration)
//     const hoursFloat = Number(runForValue) || 0;
//     const durHours = Math.floor(hoursFloat);
//     const durMins = Math.round((hoursFloat - durHours) * 60);

//     // const durationHHMM =
//     //   String(durHours).padStart(2, "0") +
//     //   String(durMins).padStart(2, "0");  // e.g. 02:00 → 0200

//     // as1 = startHHMM + durationHHMM
//     // const as1 = `${startHHMM}${durationHHMM}`;
//     const as1 = `${startHHMM}`;
//     let as3 = totalRunningHours;

//     // Extract numbers (hours & minutes)
//     const [hours, minutes] = as3.match(/\d+/g).map(Number);

//     // Convert to 2-digit padded format
//     as3 = `${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;

//     console.log("Formatted totalRunningHours:", as3); // e.g., "0100"

//     // as2 = quantity (feed level)
//     const as2 = String(feedLevel).padStart(4, "0");

//     // as4 = time gap
//     const as4 = String(timeGap).padStart(4, "0");

//     const as9 = dispatch;
//     const as10 = totalCycles;


//     // Build payload
//     const payload =
//       `c0=212` +
//       `&as1=${as1}` +
//       `&as2=${as2}` +
//       `&as3=${as3}` +
//       `&as4=${as4}`+
//       `&as9=${as9}`+
//       `&as10=${as10}`

//     console.log("Sending payload:", payload);

//     const res = await api.post(
//       `/controller/${id}/command`,
//       { payload }
//     );


//     console.log("SET RESPONSE:", res.data);
//     alert("Settings applied!");

//   } catch (e) {
//     console.log("Error sending settings:", e);
//     alert("Failed to send settings.");
//   }
// };

// const handlePreviousSet = async () => {
//   try {
//     // 1) Send READ command
//     await api.post(`/controller/${id}/command`, { payload: "c0=202" });

//     // 2) Wait for controller to respond
//     await new Promise(r => setTimeout(r, 1500));

//     // 3) Fetch latest ACK
//     const res = await api.get(`/controller/${id}/status`);
//     const ack = res.data.ack_payload || res.data.payload || "";
//     console.log("Previous ACK fetched:", ack);

//     setCurrentAck(ack); // for MultiSettingManager
//     setShowMultiSetting(true);

//     // 4) Parse ACK for values
//     const parts = ack.split("&");
//     const as1 = parts.find(p => p.startsWith("as1="))?.split("=")[1];
//     const as2 = parts.find(p => p.startsWith("as2="))?.split("=")[1];
//     const as3 = parts.find(p => p.startsWith("as3="))?.split("=")[1];
//     const as4 = parts.find(p => p.startsWith("as4="))?.split("=")[1];
//     const as9 = parts.find(p => p.startsWith("as9="))?.split("=")[1];

//     if (!as1) return;

//     // --- Update Dashboard Inputs ---
//     const startHHMM = as1.slice(0, 4);
//     setStartTime(`${startHHMM.slice(0,2)}:${startHHMM.slice(2,4)}`);

//     // Optional: parse duration from as1 slice(4,8)
//     // const durHHMM = as1.slice(4, 8);

//     setFeedLevel(as2 || "0");
//     setTimeGap(Number(as4) || 180);
//     setDispatch(Number(as9) || 250);

//     // 5) Update settings list dropdown (optional: extract multiple settings from payload if available)
//     // Example: API might return multiple settings as ACK1,ACK2,... in res.data.items
//     if(res.data.items) {
//       const formatted = res.data.items.map((t, i) => ({
//         id: i + 1,
//         label: `Setting ${i + 1}`,
//         value: t,
//       }));
//       setSettingsList(formatted);
//       setSelectedSetting(formatted[0]?.id || null); // auto select first
//     }

//   } catch (err) {
//     console.error("Failed to fetch previous settings:", err);
//     alert("Could not fetch previous settings from controller.");
//   }
// };




// // const handlePreviousSet = async () => {
// //   try {
// //     // Use READ command (important!)
// //     const readPayload = "c0=202";

// //     const res = await api.post(
// //       `/controller/${id}/command`,
// //       { payload: readPayload }
// //     );

// //     console.log("Previous setting response:", res.data);

// //     const ack = res.data.ack_payload || "";
// //     const parts = ack.split("&");

// //     // Extract values
// //     const as1 = parts.find((p) => p.startsWith("as1="))?.split("=")[1];
// //     const as2 = parts.find((p) => p.startsWith("as2="))?.split("=")[1];
// //     const as3 = parts.find((p) => p.startsWith("as3="))?.split("=")[1];
// //     const as4 = parts.find((p) => p.startsWith("as4="))?.split("=")[1];

// //     if (!as1) {
// //       console.log("No previous setting found");
// //       return;
// //     }

// //     // -----------------------------
// //     // PARSE AS1 → start + duration
// //     // -----------------------------
// //     const startHHMM = as1.slice(0, 4);    // "1100"
// //     const durHHMM   = as1.slice(4, 8);    // "0500"

// //     const toTime = (hhmm) =>
// //       hhmm.slice(0, 2) + ":" + hhmm.slice(2, 4);

// //     const startFormatted = toTime(startHHMM);

// //     // Convert duration → end time
// //     const sh = Number(startHHMM.slice(0, 2));
// //     const sm = Number(startHHMM.slice(2, 4));
// //     const dh = Number(durHHMM.slice(0, 2));
// //     const dm = Number(durHHMM.slice(2, 4));

// //     let endH = sh + dh;
// //     let endM = sm + dm;

// //     if (endM >= 60) {
// //       endM -= 60;
// //       endH += 1;
// //     }
// //     if (endH >= 24) endH -= 24;

// //     const endFormatted =
// //       String(endH).padStart(2, "0") + ":" + String(endM).padStart(2, "0");

// //     // Duration in hours (float)
// //     const runHours = (dh + dm / 60).toFixed(2);

// //     // -----------------------------
// //     // UPDATE UI
// //     // -----------------------------
// //     setStartTime(startFormatted);
// //     setEndTime(endFormatted);
// //     setRunForValue(runHours);
// //     setRunForUnit("hr");
// //     setFeedLevel(as2 || "0000");
// //     setTimeGap(as4 || "0000");

// //     // -----------------------------
// //     // Rebuild EXACT SAME PAYLOAD
// //     // -----------------------------
// //     const rebuiltPayload =
// //       `c0=212` +
// //       `&as1=${as1}` +
// //       `&as2=${as2}` +
// //       `&as3=${as3}` +
// //       `&as4=${as4}`;

// //     console.log("Rebuilt previous payload:", rebuiltPayload);

// //   } catch (e) {
// //     console.log("Error reading previous setting:", e);
// //   }
// // };




//   // --- Semi-circle gauge math (SVG)
//   // We'll draw an arc from left (-180deg) to right (0deg) as a semicircle.
//   // Use stroke-dasharray animation to fill.
//   const gaugeRadius = 90; // px
//   const gaugeCirc = Math.PI * gaugeRadius; // semicircle circumference (πr)
//   const gaugeOffset = (1 - feedPercent / 100) * gaugeCirc; // stroke-dashoffset

//   // needle rotation: -90 deg (left) to +90 deg (right)
//   const needleAngle = -90 + (feedPercent / 100) * 180;

//   // small helper for formatted clock
//   const formatClock = (d) =>
//     d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });


//   // console.log("controller.id",id)

//   return (
    
//     <div className="relative min-h-screen px-10">
//       {/* Background image with overlay */}
//       {/* <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url(${aquafarming})`,
//           opacity: 0.90,
//           filter: "brightness(0.8)",
//           backgroundAttachment: "fixed"
//         }}
//       /> */}
//       {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" /> */}
//       <div>
//         <TestController controllerId={id}/>
//       </div>

//       {/* Main centered glass container (full-width but limited max-width) */}
//       <div className="relative z-10 flex justify-center px-6 py-6">
//         <div className="w-full max-w-[1000px] bg-white backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 transition-all ">
//           {/* Header */}
//           {/* <div className="flex items-center justify-center mb-6">
//             <h2 className="text-2xl font-bold">Feeder Dashboard</h2> */}
//             {/* <div className="text-sm text-gray-600">Live: {formatClock(now)}</div> */}
//           {/* </div> */}
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold">Feeder Dashboard</h2>

//             <div className="flex items-center gap-3">
//                   {/* SETTINGS DROPDOWN */}
//                   <div>
//                     {/* <label className="font-semibold text-gray-700">Select Setting</label> */}
//                    <select
//                       className="w-full px-3 py-2 border rounded-md"
//                       value={String(selectedSetting ?? "")}
//                       onChange={(e) => {
//                         const id = Number(e.target.value);
//                         setSelectedSetting(id);

//                         // load the selected setting
//                         const selected = settingsList.find(s => s.id === id);
//                         if (selected) {
//                           setStartTime(selected.startTime);
//                           setEndTime(selected.endTime);
//                           setFeedLevel(selected.feedLevel);
//                           setFeedDuration(selected.feedDuration);
//                         }
//                       }}
//                     >
//                       <option value="">-- choose --</option>

//                       {settingsList.map((s) => (
//                         <option key={s.id} value={String(s.id)}>
//                           {s.label}
//                         </option>
//                       ))}
//                     </select>



//                   </div>

//               {/* Refresh Button */}
//               <button
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg 
//                           text-gray-700 hover:bg-gray-200 transition"
//                 onClick={() => handlePreviousSet(id)} 
//               >
//                 <FiRefreshCcw size={18} />
//                 Refresh
//               </button>

//               {/* Edit Button */}
//               <button
//                 className="flex items-center gap-2 px-4 py-2  text-black rounded-lg hover:bg-gray-200 transition"
//                 onClick={() => handleSet}
//               >
//                 <FiEdit size={18} />
//                 Edit
//               </button>

//             </div>
//           </div>


//           {/* Row 1: Start Time (clock widget), Run For, Time Gap */}
//           <div className="grid grid-cols-12 gap-4 items-center mb-6">
//             {/* Start Time + Live Clock */}
//             <div className="col-span-12 md:col-span-3 p-3.5 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-medium text-gray-700">Start Time</label>
//                 <div className="text-xs text-gray-500">Local</div>
//               </div>

//               <div className="flex items-center gap-3">
//                 {/* Clock widget */}
//                 <div className="flex items-center gap-3">
//                   {/* <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center"> */}
//                     {/* Simple analog-like clock SVG */}
//                     {/* <svg viewBox="0 0 64 64" width="40" height="40" className="animate-spin-slow"> */}
//                       {/* <circle cx="32" cy="32" r="30" fill="none" stroke="#E2E8F0" strokeWidth="4" /> */}
//                       {/* small center dot */}
//                       {/* <circle cx="32" cy="32" r="2.5" fill="#5874dc" /> */}
//                       {/* hour/min/second markers could be added but keep simple */}
//                     {/* </svg> */}
//                   {/* </div> */}
//                   <div className="flex flex-col">
//                     <input
//                       type="time"
//                       value={startTime}
//                       onChange={(e) => setStartTime(e.target.value)}
//                       className="px-3 py-2 rounded-md border w-40"
//                     />
//                     {/* <div className="text-xs text-gray-500 mt-1">Real time clock: {formatClock(now)}</div> */}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Run For */}
//             <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
//                 <div className="flex items-center justify-between">
//                   {/* <label className="text-sm font-medium text-gray-700">Run For</label>
//                   <div className="text-xs text-gray-500">Duration (Hours Only)</div>
//                 </div>

//                 <div className="flex gap-3 items-center">
//                   <input
//                     type="number"
//                     min="0"
//                     value={runForValue}
//                     onChange={(e) => setRunForValue(e.target.value)}
//                     placeholder="Enter hours"
//                     className="px-3 py-2 rounded-md border w-full"
//                   /> */}

//                   {/* Removed sec/min/hr dropdown -> now only hours */}
//                   {/* <div className="text-sm text-gray-600">hrs</div> */}




//                   <label className="text-sm font-medium text-gray-700">Feeding Level (KG)</label>
//                   {/* <div className="text-xs text-gray-500">Duration (Hours Only)</div> */}
//                 </div>

//                 <div className="flex gap-3 items-center ">
//                   <input
//                     type="number"
//                     min="0"
//                     max={gaugeMaxKg}
//                     value={feedLevel}
//                     onChange={(e) => setFeedLevel(e.target.value)}
//                     placeholder={`0 - ${gaugeMaxKg} KG`}
//                     className="px-3 py-2 rounded-md border w-full"
//                   />

//                   {/* Removed sec/min/hr dropdown -> now only hours */}
//                   <div className="text-sm text-gray-600">KG</div>
//                 </div>
//               </div>
//                {/* Dispatch Amount */}
//               <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-medium text-gray-700">Dispatch</label>
//                   <div className="text-xs text-gray-500">Grams</div>
//                 </div>

//                   <select
//                     className="px-3 py-2 rounded-md border w-full text-gray-700"
//                     value={dispatch}
//                     onChange={(e) => setDispatch(e.target.value)}
//                   >
//                     {/* <option value="">Select Dispatch</option> */}
//                     <option value="0250">250 g (Default)</option>
//                     <option value="0500">500 g</option>
//                   </select>
//                 </div>


              


//             {/* Time Gap */}
//             <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-medium text-gray-700">Time Gap</label>
//                 <div className="text-xs text-gray-500">Interval</div>
//               </div>

//               <select
//                 value={timeGap}
//                 onChange={(e) => setTimeGap(Number(e.target.value))}
//                 className="px-3 py-2 rounded-md border w-full"
//               >
//                 <option value={180}>3 minutes (Default)</option>
//                 <option value={240}>4 minutes </option>
//                 <option value={300}>5 minutes </option>
//                 <option value={360}>6 minutes</option>
//               </select>

//               {/* <div className="text-sm text-gray-500">Default 180s</div> */}
//             </div>
//           </div>

//           {/* Row 2: Gauge center + Feeding level + Total Hours + Tags + Set button */}
//           <div className="grid grid-cols-12 gap-3 items-center">
//             {/* Left spacer / feeding level input */}
//             <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
//               <label className="text-sm font-medium text-gray-700">Total Cycles</label>
//               <input
//                 type="text"
//                 readOnly
//                 value={totalCycles ? totalCycles : ""}
                
//                 className="px-3 py-2 rounded-md border bg-gray-100"
//               />
//               <div className="text-xs text-gray-500">Auto-calculated</div>

//               {/* tags */}
//               {/* <div className="mt-3"> */}
//                 {/* <label className="text-sm text-gray-600">Tags</label>
//                 <div className="flex gap-2 mt-2">
//                   <input
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyDown={onTagKey}
//                     placeholder="add tag + Enter"
//                     className="px-2 py-1 border rounded"
//                   />
//                   <button onClick={addTag} className="px-3 py-1 bg-[#5874dc] text-white rounded">Add</button>
//                 </div> */}

//                 {/* <div className="flex flex-wrap gap-2 mt-2">
//                   {tags.map((t) => (
//                     <div key={t} className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border">
//                       <span className="text-sm">{t}</span>
//                       <button onClick={() => removeTag(t)} className="text-xs text-red-500">×</button>
//                     </div>
//                   ))}
//                 </div> */}
//               {/* </div> */}
//             </div>

//             {/* Center gauge */}
//             <div className="col-span-12 md:col-span-6 flex justify-center p-4">
//               <div className="bg-white/60 rounded-lg border border-white/40 p-6 w-full max-w-md flex flex-col items-center transition-transform hover:scale-[1.01]">
//                 <div className="w-full flex justify-center mb-3">
//                   {/* Semi-circle gauge (SVG) */}
//                   <svg
//                     width={gaugeRadius * 2 + 20}
//                     height={gaugeRadius + 40}
//                     viewBox={`0 0 ${gaugeRadius * 2 + 20} ${gaugeRadius + 40}`}
//                     className="overflow-visible"
//                   >
//                     <defs>
//                       <linearGradient id="g1" x1="0" x2="1">
//                         <stop offset="0%" stopColor="#66b3ff" />
//                         <stop offset="100%" stopColor="#5874dc" />
//                       </linearGradient>
//                     </defs>

//                     {/* background arc (light) */}
//                     <path
//                       d={describeSemiCirclePath(gaugeRadius)}
//                       fill="none"
//                       stroke="#e6e7ee"
//                       strokeWidth="16"
//                       strokeLinecap="round"
//                       transform={`translate(10,10)`}
//                     />

//                     {/* foreground arc (animated) */}
//                     <path
//                       d={describeSemiCirclePath(gaugeRadius)}
//                       fill="none"
//                       stroke="url(#g1)"
//                       strokeWidth="16"
//                       strokeLinecap="round"
//                       transform={`translate(10,10)`}
//                       strokeDasharray={gaugeCirc}
//                       strokeDashoffset={gaugeOffset}
//                       style={{ transition: "stroke-dashoffset 800ms ease" }}
//                     />

//                     {/* needle pivot / rotate */}
//                     <g transform={`translate(${gaugeRadius + 10}, ${gaugeRadius + 10})`}>
//                       <line
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2={-gaugeRadius + 8}
//                         stroke="#222"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         transform={`rotate(${needleAngle})`}
//                         style={{ transition: "transform 800ms ease" }}
//                       />
//                       <circle r="4" fill="#222" />
//                     </g>

//                     {/* value text below arc inside SVG */}
//                     <text
//                       x={(gaugeRadius + 10)}
//                       y={gaugeRadius + 32}
//                       textAnchor="middle"
//                       fontSize="14"
//                       fill="#333"
//                     >
//                       {feedValueNumber} KG
//                     </text>
//                   </svg>
//                 </div>

//                 <div className="text-sm text-gray-600">Feeding Level</div>
//                 <div className="text-lg font-semibold mt-2">{feedValueNumber} / {gaugeMaxKg} KG</div>
//                 <div className="text-xs text-gray-500 mt-1">Animated semi-circle gauge</div>
//               </div>
//             </div>

//             {/* Right column: Total Hours and Set button */}
//             <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
//                 <label className="text-sm font-medium text-gray-700">Total Running Hours</label>

//                 <input
//                   type="text"
//                   readOnly
//                   value={totalRunningHours ? totalRunningHours : ""}
//                   className="px-3 py-2 rounded-md border bg-gray-100"
//                 />

//   <div className="text-xs text-gray-500">Based on cycle × time gap</div>
//               <div className="mt-auto">
//                 <button
//                   onClick={() => handleSet(id)} 
//                   className="w-full bg-blue-700 text-white p-3 rounded-lg font-medium hover:bg-[#405ed0] transition"
//                 >
//                   Set
//                 </button>
//                 <button
//                   // onClick={() => setShowMultiSetting(true)}
//                   onClick={addSetting}
//                   className="px-4 py-2 mt-10 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                 >
//                   Add Setting
//                 </button>

//               </div>
//             </div>
//           </div>

//           {/* Footer small help text */}
//           <div className="mt-6 text-sm text-gray-500">
//             Tip: use the Run For unit selector to enter seconds/minutes/hours. Time Gap defaults to 180 seconds.
//           </div>
//         </div>
//       </div>
//       <div>
//         {showMultiSetting && (
//           <MultiSettingManager
//             previousAck={settingsList}   // Pass previous settings
//             updateSettings={setSettingsList}
//             onClose={() => setShowMultiSetting(false)}
//           />
//         )}

//       </div>
//     </div>
//   );
// }

// /* ---------- small helper to create a semicircle path for given radius ---------- */
// /* returns an SVG path string centered properly for our usage */
// function describeSemiCirclePath(radius) {
//   // We will produce a semicircle path from left to right with center at (radius, radius)
//   // but because we translate the entire path by (10,10) outside, we can draw from (0, radius) to (2r, radius)
//   // using arc: M 0,r A r,r 0 0 1 2r,r
//   const r = radius;
//   const x1 = 0;
//   const y = r;
//   const x2 = 2 * r;
//   return `M ${x1} ${y} A ${r} ${r} 0 0 1 ${x2} ${y}`;
// }









import React, { useEffect, useMemo, useState } from "react";
import aquafarming from "../assets/Aqua_farming.jpg";
import axios from "axios";
import TestController from "./Testing/TestController";
import { useLocation } from "react-router-dom";
import { FiEdit, FiRefreshCcw } from "react-icons/fi";
import api from "../api/axios.js";
import MultiSettingManager from "./MultiSetting/MultiSettingManager.jsx";

/**
 * Dashboard.jsx — adds Edit -> Save/Cancel flow for rewriting existing saved settings.
 * Layout and styles kept exactly as before.
 */

export default function Dashboard() {
  // inputs
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [runForValue, setRunForValue] = useState("");
  const [runForUnit, setRunForUnit] = useState("sec");
  const [feedLevel, setFeedLevel] = useState("");
  const [timeGap, setTimeGap] = useState(180);
  const [dispatch, setDispatch] = useState(250);
  const [feedDuration, setFeedDuration] = useState("");
  const [refreshing, setRefreshing] = useState(false);


  // saved settings list and selection
  const [settingsList, setSettingsList] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const location = useLocation();
  const { id } = location.state || {};

  // live clock
  const [now, setNow] = useState(new Date());

  // multi-setting viewer
  const [showMultiSetting, setShowMultiSetting] = useState(false);
  const [currentAck, setCurrentAck] = useState("");

  // EDIT MODE: only allowed when a saved setting is selected via dropdown
  const [isEditing, setIsEditing] = useState(false);

  // Controlled select value (string) to avoid fallback to first option
  const selectedSettingStr = selectedSetting ? String(selectedSetting) : "";

  // fetch settings when id available
  useEffect(() => {
    if (!id) return;
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // When a setting is selected, load its data into inputs.
  // If no selectedSetting -> clear inputs (empty dashboard).
  useEffect(() => {
    if (!selectedSetting) {
      setStartTime("");
      setEndTime("");
      setFeedLevel("");
      setFeedDuration("");
      // keep defaults for timeGap/dispatch
      setIsEditing(false); // ensure edit mode off when selection cleared
      return;
    }

    const selected = settingsList.find((s) => s.id === Number(selectedSetting));
    if (!selected) return;

    // load values from selected setting
    setStartTime(selected.startTime ?? selected.value ?? "");
    setEndTime(selected.endTime ?? "");
    setFeedLevel(selected.feedLevel ?? "");
    setFeedDuration(selected.feedDuration ?? "");
    setTimeGap(Number(selected.timeGap ?? 180));
    setDispatch(Number(selected.dispatch ?? 250));
    // do not change isEditing here (Edit button controls it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSetting, settingsList]);

  // reindex helper to keep ids sequential
  const reindex = (arr) => arr.map((s, i) => ({ ...s, id: i + 1, label: s.label ?? `Setting ${i + 1}` }));

  // updateCurrentSetting should only change the saved list when in edit mode.
  // For proper Save/Cancel behavior, we DO NOT mutate settingsList live here.
  // All changes are only persisted when saveEditedSetting() is called.
  const updateCurrentSettingInSaved = (field, value) => {
    if (!selectedSetting) return;
    if (!isEditing) return;
    // Intentionally left empty to avoid mutating settingsList before Save.
    // Keep using local state (setStartTime, setFeedLevel, etc.) for inputs.
  };


  // Add current inputs as a new saved setting (validated/deduped)
  const addSetting = () => {
    if (isEditing) {
      alert("Finish editing (Save/Cancel) before adding a new setting.");
      return;
    }
    if (!startTime) {
      alert("Please enter a Start Time before adding a setting.");
      return;
    }

    const candidate = {
      startTime: startTime.trim(),
      feedLevel: String(feedLevel),
      timeGap: Number(timeGap || 180),
      dispatch: Number(dispatch || 250),
    };

    // duplicate check
    const duplicate = settingsList.find(
      (s) =>
        (s.startTime || "") === candidate.startTime &&
        String(s.feedLevel) === candidate.feedLevel &&
        Number(s.timeGap || 180) === candidate.timeGap &&
        Number(s.dispatch || 250) === candidate.dispatch
    );
    if (duplicate) {
      setSelectedSetting(duplicate.id);
      setShowMultiSetting(true);
      alert("This exact setting already exists. Selected existing entry.");
      return;
    }

    const appended = [
      ...settingsList,
      {
        id: settingsList.length + 1,
        label: `Setting ${settingsList.length + 1}`,
        startTime: candidate.startTime,
        endTime: endTime || "",
        feedLevel: candidate.feedLevel,
        timeGap: candidate.timeGap,
        dispatch: candidate.dispatch,
        feedDuration: feedDuration || "",
        value: candidate.startTime,
      },
    ];

    const reindexed = reindex(appended);
    setSettingsList(reindexed);

    // CLEAR UI and selection so dashboard becomes empty after add
    setSelectedSetting(null);
    setStartTime("");
    setEndTime("");
    setFeedLevel("");
    setFeedDuration("");

    // open MultiSettingManager so user verifies saved settings
    setShowMultiSetting(true);
  };

  // Save changes made while in EDIT MODE to the selected setting (overwrite)
  const saveEditedSetting = () => {
    if (!selectedSetting) {
      alert("No setting selected to save.");
      return;
    }
    // Overwrite selected saved item with current input values
    const updated = settingsList.map((s) =>
      s.id === Number(selectedSetting)
        ? {
            ...s,
            startTime: startTime || "",
            endTime: endTime || "",
            feedLevel: feedLevel || "",
            timeGap: Number(timeGap || 180),
            dispatch: Number(dispatch || 250),
            feedDuration: feedDuration || "",
            value: startTime || s.value || "",
          }
        : s
    );
    setSettingsList(reindex(updated));
    setIsEditing(false);
    // keep selectedSetting so dropdown still highlights the item
    alert("Saved changes to selected setting.");
  };

  // Cancel edit mode and revert inputs to saved setting values
  const cancelEdit = () => {
    if (!selectedSetting) {
      setIsEditing(false);
      return;
    }
    const s = settingsList.find((x) => x.id === Number(selectedSetting));
    if (s) {
      setStartTime(s.startTime ?? s.value ?? "");
      setEndTime(s.endTime ?? "");
      setFeedLevel(s.feedLevel ?? "");
      setFeedDuration(s.feedDuration ?? "");
      setTimeGap(Number(s.timeGap ?? 180));
      setDispatch(Number(s.dispatch ?? 250));
    }
    setIsEditing(false);
  };

  // fetch settings from server
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`/api/controller/${id}/settings`);
      const data = res.data;
      let formatted = [];

      if (typeof data === "string" && data.startsWith("ACK")) {
        const parts = data.split(",");
        const times = parts[2]?.split("|") || [];
        formatted = times.map((t, i) => ({
          id: i + 1,
          label: `Setting ${i + 1}`,
          startTime: t.trim(),
          endTime: "",
          feedLevel: "",
          feedDuration: "",
          value: t.trim(),
          timeGap: 180,
          dispatch: 250,
        }));
      } else if (data?.items && Array.isArray(data.items)) {
        formatted = data.items.map((t, i) => ({
          id: i + 1,
          label: `Setting ${i + 1}`,
          startTime: t,
          endTime: "",
          feedLevel: "",
          feedDuration: "",
          value: t,
          timeGap: 180,
          dispatch: 250,
        }));
      } else if (Array.isArray(data)) {
        formatted = data.map((t, i) => ({
          id: i + 1,
          label: `Setting ${i + 1}`,
          startTime: t.startTime ?? t.value ?? "",
          endTime: t.endTime ?? "",
          feedLevel: t.feedLevel ?? "",
          feedDuration: t.feedDuration ?? "",
          value: t.value ?? t.startTime ?? "",
          timeGap: t.timeGap ?? 180,
          dispatch: t.dispatch ?? 250,
        }));
      } else if (typeof data === "object" && data !== null && data.items) {
        formatted = data.items.map((t, i) => ({
          id: i + 1,
          label: `Setting ${i + 1}`,
          startTime: t,
          endTime: "",
          feedLevel: "",
          feedDuration: "",
          value: t,
          timeGap: 180,
          dispatch: 250,
        }));
      }

      setSettingsList(reindex(formatted));
      setSelectedSetting(null); // do not auto-select
    } catch (err) {
      console.error("Failed to load settings", err);
    }
  };

  // clock updater
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // calculations
  const totalCycles = useMemo(() => {
    const level = Number(feedLevel) || 0;
    const disp = Number(dispatch) || 0;
    if (!level || !disp) return 0;
    return Math.floor((level * 1000) / disp);
  }, [feedLevel, dispatch]);

  const totalRunningHours = useMemo(() => {
    if (!totalCycles || !timeGap) return "0h 0m";
    const totalSeconds = totalCycles * Number(timeGap);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }, [totalCycles, timeGap]);

  // payload builders
  const toHHMM = (t) => (t ? t.replace(":", "").padStart(4, "0") : "0000");
  const toHHMMNoColon = (t) => (t ? t.toString().replace(":", "").padStart(4, "0") : "0000");

  const buildSinglePayloadString = () => {
    const startHHMM = toHHMM(startTime);

    const cycles = Number(totalCycles) || 0;
    const gap = Number(timeGap) || 0;

    let as3 = "0000";
    if (cycles > 0 && gap > 0) {
      const totalSeconds = cycles * gap;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      as3 = `${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;
    }

    const as2 = String(Math.round(Number(feedLevel) || 0)).padStart(4, "0");
    const as4 = String(Number(timeGap) || 180).padStart(4, "0");
    const as9 = String(Number(dispatch) || 250).padStart(4, "0");
    const as10 = String(Number(totalCycles) || 0).padStart(4, "0");

    return `c0=212&as1=${startHHMM}&as2=${as2}&as3=${as3}&as4=${as4}&as9=${as9}&as10=${as10}`;
  };


  const buildMultiPayloadString = (list) => {
    const as1 = list.map((s) => toHHMMNoColon(s.startTime)).join(":");

    const as2 = list
      .map((s) => String(Math.round(Number(s.feedLevel) || 0)).padStart(4, "0"))
      .join(":");

    const as3 = list
      .map((s) => {
        const feed = Number(s.feedLevel || 0);
        const dispatch = Number(s.dispatch || 250);
        const gap = Number(s.timeGap || 180);

        const cycles = dispatch > 0 ? Math.floor((feed * 1000) / dispatch) : 0;
        const totalSeconds = cycles * gap;

        if (totalSeconds <= 0) return "0000";

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;
      })
      .join(":");

    const as4 = list
      .map((s) => String(Number(s.timeGap) || 180).padStart(4, "0"))
      .join(":");

    const as9 = list
      .map((s) => String(Number(s.dispatch || 250)).padStart(4, "0"))
      .join(":");

    const as10 = list
      .map((s) => {
        const cycles = Math.floor((Number(s.feedLevel || 0) * 1000) / Number(s.dispatch || 250));
        return String(cycles).padStart(4, "0");
      })
      .join(":");

    return `c0=212&as1=${as1}&as2=${as2}&as3=${as3}&as4=${as4}&as9=${as9}&as10=${as10}`;
  };


  // send SET to controller
  const handleSet = async () => {
  try {
    // 1) Build payload from current settings
    const payload =
      settingsList.length > 0
        ? buildMultiPayloadString(settingsList)
        : buildSinglePayloadString();

    console.log("Sending payload:", payload);

    // 2) Send command to backend
    const res = await api.post(`/controller/${id}/command`, { payload });

    console.log("Command response:", res.data);

    const { ack, ack_payload } = res.data || {};

    // 3) Check ACK status from backend
    if (ack === "received") {
      // ✅ Backend saw a new row in controller_status for this controller
      alert("Settings applied! ACK received from controller.");

      // (optional) if you want to inspect what the device replied:
      if (ack_payload) {
        console.log("ACK payload from device:", ack_payload);
      }

      // 4) Clear inputs & selection only on success
      setStartTime("");
      setEndTime("");
      setFeedLevel("");
      setFeedDuration("");
      setSelectedSetting(null);
      setIsEditing(false);
      setShowMultiSetting(false);
    } else if (ack === "not_received") {
      // ❌ No DB row appeared within 6 seconds
      alert("Settings sent, but NO ACK from controller (timeout). Check device / MQTT.");
      // keep UI as-is so user can retry
    } else {
      // Unexpected / older backend response shape
      alert("Settings sent, but got an unexpected response. Check console.");
    }
  } catch (e) {
    console.error("Error sending settings:", e);
    if (e.response) {
      console.error("Backend error response:", e.response.data);
    }
    alert("Failed to send settings (network or server error).");
  }
};


  // read previous settings from controller -> show manager
  const handlePreviousSet = async () => {
  try {
    // ask controller to send previous settings
    await api.post(`/controller/${id}/command`, { payload: "c0=202" });

    // small delay so controller can respond
    await new Promise((r) => setTimeout(r, 1500));

    // read status from backend (which should include controller ACK)
    const res = await api.get(`/controller/${id}/status`);

    const ack = res.data?.ack_payload || res.data?.payload || "";
    setCurrentAck(ack);

    // if no ACK, nothing from controller
    if (!ack) {
      alert("Controller did not return any settings.");
      return;
    }

    const parts = ack.split("&");
    const as1 = parts.find((p) => p.startsWith("as1="))?.split("=")[1];
    const as2 = parts.find((p) => p.startsWith("as2="))?.split("=")[1];
    const as4 = parts.find((p) => p.startsWith("as4="))?.split("=")[1];
    const as9 = parts.find((p) => p.startsWith("as9="))?.split("=")[1];

    if (!as1) {
      alert("Controller ACK has no time settings (as1 missing).");
      return;
    }

    const splitList = (s) =>
      s.includes("|") ? s.split("|") : s.includes(":") ? s.split(":") : [s];

    const as1List = splitList(as1).map((t) => {
      const cleaned = (t || "").replace(/[^0-9]/g, "");
      return cleaned.length === 4
        ? `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`
        : cleaned;
    });

    const as2List = as2 ? (as2.includes(":") ? as2.split(":") : [as2]) : [];
    const as4List = as4 ? (as4.includes(":") ? as4.split(":") : [as4]) : [];
    const as9List = as9 ? (as9.includes(":") ? as9.split(":") : [as9]) : [];

    const formatted = as1List.map((st, i) => ({
      id: i + 1,
      label: `Setting ${i + 1}`,
      startTime: st,
      endTime: "", // end will be auto-calculated on dashboard now
      feedLevel: as2List[i] ? String(Number(as2List[i]) || 0) : "",
      feedDuration: "",
      timeGap: as4List[i] ? Number(as4List[i]) : 180,
      dispatch: as9List[i] ? Number(as9List[i]) : 250,
      value: st,
    }));

    setSettingsList(reindex(formatted));
    setSelectedSetting(null);
    setShowMultiSetting(true);
  } catch (err) {
    console.error("Failed to fetch previous settings:", err);
    alert("Could not fetch previous settings from controller.");
  }
};


  // gauge math
  const gaugeMaxKg = 2000;
  const feedValueNumber = Number(feedLevel) || 0;
  const feedPercent = Math.max(0, Math.min(100, (feedValueNumber / gaugeMaxKg) * 100));
  const gaugeRadius = 90;
  const gaugeCirc = Math.PI * gaugeRadius;
  const gaugeOffset = (1 - feedPercent / 100) * gaugeCirc;
  const needleAngle = -90 + (feedPercent / 100) * 180;
  const formatClock = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="relative min-h-screen px-10">
      <div>
        <TestController controllerId={id} />
      </div>

      <div className="relative z-10 flex justify-center px-6 py-6">
        <div className="w-full max-w-[1000px] bg-white backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 transition-all ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Feeder Dashboard</h2>

            <div className="flex items-center gap-3">
              <div>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedSettingStr}
                  onChange={(e) => {
                    const idVal = e.target.value === "" ? null : Number(e.target.value);
                    setSelectedSetting(idVal);
                    setIsEditing(false); // disable edit whenever a new selection is made
                  }}
                >
                  <option value="">-- choose --</option>
                  {settingsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-300 transition"
                  onClick={async () => {
                    setRefreshing(true);
                    await handlePreviousSet();
                    setRefreshing(false);
                  }}
                >
                  <FiRefreshCcw
                    size={18}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Previous Setting
                </button>


              {/* EDIT / SAVE / CANCEL controls */}
              <div className="flex items-center gap-2">
                {/* Edit toggle */}
                <button
                  onClick={() => {
                    if (!selectedSetting) {
                      alert("Select a saved setting from dropdown to edit it.");
                      return;
                    }
                    setIsEditing(true);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEditing ? "bg-gray-200 text-black" : "text-black hover:bg-orange-300"}`}
                  title="Edit selected saved setting"
                >
                  <FiEdit size={18} />
                  Edit
                </button>

                {/* Save (visible only during editing) */}
                {isEditing && (
                  <>
                    <button
                      onClick={saveEditedSetting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {/* Set (send to controller) */}
                <button
                  onClick={handleSet}
                  className="flex items-center gap-2 px-4 py-2 text-black rounded-lg hover:bg-green-500 transition"
                >
                  Set
                </button>
              </div>
            </div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12 md:col-span-3 p-3.5 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <div className="text-xs text-gray-500">Local</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStartTime(val);
                      // only update saved when editing a selected setting
                      if (isEditing && selectedSetting) updateCurrentSettingInSaved("startTime", val);
                    }}
                    className="px-3 py-2 rounded-md border w-40"
                    disabled={!!selectedSetting && !isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Feeding Level */}
            <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Feeding Level (KG)</label>
              </div>

              <div className="flex gap-3 items-center ">
                <input
                  type="number"
                  min="0"
                  max={gaugeMaxKg}
                  value={feedLevel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFeedLevel(val);
                    if (isEditing && selectedSetting) updateCurrentSettingInSaved("feedLevel", val);
                  }}
                  placeholder={`0 - ${gaugeMaxKg} KG`}
                  className="px-3 py-2 rounded-md border w-full"
                  disabled={!!selectedSetting && !isEditing}
                />
                <div className="text-sm text-gray-600">KG</div>
              </div>
            </div>

            {/* Dispatch */}
            <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Dispatch</label>
                <div className="text-xs text-gray-500">Grams</div>
              </div>

              <select
                className="px-3 py-2 rounded-md border w-full text-gray-700"
                value={dispatch}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDispatch(val);
                  if (isEditing && selectedSetting) updateCurrentSettingInSaved("dispatch", val);
                }}
                disabled={!!selectedSetting && !isEditing}
              >
                <option value={250}>250 g (Default)</option>
                <option value={500}>500 g</option>
              </select>
            </div>

            {/* Time Gap */}
            <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Time Gap</label>
                <div className="text-xs text-gray-500">Interval</div>
              </div>

              <select
                value={timeGap}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTimeGap(val);
                  if (isEditing && selectedSetting) updateCurrentSettingInSaved("timeGap", val);
                }}
                className="px-3 py-2 rounded-md border w-full"
                disabled={!!selectedSetting && !isEditing}
              >
                <option value={180}>3 minutes (Default)</option>
                <option value={240}>4 minutes </option>
                <option value={300}>5 minutes </option>
                <option value={360}>6 minutes</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <label className="text-sm font-medium text-gray-700">Total Cycles</label>
              <input
                type="text"
                readOnly
                value={totalCycles ? totalCycles : ""}
                className="px-3 py-2 rounded-md border bg-gray-100"
              />
              <div className="text-xs text-gray-500">Auto-calculated</div>
            </div>

            <div className="col-span-12 md:col-span-6 flex justify-center p-4">
              <div className="bg-white/60 rounded-lg border border-white/40 p-6 w-full max-w-md flex flex-col items-center transition-transform hover:scale-[1.01]">
                <div className="w-full flex justify-center mb-3">
                  <svg
                    width={gaugeRadius * 2 + 20}
                    height={gaugeRadius + 40}
                    viewBox={`0 0 ${gaugeRadius * 2 + 20} ${gaugeRadius + 40}`}
                    className="overflow-visible"
                  >
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#66b3ff" />
                        <stop offset="100%" stopColor="#5874dc" />
                      </linearGradient>
                    </defs>

                    <path
                      d={describeSemiCirclePath(gaugeRadius)}
                      fill="none"
                      stroke="#e6e7ee"
                      strokeWidth="16"
                      strokeLinecap="round"
                      transform={`translate(10,10)`}
                    />

                    <path
                      d={describeSemiCirclePath(gaugeRadius)}
                      fill="none"
                      stroke="url(#g1)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      transform={`translate(10,10)`}
                      strokeDasharray={gaugeCirc}
                      strokeDashoffset={gaugeOffset}
                      style={{ transition: "stroke-dashoffset 800ms ease" }}
                    />

                    <g transform={`translate(${gaugeRadius + 10}, ${gaugeRadius + 10})`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={-gaugeRadius + 8}
                        stroke="#222"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        transform={`rotate(${needleAngle})`}
                        style={{ transition: "transform 800ms ease" }}
                      />
                      <circle r="4" fill="#222" />
                    </g>

                    <text
                      x={gaugeRadius + 10}
                      y={gaugeRadius + 32}
                      textAnchor="middle"
                      fontSize="14"
                      fill="#333"
                    >
                      {feedValueNumber} KG
                    </text>
                  </svg>
                </div>

                <div className="text-sm text-gray-600">Feeding Level</div>
                <div className="text-lg font-semibold mt-2">{feedValueNumber} / {gaugeMaxKg} KG</div>
                <div className="text-xs text-gray-500 mt-1">Animated semi-circle gauge</div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 p-4 bg-white/60 rounded-lg border border-white/40 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <label className="text-sm font-medium text-gray-700">Total Running Hours</label>

              <input
                type="text"
                readOnly
                value={totalRunningHours ? totalRunningHours : ""}
                className="px-3 py-2 rounded-md border bg-gray-100"
              />

              <div className="text-xs text-gray-500">Based on cycle × time gap</div>
              <div className="mt-auto">
                <button
                  onClick={addSetting}
                  className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700"
                  disabled={isEditing}
                >
                  Add Setting
                </button>

                <button
                  onClick={() => setShowMultiSetting(true)}
                  className="w-full mt-3 bg-gray-200 text-black p-2 rounded-lg"
                >
                  View Saved
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Tip: use the Run For unit selector to enter seconds/minutes/hours. Time Gap defaults to 180 seconds.
          </div>
        </div>
      </div>

      <div>
        {showMultiSetting && (
          <MultiSettingManager
            settings={settingsList}
            updateSettings={(newArr) => {
              const re = reindex(newArr || []);
              setSettingsList(re);
              setSelectedSetting(null);
              setIsEditing(false);
              if (!re.length) setShowMultiSetting(false);
            }}
            onClose={() => setShowMultiSetting(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- helper to create a semicircle path ---------- */
function describeSemiCirclePath(radius) {
  const r = radius;
  const x1 = 0;
  const y = r;
  const x2 = 2 * r;
  return `M ${x1} ${y} A ${r} ${r} 0 0 1 ${x2} ${y}`;
}
