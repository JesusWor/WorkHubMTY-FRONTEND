"use client";
import { useState } from "react";
export default function HourSelect() {
  const [startHour, setStartHour] = useState("00:00");
  const [endHour, setEndHour] = useState("00:00");
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div className="bg-container flex-1 flex px-4 py-4 flex-col gap-4">
      {/* <span className="text-lg font-bold self-start">Selecciona una hora</span> */}
      <svg id="clock" className="flex-1 w-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="100"
          fill="var(--color-container-on-container)"
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerMove={(e) => {
            if (isDragging) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - 100;
              const y = e.clientY - rect.top - 70;
              const angle = Math.atan2(y, x);
              const hours = (angle / (2 * Math.PI)) * 12 + 3;
            }
          }}
        />
        <path
          d="
    M 100,100
    L 100,0
    A 100,100 90
    Z
  "
          fill="tomato"
        />
      </svg>
      <div className="flex flex-1 gap-2 items-center">
        <div className="w-full self-center flex flex-row gap-4 items-center justify-center">
          <input
            type="time"
            step={900}
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="bg-container-on-container px-2 py-1"
          />
          -
          <input
            type="time"
            step={900}
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            className="bg-container-on-container px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
}
