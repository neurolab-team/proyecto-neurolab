"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import {
  assignmentScoreService,
  DetailedAnswerResponse,
} from "@/services/assignmentScore/assignmentScore";

type ScoreResults = {
  assignmentId: string;
  interpretation?: string | null;
  interpretationRestricted?: boolean;
  detailedAnswersRestricted?: boolean;
  totalScore?: number;
  attentionLevel?: string;
  details?: { sections?: { sectionName: string; totalScore: number; interpretation: string; attentionLevel: string }[] };
};

const attentionColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
  none: "bg-gray-100 text-gray-600",
};

const attentionLabels: Record<string, string> = {
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
  none: "Ninguno",
};

export default function TestResultsPage() {
  const params = useParams<{ assignmentId: string }>();
  const router = useRouter();
  const assignmentId = params?.assignmentId;
  const { user, isLoading: authLoading } = useAuth();

  const [score, setScore] = useState<ScoreResults | null>(null);
  const [answers, setAnswers] = useState<DetailedAnswerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPsychologist = user?.role === "psychologist" || user?.role === "admin";
  const hideInterpretationForUser = Boolean(score?.interpretationRestricted);
  const hideDetailedAnswersForUser = Boolean(score?.detailedAnswersRestricted);
  const showRestrictedSummary = !isPsychologist && (hideInterpretationForUser || hideDetailedAnswersForUser);

  useEffect(() => {
    if (!assignmentId || typeof assignmentId !== "string" || authLoading) return;

    const fetchData = async () => {
      try {
        const scoreData = await assignmentScoreService.getResults(assignmentId);
        setScore(scoreData);

        try {
          const answersData = await assignmentScoreService.getDetailedAnswers(
            assignmentId,
          );
          setAnswers(answersData);
        } catch (detailError) {
          const status = (detailError as AxiosError)?.response?.status;
          if (status === 403) {
            setAnswers([]);
          } else {
            throw detailError;
          }
        }
      } catch {
        setError("No se pudieron cargar los resultados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => {
                router.back();
              }}
              className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:opacity-90 transition"
            >
              Volver
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Group answers by section
  const grouped = answers.reduce<Record<string, DetailedAnswerResponse[]>>(
    (acc, answer) => {
      const section = answer.question?.section?.name || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(answer);
      return acc;
    },
    {},
  );

  const sections = score?.details?.sections;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => {
                router.back();
              }}
              className="text-primary-dark hover:underline text-sm mb-4 inline-flex items-center gap-1"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-primary-dark">
              Resultados del Test
            </h1>
          </div>

          {showRestrictedSummary && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-yellow-400">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Tranquilo tus resultados están siendo revisados
              </h2>
              <p className="text-gray-800 leading-relaxed">
                {hideInterpretationForUser && hideDetailedAnswersForUser
                  ? "La interpretación y el detalle de respuestas requieren revisión profesional antes de mostrarse."
                  : hideInterpretationForUser
                    ? "La interpretación requiere revisión profesional antes de mostrarse."
                    : "El detalle de respuestas requiere revisión profesional antes de mostrarse."}
              </p>
            </div>
          )}

          {/* Interpretation Banner */}
          {score?.interpretation && !hideInterpretationForUser && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-primary-light">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Interpretación
              </h2>
              <p className="text-gray-800 leading-relaxed">
                {score.interpretation}
              </p>
            </div>
          )}

          {/* Psychologist: Score Summary */}
          {isPsychologist && score?.totalScore !== undefined && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-5">
                <p className="text-sm text-gray-500 font-medium">Puntaje Total</p>
                <p className="text-2xl font-bold text-primary-dark mt-1">
                  {score.totalScore}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5">
                <p className="text-sm text-gray-500 font-medium">Nivel de Atención</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-semibold ${attentionColors[score.attentionLevel || "none"]}`}
                >
                  {attentionLabels[score.attentionLevel || "none"]}
                </span>
              </div>
            </div>
          )}

          {/* Psychologist: Section Scores */}
          {isPsychologist && sections && sections.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Detalle por Componente
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-3 font-semibold text-gray-700">Sección</th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700">Puntaje</th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700">Nivel</th>
                      <th className="text-left py-3 px-3 font-semibold text-gray-700">Interpretación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((s) => (
                      <tr key={s.sectionName} className="border-b border-gray-100">
                        <td className="py-3 px-3 font-medium text-gray-800">{s.sectionName}</td>
                        <td className="py-3 px-3 text-gray-700">{s.totalScore}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${attentionColors[s.attentionLevel || "none"]}`}>
                            {attentionLabels[s.attentionLevel || "none"]}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600">{s.interpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Answers Table */}
          {!hideDetailedAnswersForUser && Object.keys(grouped).length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Respuestas
              </h2>
              {Object.entries(grouped).map(([sectionName, sectionAnswers]) => (
                <div key={sectionName} className="mb-6 last:mb-0">
                  <h3 className="text-base font-semibold text-primary-dark mb-3 border-b border-gray-200 pb-2">
                    {sectionName}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500">
                          <th className="py-2 px-3 font-medium">#</th>
                          <th className="py-2 px-3 font-medium">Pregunta</th>
                          <th className="py-2 px-3 font-medium">Respuesta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectionAnswers.map((answer, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-2.5 px-3 text-gray-400 w-10">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 text-gray-800">
                              {answer.question?.prompt || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-gray-700 font-medium">
                              {answer.option?.label || answer.textValue || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
