import { PsychologistStudentResultExportRow } from "@packages/common-types/psychologist.types";

type ExportColumn = {
  header: string;
  width: number;
  value: (row: PsychologistStudentResultExportRow) => string | number | null;
};

// Una fila por respuesta: los datos del estudiante y de la prueba se repiten
// en cada pregunta.
const columns: ExportColumn[] = [
  { header: "Cédula", width: 16, value: (row) => row.studentCode },
  { header: "Correo", width: 32, value: (row) => row.studentEmail },
  { header: "Semestre", width: 10, value: (row) => row.semester },
  { header: "Prueba", width: 34, value: (row) => row.testTitle },
  { header: "Puntaje total de la prueba", width: 16, value: (row) => row.totalScore },
  { header: "Interpretación del resultado", width: 50, value: (row) => row.interpretation },
  { header: "Código de la pregunta", width: 16, value: (row) => row.questionCode },
  { header: "Pregunta", width: 60, value: (row) => row.questionPrompt },
  { header: "Respuesta seleccionada", width: 32, value: (row) => row.questionOptionLabel },
  { header: "Valor de la respuesta", width: 16, value: (row) => row.questionOptionValue },
  { header: "Respuesta escrita", width: 28, value: (row) => row.questionTextValue },
  { header: "Puntaje de la respuesta", width: 16, value: (row) => row.questionScoreValue },
];

const MAX_ROWS_PER_SHEET = 1_000_000;

const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function createResultsXlsx(
  rows: PsychologistStudentResultExportRow[],
): Promise<Blob> {
  // Carga diferida: exceljs solo se descarga cuando el usuario exporta.
  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();

  // Excel admite 1.048.576 filas por hoja; si se supera, se reparte en varias.
  for (let start = 0; start === 0 || start < rows.length; start += MAX_ROWS_PER_SHEET) {
    const sheetNumber = start / MAX_ROWS_PER_SHEET + 1;
    const sheet = workbook.addWorksheet(
      sheetNumber === 1 ? "Resultados" : `Resultados ${sheetNumber}`,
      { views: [{ state: "frozen", ySplit: 1 }] },
    );

    sheet.columns = columns.map((column) => ({
      header: column.header,
      width: column.width,
    }));
    sheet.getRow(1).font = { bold: true };
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length },
    };

    rows.slice(start, start + MAX_ROWS_PER_SHEET).forEach((row) => {
      sheet.addRow(columns.map((column) => column.value(row)));
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: XLSX_MIME_TYPE });
}
