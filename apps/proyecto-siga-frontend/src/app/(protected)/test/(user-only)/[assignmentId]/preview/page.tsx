"use client";
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestPreview, { TestPreviewData } from '@/components/TestPreview';
import { List, Clock, Sun, Calendar } from 'lucide-react';

export default function TestPreviewPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId ?? '';

  // TODO: Fetch real test data from API based on assignmentId
  const data: TestPreviewData = {
    category: 'ESCALA CLÍNICA',
    title: 'Vista previa de la prueba',
    description:
      'Lee con atención las instrucciones antes de comenzar. No hay respuestas correctas ni incorrectas.',
    metadata: [
      { icon: List, value: '—', label: 'preguntas' },
      { icon: Clock, value: '~5 min', label: 'duración' },
      { icon: Sun, value: '—', label: 'por pregunta' },
      { icon: Calendar, value: '—', label: 'fecha límite' },
    ],
    steps: [
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
    ],
    author: {
      name: 'Equipo de Bienestar',
      institution: 'ITM - Institución Universitaria',
    },
    assignmentId,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <TestPreview data={data} />
      </main>
      <Footer />
    </div>
  );
}
