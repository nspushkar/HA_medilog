"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (value) {
      const [time, ampm] = value.split(" ");
      const [h, m] = time.split(":").map(Number);
      setHours(h === 0 ? 12 : h > 12 ? h - 12 : h);
      setMinutes(m);
      setPeriod(ampm as "AM" | "PM");
    }
  }, [value]);

  const updateTime = (newHours: number, newMinutes: number, newPeriod: "AM" | "PM") => {
    let hour24 = newHours;
    if (newPeriod === "PM" && newHours !== 12) hour24 += 12;
    if (newPeriod === "AM" && newHours === 12) hour24 = 0;
    
    const timeString = `${hour24.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    onChange(timeString);
  };

  const scrollHours = (direction: "up" | "down") => {
    let newHours = hours;
    if (direction === "up") {
      newHours = hours === 12 ? 1 : hours + 1;
    } else {
      newHours = hours === 1 ? 12 : hours - 1;
    }
    setHours(newHours);
    updateTime(newHours, minutes, period);
  };

  const scrollMinutes = (direction: "up" | "down") => {
    let newMinutes = minutes;
    if (direction === "up") {
      newMinutes = minutes === 59 ? 0 : minutes + 1;
    } else {
      newMinutes = minutes === 0 ? 59 : minutes - 1;
    }
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
    updateTime(hours, minutes, newPeriod);
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {/* Hours */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => scrollHours("up")}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronUp className="h-4 w-4 text-gray-500" />
        </button>
        <div className="w-16 h-12 flex items-center justify-center text-2xl font-semibold text-gray-900 bg-gray-50 rounded-lg border">
          {hours.toString().padStart(2, "0")}
        </div>
        <button
          onClick={() => scrollHours("down")}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Separator */}
      <div className="text-2xl font-semibold text-gray-400">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => scrollMinutes("up")}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronUp className="h-4 w-4 text-gray-500" />
        </button>
        <div className="w-16 h-12 flex items-center justify-center text-2xl font-semibold text-gray-900 bg-gray-50 rounded-lg border">
          {minutes.toString().padStart(2, "0")}
        </div>
        <button
          onClick={() => scrollMinutes("down")}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* AM/PM */}
      <div className="flex flex-col items-center">
        <button
          onClick={togglePeriod}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronUp className="h-4 w-4 text-gray-500" />
        </button>
        <div className="w-12 h-12 flex items-center justify-center text-lg font-semibold text-gray-900 bg-gray-50 rounded-lg border">
          {period}
        </div>
        <button
          onClick={togglePeriod}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
} 