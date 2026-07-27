"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Lightbulb } from 'lucide-react';
const TestCompletedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-4">
            ¡Test Completado!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Tus respuestas han sido enviadas exitosamente.
            Un psicólogo revisará tus resultados y te notificará pronto.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
                <Lightbulb className="inline w-4 h-4" /> <strong>Tip:</strong> Puedes ver el estado de tus pruebas asignados en tu panel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                router.push("/panel/assignmentTest");
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-dark to-primary-light shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
            >
              Ver Mis Tests
            </button>
            <button
              onClick={() => {
                router.push("/");
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-primary-dark bg-white border-2 border-primary-dark/20 shadow-sm hover:bg-slate-50 hover:border-primary-dark/40 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
            >
              Ir al Inicio
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TestCompletedPage;
