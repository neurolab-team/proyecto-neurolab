/**
 * Referencias bibliográficas de cada prueba mostradas en la vista previa
 * (TestPreview), keyed por `testCode` igual que `testPreviewPresentation.ts`.
 * - `validation`: versión adaptada/validada que se aplica (p. ej. la colombiana).
 * - `original`: instrumento original en el que se basa.
 * - `authorization`: autorización de uso del instrumento.
 * `label` permite sobrescribir el rótulo por defecto del tipo.
 * Una prueba sin entrada aquí simplemente no muestra la sección de referencias.
 */

export type TestReferenceKind = 'validation' | 'original' | 'authorization';

export type TestReferenceItem = {
  kind: TestReferenceKind;
  label?: string;
  note?: string;
  citation: string;
  doi?: string;
  /** Enlace directo cuando la referencia no tiene DOI. */
  url?: string;
};

export type TestReferences = {
  summary?: string;
  items: TestReferenceItem[];
};

export const REFERENCE_KIND_LABEL: Record<TestReferenceKind, string> = {
  validation: 'Versión validada',
  original: 'Instrumento original',
  authorization: 'Autorización de uso',
};

const REFERENCES_BY_TEST_CODE: Record<string, TestReferences> = {
  PSQI: {
    items: [
      {
        kind: 'original',
        citation:
          'Buysse, D. J., Reynolds, C. F., 3rd, Monk, T. H., Berman, S. R., & Kupfer, D. J. (1989). The Pittsburgh Sleep Quality Index: A new instrument for psychiatric practice and research. Psychiatry Research, 28(2), 193–213.',
        doi: '10.1016/0165-1781(89)90047-4',
      },
      {
        kind: 'validation',
        label: 'Versión utilizada – Validación colombiana',
        citation:
          'Escobar-Córdoba, F., & Eslava-Schmalbach, J. (2005). Validación colombiana del índice de calidad de sueño de Pittsburgh [Colombian validation of the Pittsburgh Sleep Quality Index]. Revista de Neurología, 40(3), 150–155.',
      },
      {
        kind: 'authorization',
        citation: 'Uso autorizado por la University of Pittsburgh.',
      },
    ],
  },
  MUNICH: {
    items: [
      {
        kind: 'original',
        label: 'Referencia',
        citation:
          'Roenneberg, T., Wirz-Justice, A., & Merrow, M. (2003). Life between clocks: Daily temporal patterns of human chronotypes. Journal of Biological Rhythms, 18(1), 80–90.',
        doi: '10.1177/0748730402239679',
      },
      {
        kind: 'authorization',
        citation:
          'Uso autorizado por el Prof. Dr. Till Roenneberg, Chronsulting. La autorización se basa en el correo recibido: “Permission granted.”',
      },
    ],
  },
  EPWORTH: {
    items: [
      {
        kind: 'original',
        citation:
          'Johns, M. W. (1991). A new method for measuring daytime sleepiness: The Epworth Sleepiness Scale. Sleep, 14(6), 540–545.',
        doi: '10.1093/sleep/14.6.540',
      },
      {
        kind: 'validation',
        label: 'Validación colombiana',
        citation:
          'Chica-Urzola, H. L., Escobar-Córdoba, F., & Eslava-Schmalbach, J. (2007). Validación de la Escala de Somnolencia de Epworth. Revista de Salud Pública, 9(4), 558–567.',
        url: 'https://www.redalyc.org/articulo.oa?id=42219060008',
      },
    ],
  },
};

export function getTestReferences(testCode: string): TestReferences | null {
  return REFERENCES_BY_TEST_CODE[testCode.toUpperCase()] ?? null;
}
