// import React, { useState, useEffect } from "react";

// export const TimePicker = ({ onTimeChange, initialHour = "12", initialMinute = "00", initialAmpm = "AM" }) => {
//   const [hour, setHour] = useState(initialHour);
//   const [minute, setMinute] = useState(initialMinute);
//   const [ampm, setAmpm] = useState(initialAmpm);

//   // Update parent component when values change
//   useEffect(() => {
//     if (hour && minute) {
//       const formatted = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${ampm}`;
//       onTimeChange?.(formatted);
//     }
//   }, [hour, minute, ampm, onTimeChange]);

//   return (
//     <div className="flex gap-2 items-center">
//       {/* Hour Dropdown */}
//       <select
//         value={hour}
//         onChange={(e) => setHour(e.target.value)}
//         className="border p-2 rounded-md"
//       >
//         <option value="">HH</option>
//         {Array.from({ length: 12 }, (_, i) => {
//           const val = (i + 1).toString();
//           return (
//             <option key={val} value={val}>
//               {val.padStart(2, "0")}
//             </option>
//           );
//         })}
//       </select>

//       {/* Minute Dropdown */}
//       <select
//         value={minute}
//         onChange={(e) => setMinute(e.target.value)}
//         className="border p-2 rounded-md"
//       >
//         <option value="">MM</option>
//         {Array.from({ length: 12 }, (_, i) => {
//           const val = (i * 5).toString();
//           return (
//             <option key={val} value={val}>
//               {val.padStart(2, "0")}
//             </option>
//           );
//         })}
//       </select>

//       {/* AM/PM Dropdown */}
//       <select
//         value={ampm}
//         onChange={(e) => setAmpm(e.target.value)}
//         className="border p-2 rounded-md"
//       >
//         <option value="AM">AM</option>
//         <option value="PM">PM</option>
//       </select>
//     </div>
//   );
// };

// export default TimePicker;



import React, { useState, useEffect } from "react";

export const TimePicker = ({ onTimeChange, initialHour = "12", initialMinute = "00", initialAmpm = "AM" }) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [ampm, setAmpm] = useState(initialAmpm);

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (hour12, ampm) => {
    let hour24 = parseInt(hour12, 10);
    
    if (ampm === "AM") {
      if (hour24 === 12) {
        hour24 = 0; // 12 AM = 00:xx
      }
    } else { // PM
      if (hour24 !== 12) {
        hour24 += 12; // Add 12 for PM (except 12 PM)
      }
      // 12 PM stays as 12
    }
    
    return hour24.toString().padStart(2, "0");
  };

  // Update parent component when values change
  useEffect(() => {
    if (hour && minute) {
      const hour24 = convertTo24Hour(hour, ampm);
      const formatted24Hour = `${hour24}:${minute.padStart(2, "0")}`;
      onTimeChange?.(formatted24Hour);
    }
  }, [hour, minute, ampm, onTimeChange]);

  return (
    <div className="flex gap-2 items-center">
      {/* Hour Dropdown */}
      <select
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">HH</option>
        {Array.from({ length: 12 }, (_, i) => {
          const val = (i + 1).toString();
          return (
            <option key={val} value={val}>
              {val.padStart(2, "0")}
            </option>
          );
        })}
      </select>

      {/* Minute Dropdown */}
      <select
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">MM</option>
        {Array.from({ length: 12 }, (_, i) => {
          const val = (i * 5).toString();
          return (
            <option key={val} value={val}>
              {val.padStart(2, "0")}
            </option>
          );
        })}
      </select>

      {/* AM/PM Dropdown */}
      <select
        value={ampm}
        onChange={(e) => setAmpm(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePicker;