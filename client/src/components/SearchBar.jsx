import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const locations = [
  "Mumbai",
  "Delhi",
  "Goa",
  "Bangalore",
  "Pune",
  "Jaipur",
  "Kerala",
];

export default function SearchBar({ onSearch }) {
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [open, setOpen] = useState(null);

  const ref = useRef();

  const totalGuests = adults + children;

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // DEBOUNCED SEARCH (optional auto-search)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (where || checkIn || checkOut || totalGuests > 0) {
        onSearch({
          where,
          checkIn,
          checkOut,
          guests: totalGuests,
        });
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [where, checkIn, checkOut, adults, children]);

  const handleSearch = () => {
    onSearch({
      where,
      checkIn,
      checkOut,
      guests: totalGuests,
    });
  };

  return (
    <div
      ref={ref}
      className="bg-white rounded-full shadow-xl flex items-center p-2 w-full max-w-4xl mx-auto relative"
    >
      {/* WHERE */}
      <div
        onClick={() => setOpen("where")}
        className="flex-1 px-4 py-2 cursor-pointer relative"
      >
        <p className="text-xs font-semibold">Where</p>
        <p className="text-sm text-gray-500">
          {where || "Search destinations"}
        </p>

        <AnimatePresence>
          {open === "where" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-16 left-0 bg-white shadow-xl rounded-2xl w-72 z-30 overflow-hidden"
            >
              {locations
                .filter((l) =>
                  l.toLowerCase().includes(where.toLowerCase())
                )
                .map((loc) => (
                  <div
                    key={loc}
                    onClick={() => {
                      setWhere(loc);
                      setOpen(null);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <MapPin size={16} />
                    {loc}
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-px h-10 bg-gray-200"></div>

      {/* WHEN */}
      <div
        onClick={() => setOpen("when")}
        className="flex-1 px-4 py-2 cursor-pointer relative"
      >
        <p className="text-xs font-semibold">When</p>
        <p className="text-sm text-gray-500">
          {checkIn && checkOut
            ? `${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`
            : "Add dates"}
        </p>

        <AnimatePresence>
          {open === "when" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-16 left-0 z-30 bg-white shadow-xl rounded-2xl p-2"
            >
              <DatePicker
                selected={checkIn}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setCheckIn(start);
                  setCheckOut(end);
                }}
                startDate={checkIn}
                endDate={checkOut}
                selectsRange
                inline
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-px h-10 bg-gray-200"></div>

      {/* WHO */}
      <div
        onClick={() => setOpen("who")}
        className="flex-1 px-4 py-2 cursor-pointer relative"
      >
        <p className="text-xs font-semibold">Who</p>
        <p className="text-sm text-gray-500">
          {totalGuests} guest{totalGuests > 1 ? "s" : ""}
        </p>

        <AnimatePresence>
          {open === "who" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-16 right-0 bg-white shadow-xl rounded-2xl w-72 p-4 z-30"
            >
              {/* Adults */}
              <div className="flex justify-between items-center mb-4">
                <span>Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex justify-between items-center">
                <span>Children</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="bg-red-500 text-white p-3 rounded-full hover:scale-105 transition"
      >
        <Search size={18} />
      </button>
    </div>
  );
}