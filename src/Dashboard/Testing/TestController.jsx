// import { useState } from "react";
// import { FiCpu, FiPlay, FiRefreshCcw } from "react-icons/fi";
// // import axios from "axios";
// import api from "../../api/axios";

// export default function TestController({ controllerId}) {
//   const [responseMsg, setResponseMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [deviceStatus, setDeviceStatus] = useState("unknown");
//   const  [signalValue,setSignalValue]=useState(0);
//   const [dateTime, setDateTime] = useState(""); 


// const handleTestButton = async (id) => {
//   setLoading(true);

//   try {
//     const res = await api.post(`/controller/${id}/command`, {
//       payload: "c0=203",
//     });

//     console.log("Response Received:", res.data);

//     // Delay after receiving response
//     await new Promise((r) => setTimeout(r, 1000));

//   } catch (err) {
//     console.error("Error:", err);
//   } finally {
//     setLoading(false);
//   }
// };



//   const handleTest = async (id) => {
//   try {
//     setResponseMsg("");
//     setDeviceStatus("waiting");

//     // Timeout if no MQTT response
//     const timeout = setTimeout(() => {
//       setDeviceStatus("offline");
//       setResponseMsg("Device did not respond (Timeout)");
//     }, 4000);

//     // STEP 1 → Send test command
//     await api.post(`/controller/${id}/command`, {
//       payload: "c0=201"
//     });

//     // STEP 2 → Wait for MQTT to send ack into DB
//     await new Promise((res) => setTimeout(res, 1500));

//     // STEP 3 → Fetch latest ACK
//     const res = await api.get(`/controller/${id}/status`);

//     console.log("Test ACK:", res.data.payload);

//     const ackPayload = res.data.payload || "";

//     // Parse ack string
//     const params = new URLSearchParams(ackPayload);
//     const a4Value = params.get("a4");
//     const a3Value = params.get("a3");

//     console.log("a3 value:", a3Value);
//     console.log("a4 value:", a4Value);

//     // Signal
//     if (a4Value) setSignalValue(Number(a4Value));

//     // Format date/time
//     if (a3Value && a3Value.length === 12) {
//       const d = a3Value;
//       const formattedDate = `20${d.slice(4,6)}-${d.slice(2,4)}-${d.slice(0,2)} ${d.slice(6,8)}:${d.slice(8,10)}:${d.slice(10,12)}`;

//       setDateTime(formattedDate);
//       console.log("Formatted a3:", formattedDate);
//     }

//     clearTimeout(timeout);
//     setDeviceStatus("online");
//     setResponseMsg(`Date/Time: ${a3Value ? dateTime : "No time data"}`);

//   } catch (err) {
//     setDeviceStatus("offline");
//     console.log("Test error:", err);
//   } finally {
//     setLoading(false);
//   }
// };


  

//   // -----------------------------
//   // SIGNAL BAR UI (3 LINE TOWER)
//   // -----------------------------
// const renderSignalBar = () => {
//   let level = 0;

//   if (!signalValue) level = 0;
//   else if (signalValue >= 80) level = 4; // already exists
//   else if (signalValue >= 60) level = 3;
//   else if (signalValue >= 50) level = 2;
//   else level = 1;

//   const color =
//     level >= 3 ? "bg-green-600" : level === 2 ? "bg-yellow-500" : "bg-red-600"; // changed line to include level 4

//   return (
//     <div className="flex flex-col items-center mr-3">
//       <div className="flex items-end gap-[3px]">
//         <div className={`w-1 h-2 ${level >= 1 ? color : "bg-gray-300"}`} />
//         <div className={`w-1 h-3 ${level >= 2 ? color : "bg-gray-300"}`} />
//         <div className={`w-1 h-4 ${level >= 3 ? color : "bg-gray-300"}`} />
//         <div className={`w-1 h-5 ${level >= 4 ? color : "bg-gray-300"}`} /> {/* added 4th bar */}
//       </div>
//       <p className="text-xs mt-1 text-gray-600">{signalValue || 0}%</p>
//     </div>
//   );
// };


//   // -----------------------------
//   // STATUS BADGE UI
//   // -----------------------------
//   const renderStatus = () => {
//     if (deviceStatus === "online")
//       return <span className="text-green-600 font-semibold">🟢 LIVE</span>;

//     if (deviceStatus === "offline")
//       return <span className="text-red-600 font-semibold">🔴 OFFLINE</span>;

//     if (deviceStatus === "waiting")
//       return <span className="text-yellow-600 font-semibold">🟡 WAITING…</span>;

//     return <span className="text-gray-500">Status: Unknown</span>;
//   };

//   return (
//     <div className="w-full p-5 bg-white shadow-md rounded-xl">

//       {/* Header Row */}
//       <div className="flex justify-between items-center mb-3">

//         {/* Left: Title */}
//         <div className="flex items-center gap-2">
//           <FiCpu className="text-blue-600" size={20} />
//           <h2 className="text-lg font-semibold text-gray-800">
//             Controller ID: {controllerId}
//           </h2>
//         </div>

//         {/* Right: Status + Signal + Buttons */}
//         <div className="flex items-center gap-4">

//           {/* Signal Bars */}
//           {renderSignalBar()}

//           {/* Status Badge */}
//           {renderStatus()}

//           {/* Refresh Button */}
//           <button
//           onClick={() => handleTest(controllerId)} 
//           className="p-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
//             <FiRefreshCcw size={20} className="text-gray-700" />
//             <span>Refresh</span>
//           </button>

//           {/* Test Button */}
//           <button
//             onClick={() => handleTestButton(controllerId)}
//             className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg 
//                        hover:bg-blue-700 flex items-center gap-1"
//           >
//             <FiPlay size={14} />
//             {loading ? "..." : "Test"}
//           </button>
//         </div>
//       </div>

//       {/* Response Message */}
//       {responseMsg && (
//         <p className="mt-2 text-sm text-gray-700">{responseMsg}</p>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { FiCpu, FiPlay, FiRefreshCcw } from "react-icons/fi";
// import axios from "axios";
import api from "../../api/axios";

export default function TestController({ controllerId}) {
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState("unknown");
  const [signalValue, setSignalValue] = useState(0);
  const [dateTime, setDateTime] = useState(""); 
  const [refreshing, setRefreshing] = useState(false);


  // ------------------------------------
  // AUTO UPDATE FROM TELEMETRY (every 2 min)
  // ------------------------------------
  const fetchTelemetryAuto = async () => {
    try {
      const res = await api.get(`/controller/${controllerId}/telemetry?limit=1`);
      const items = res.data.items || [];

      if (items.length === 0) return;

      const latest = items[0];

      // a4 -> signal strength
      if (latest.a4) {
        setSignalValue(Number(latest.a4));
      }

      // Prefer a3 (DDMMYYHHMMSS from controller)
      if (latest.a3 && latest.a3.length === 12) {
        const d = latest.a3;
        const formattedDate = `${d.slice(0,2)}-${d.slice(2,4)}-20${d.slice(4,6)} ${d.slice(6,8)}:${d.slice(8,10)}:${d.slice(10,12)}`;
        setDateTime(formattedDate);
        console.log("Auto telemetry formatted a3:", formattedDate);
      }
      // Fallback: use received_at if a3 is missing
      else if (latest.received_at) {
        const dt = new Date(latest.received_at * 1000);
        const formatted = dt.toLocaleString();
        setDateTime(formatted);
        console.log("Auto telemetry from received_at:", formatted);
      }

      // if telemetry is coming, mark as online
      setDeviceStatus("online");
    } catch (err) {
      console.error("Error auto fetching telemetry:", err);
      // don't clear old values on error
    }
  };

  useEffect(() => {
    if (!controllerId) return;

    // first auto fetch on mount
    fetchTelemetryAuto();

    // then every 2 minutes (120000 ms)
    const timer = setInterval(fetchTelemetryAuto, 120000);

    return () => clearInterval(timer);
  }, [controllerId]);

  const handleTestButton = async (id) => {
    setLoading(true);

    try {
      const res = await api.post(`/controller/${id}/command`, {
        payload: "c0=203",
      });

      console.log("Response Received:", res.data);

      // Delay after receiving response
      await new Promise((r) => setTimeout(r, 1000));

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (id) => {
    try {
      setResponseMsg("");
      setDeviceStatus("waiting");

      // Timeout if no MQTT response
      const timeout = setTimeout(() => {
        setDeviceStatus("offline");
        setResponseMsg("Device did not respond (Timeout)");
      }, 4000);

      // STEP 1 → Send test command
      await api.post(`/controller/${id}/command`, {
        payload: "c0=201"
      });

      // STEP 2 → Wait for MQTT to send ack into DB
      await new Promise((res) => setTimeout(res, 1500));

      // STEP 3 → Fetch latest ACK
      const res = await api.get(`/controller/${id}/status`);

      console.log("Test ACK:", res.data.payload);

      const ackPayload = res.data.payload || "";

      // Parse ack string
      const params = new URLSearchParams(ackPayload);
      const a4Value = params.get("a4");
      const a3Value = params.get("a3");

      console.log("a3 value:", a3Value);
      console.log("a4 value:", a4Value);

      // Signal
      if (a4Value) setSignalValue(Number(a4Value));

      let formattedDate = null;

      // Format date/time
      if (a3Value && a3Value.length === 12) {
        const d = a3Value;
        formattedDate = `${d.slice(0,2)}-${d.slice(2,4)}-20${d.slice(4,6)} ${d.slice(6,8)}:${d.slice(8,10)}:${d.slice(10,12)}`;

        setDateTime(formattedDate);
        console.log("Formatted a3:", formattedDate);
      }

      clearTimeout(timeout);
      setDeviceStatus("online");
      setResponseMsg(`Date/Time: ${formattedDate ? formattedDate : "No time data"}`);

    } catch (err) {
      setDeviceStatus("offline");
      console.log("Test error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // SIGNAL BAR UI (3 LINE TOWER)
  // -----------------------------
  const renderSignalBar = () => {
    let level = 0;

    if (!signalValue) level = 0;
    else if (signalValue >= 80) level = 4; // already exists
    else if (signalValue >= 60) level = 3;
    else if (signalValue >= 50) level = 2;
    else level = 1;

    const color =
      level >= 3 ? "bg-green-600" : level === 2 ? "bg-yellow-500" : "bg-red-600"; // changed line to include level 4

    return (
      <div className="flex flex-col items-center mr-3">
        <div className="flex items-end gap-[3px]">
          <div className={`w-1 h-2 ${level >= 1 ? color : "bg-gray-300"}`} />
          <div className={`w-1 h-3 ${level >= 2 ? color : "bg-gray-300"}`} />
          <div className={`w-1 h-4 ${level >= 3 ? color : "bg-gray-300"}`} />
          <div className={`w-1 h-5 ${level >= 4 ? color : "bg-gray-300"}`} /> {/* added 4th bar */}
        </div>
        <p className="text-xs mt-1 text-gray-600">{signalValue || 0}%</p>
      </div>
    );
  };


  // -----------------------------
  // STATUS BADGE UI
  // -----------------------------
  // const renderStatus = () => {
  //   if (deviceStatus === "online")
  //     return <span className="text-green-600 font-semibold">🟢 LIVE</span>;

  //   if (deviceStatus === "offline")
  //     return <span className="text-red-600 font-semibold">🔴 OFFLINE</span>;

  //   if (deviceStatus === "waiting")
  //     return <span className="text-yellow-600 font-semibold">🟡 WAITING…</span>;

  //   return <span className="text-gray-500">Status: Unknown</span>;
  // };

  return (
    <div className="w-full p-5 bg-white shadow-md rounded-xl">

      {/* Header Row */}
      <div className="flex justify-between items-center mb-3">

        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <FiCpu className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Controller ID: {controllerId}
          </h2>
        </div>

        {/* Right: Status + Signal + Buttons */}
        <div className="flex items-center font-semibold gap-4">
          <p>Signal</p>

          {/* Signal Bars */}
          {renderSignalBar()}

          {/* ⏱ Date/Time (just showing the state we already set) */}
          {/* <div className="flex flex-col text-xs text-gray-600">
            <span>Last update</span>
            <span>{dateTime || "No data yet"}</span>
          </div> */}

          {/* Status Badge */}
          {/* {renderStatus()} */}

          {/* Refresh Button */}
          <button
              onClick={async () => {
                setRefreshing(true);
                await handleTest(controllerId);
                setRefreshing(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <FiRefreshCcw
                size={20}
                className={`text-gray-700 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>


          {/* Test Button */}
          <button
            onClick={() => handleTestButton(controllerId)}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 flex items-center gap-1"
          >
            <FiPlay size={14} />
            {loading ? "..." : "Test"}
          </button>
        </div>
      </div>

      {/* Response Message */}
      {/* {responseMsg && (
        <p className="mt-2 text-sm text-gray-700">{responseMsg}</p>
      )} */}
      <div className="mt-2 flex items-center gap-2">
  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
    Last Update:
  </p>
  <p className="text-lg font-semibold text-gray-700">
    {dateTime || "—"}
  </p>
</div>


    </div>
  );
}
