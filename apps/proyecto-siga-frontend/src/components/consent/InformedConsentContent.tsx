import {
  INFORMED_CONSENT_INTRO,
  INFORMED_CONSENT_SECTIONS,
} from "../../libs/informedConsent";

/**
 * Cuerpo del consentimiento informado (intro + secciones). Lo comparten el
 * modal del test preview y la página pública `/informed-consent`, así ambos
 * muestran siempre el mismo texto.
 */
export default function InformedConsentContent() {
  return (
    <>
      {INFORMED_CONSENT_INTRO.map((paragraph, i) => (
        <p key={`p-${i}`}>{paragraph}</p>
      ))}

      {INFORMED_CONSENT_SECTIONS.map((section) => (
        <section key={section.title}>
          <p className="mb-2 font-semibold text-gray-800">{section.title}</p>
          {section.lead && <p className="mb-2">{section.lead}</p>}
          {section.items && (
            <ul className="list-disc pl-5 flex flex-col gap-1">
              {section.items.map((item, i) => (
                <li key={`${section.title}-i-${i}`}>{item}</li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((paragraph, i) => (
            <p key={`${section.title}-p-${i}`} className="mt-2">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}
