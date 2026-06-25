'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  List,
  Clock,
  Calendar,
  Shield,
  Leaf,
  LucideIcon,
} from 'lucide-react';

export interface TestPreviewMetadata {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface TestPreviewStep {
  title: string;
  description: string;
}

export interface TestPreviewData {
  category: string;
  title: string;
  description: string;
  metadata: TestPreviewMetadata[];
  steps: TestPreviewStep[];
  assignmentId: string;
}

const defaultMetadata: TestPreviewMetadata[] = [
  { icon: List, value: '—', label: 'preguntas' },
  { icon: Clock, value: '—', label: 'duración' },
  { icon: Calendar, value: '—', label: 'fecha límite' },
];

const defaultSteps: TestPreviewStep[] = [
  {
    title: 'Lee cada situación con calma.',
    description: 'Piensa en cómo te has sentido recientemente, no solo en este instante.',
  },
  {
    title: 'Elige la opción que mejor te describa.',
    description: 'Si nunca has estado en esa situación, imagina cómo reaccionarías.',
  },
  {
    title: 'Puedes pausar y volver.',
    description: 'Tus respuestas se guardan automáticamente. Vuelve cuando quieras.',
  },
];

export default function TestPreview({ data }: { data: TestPreviewData }) {
  const metadata = data.metadata.length > 0 ? data.metadata : defaultMetadata;
  const steps = data.steps.length > 0 ? data.steps : defaultSteps;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back nav */}
      <nav aria-label="Navegación">
        <Link
          href="/panel/assignmentTest"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis pruebas
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Header */}
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              {data.category}
            </p>
            <h1 className="mb-4 text-3xl font-bold text-[#102D69] md:text-4xl">
              {data.title}
            </h1>
            <p className="max-w-xl text-base text-gray-600">
              {data.description}
            </p>
          </header>

          {/* Instructions Card */}
          <section
            aria-labelledby="instructions-heading"
            className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100"
          >
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {metadata.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-[#102D69]" />
                  <div>
                    <p className="text-lg font-semibold text-[#102D69]">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-6 border-dashed border-gray-200" />

            {/* Steps */}
            <h2 id="instructions-heading" className="mb-4 text-sm font-semibold text-[#102D69]">
              Cómo responder
            </h2>
            <ol className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-[#102D69]"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <hr className="my-6 border-dashed border-gray-200" />

            {/* CTA */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={`/test/${data.assignmentId}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#102D69] to-[#00A0B7] px-7 py-3 text-sm font-bold text-white hover:shadow-lg transition-all duration-300"
              >
                Comenzar prueba
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs text-gray-400">
                Al comenzar aceptas el{' '}
                <span className="text-gray-600 underline">manejo confidencial</span>{' '}
                de tus respuestas.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="flex flex-col gap-6">
          {/* Confidentiality Card */}
          <div className="rounded-xl bg-blue-50/60 p-6">
            <Shield className="mb-3 h-5 w-5 text-[#102D69]" />
            <p className="mb-1 font-semibold text-gray-800">Confidencialidad</p>
            <p className="text-sm text-gray-600">
              Solo el equipo de psicología de Permanencia tiene acceso a tus respuestas. Tus profesores y compañeros no verán nada.
            </p>
          </div>

          {/* Crisis Card */}
          <div className="rounded-xl bg-amber-50/60 p-6">
            <Leaf className="mb-3 h-5 w-5 text-amber-700" />
            <p className="mb-1 font-semibold text-gray-800">¿Te sientes en crisis ahora?</p>
            <p className="text-sm text-gray-600">
              Si necesitas hablar con alguien de inmediato, contacta a la{' '}
              <span className="text-gray-800 underline">línea de apoyo psicológico ITM</span>. Disponible 24/7.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
