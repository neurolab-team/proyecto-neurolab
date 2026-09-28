"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestPreview, { TestPreviewData } from '@/components/TestPreview';
import InformedConsentModal, {
  ConsentOptionalAuthorizations,
} from '@/components/modal/consent/InformedConsentModal';
import { useTestData } from '../_hooks/useTestData';
import { assignmentService } from '@/services/assignment/assignment';
import { notify } from '@/libs/toastService';
import { getApiErrorMessage } from '@/libs/getApiErrorMessage';
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

  const {
    questions,
    title,
    description,
    testCode,
    consentStatus,
    requiresConsent,
    isLoading,
    error,
  } = useTestData(assignmentId);

  // Sobrescribe el valor que vino del servidor en cuanto el usuario decide,
  // para no depender de un refetch para reflejar su elección.
  const [consentOverride, setConsentOverride] = useState<'accepted' | 'declined' | null>(null);
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  // Permite reabrir el modal cuando el usuario rechazó y cambia de opinión.
  const [isReviewingConsent, setIsReviewingConsent] = useState(false);

  // Las pruebas que no pertenecen a un estudio no piden consentimiento.
  const effectiveConsentStatus = requiresConsent
    ? consentOverride ?? consentStatus
    : 'accepted';
  const isConsentModalOpen =
    requiresConsent && (effectiveConsentStatus == null || isReviewingConsent);

  const handleConsentDecision = async (
    accepted: boolean,
    authorizations?: ConsentOptionalAuthorizations,
  ) => {
    setIsSubmittingConsent(true);
    try {
      await assignmentService.submitConsent(assignmentId, {
        accepted,
        ...authorizations,
      });
      setConsentOverride(accepted ? 'accepted' : 'declined');
      setIsReviewingConsent(false);
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        'No se pudo registrar tu decisión. Intenta de nuevo.',
      );
      notify.error(Array.isArray(message) ? message.join(' ') : message);
    } finally {
      setIsSubmittingConsent(false);
    }
  };

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
    category: 'ESCALA',
    title: title || 'Vista previa de la prueba',
    description:
      description ??
      'Lee con atención las instrucciones antes de comenzar. No hay respuestas correctas ni incorrectas.',
    metadata,
    steps: PREVIEW_STEPS,
    assignmentId,
    consentStatus: effectiveConsentStatus,
    onReviewConsent: () => setIsReviewingConsent(true),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <TestPreview data={data} />
      </main>
      <Footer />
      <InformedConsentModal
        isOpen={!isLoading && !error && isConsentModalOpen}
        isSubmitting={isSubmittingConsent}
        onAccept={(authorizations) => handleConsentDecision(true, authorizations)}
        onDecline={() => handleConsentDecision(false)}
      />
    </div>
  );
}
