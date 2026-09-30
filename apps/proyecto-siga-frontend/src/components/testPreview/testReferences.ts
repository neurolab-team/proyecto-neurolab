/**
 * Referencias bibliográficas de cada prueba mostradas en la vista previa
 * (TestPreview), keyed por `testCode` igual que `testPreviewPresentation.ts`.
 * - `validation`: versión adaptada/validada que se aplica (p. ej. la colombiana).
 * - `original`: instrumento original en el que se basa.
 * Una prueba sin entrada aquí simplemente no muestra la sección de referencias.
 */

export type TestReferenceKind = 'validation' | 'original';

export type TestReferenceItem = {
  kind: TestReferenceKind;
  note?: string;
  citation: string;
  doi?: string;
};

export type TestReferences = {
  summary?: string;
  items: TestReferenceItem[];
};

export const REFERENCE_KIND_LABEL: Record<TestReferenceKind, string> = {
  validation: 'Versión validada',
  original: 'Instrumento original',
};

const REFERENCES_BY_TEST_CODE: Record<string, TestReferences> = {
  PSQI: {
    summary: 'Versión colombiana validada por Escobar-Córdoba y Eslava-Schmalbach.',
    items: [
      {
        kind: 'validation',
        citation:
          'Escobar-Córdoba, F., & Eslava-Schmalbach, J. (2005). Validación colombiana del índice de calidad de sueño de Pittsburgh. Revista de Neurología, 40(3), 150–155.',
        doi: '10.33588/rn.4003.2004320',
      },
      {
        kind: 'original',
        note: 'Basado en el Pittsburgh Sleep Quality Index (PSQI) desarrollado por Buysse et al.',
        citation:
          'Buysse, D. J., Reynolds, C. F., Monk, T. H., Berman, S. R., & Kupfer, D. J. (1989). The Pittsburgh Sleep Quality Index (PSQI): A new instrument for psychiatric research and practice. Psychiatry Research, 28(2), 193–213.',
      },
    ],
  },
};

export function getTestReferences(testCode: string): TestReferences | null {
  return REFERENCES_BY_TEST_CODE[testCode.toUpperCase()] ?? null;
}
