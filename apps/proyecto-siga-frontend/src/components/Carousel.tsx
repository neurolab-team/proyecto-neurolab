"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/img/slide1.jpg",
  "/img/slide1.jpg",
  "/img/slide1.jpg",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () =>
    setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));

  const next = () =>
    setCurrent((p) => (p + 1) % images.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Slide ${i + 1}`}
            className="w-full h-[340px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#001d4e] rounded-full p-2 shadow transition-all hover:shadow-md"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Siguiente slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#001d4e] rounded-full p-2 shadow transition-all hover:shadow-md"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              current === i
                ? "w-6 h-2 bg-[#1E5FA8]"
                : "w-2 h-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
