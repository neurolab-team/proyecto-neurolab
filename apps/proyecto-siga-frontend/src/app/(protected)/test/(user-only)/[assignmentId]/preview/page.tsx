"use client";
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestPreview, { TestPreviewData } from '@/components/TestPreview';
import { useTestData } from '../_hooks/useTestData';
import {
  getTestPreviewMetadata,
  buildTestPreviewMetadataItems,
} from '@/components/testPreview/testPreviewPresentation';

const PREVIEW_STEPS = [
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

export default function TestPreviewPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId ?? '';

  const { questions, title, description, testCode, isLoading, error } =
    useTestData(assignmentId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center">
          <div className="text-xl font-semibold text-[#102D69]">Cargando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center">
          <p className="text-red-500 font-semibold">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const presentation = getTestPreviewMetadata(testCode);
  const metadata = buildTestPreviewMetadataItems(presentation, questions.length);

  const data: TestPreviewData = {
    category: 'ESCALA CLÍNICA',
    title: title || 'Vista previa de la prueba',
    description:
      description ??
      'Lee con atención las instrucciones antes de comenzar. No hay respuestas correctas ni incorrectas.',
    metadata,
    steps: PREVIEW_STEPS,
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
