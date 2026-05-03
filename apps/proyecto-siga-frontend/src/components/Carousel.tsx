"use client";

import { useEffect, useState } from "react";

const images = [
    "/img/slide1.jpg",
    "/img/slide1.jpg",
    "/img/slide1.jpg",
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);

    // Automático
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); //5 segundos

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    return (
        <div className="relative w-full h-[300px] overflow-hidden">

            {/* CONTENEDOR DESLIZANTE */}
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`slide-${index}`}
                        className="w-full h-[300px] object-cover flex-shrink-0"
                    />
                ))}
            </div>

            {/* IZQUIERDO */}
            <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-3xl opacity-60 hover:opacity-100 transition"
            >
                ❮
            </button>

            {/* DERECHO */}
            <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-3xl opacity-60 hover:opacity-100 transition"
            >
                ❯
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 rounded-full transition-all ${current === index
                                ? "bg-white scale-110"
                                : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
