import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  type GetTreinoDetalhado201,
  type GetAlunosTreino201AlunosItem,
} from "@/app/_lib/api/fetch-generated";

const CORES = [
  "hsl(0 72% 51%)",
  "hsl(220 70% 50%)",
  "hsl(260 60% 55%)",
  "hsl(38 92% 50%)",
  "hsl(160 84% 39%)",
];

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );
  return [f(0), f(8), f(4)];
}

function parseHsl(hslStr: string): [number, number, number] {
  const m = hslStr.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
  if (!m) return [220, 38, 38];
  return hslToRgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

export function gerarPDFTreino(
  treinoDetalhado: GetTreinoDetalhado201,
  alunosTreino: GetAlunosTreino201AlunosItem[],
  treinoIndex: number,
  nomeAluno?: string
) {
  if (treinoDetalhado.exercicios.length === 0) {
    return { erro: "Adicione exercícios antes de exportar." };
  }

  const cor = CORES[treinoIndex % CORES.length];
  const accent = parseHsl(cor);
  const accentDark: [number, number, number] = [
    Math.round(accent[0] * 0.55),
    Math.round(accent[1] * 0.55),
    Math.round(accent[2] * 0.55),
  ];

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ===== HERO HEADER =====
  const heroH = 46;
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pageWidth, heroH, "F");
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.triangle(pageWidth - 70, 0, pageWidth, 0, pageWidth, heroH, "F");
  doc.setFillColor(accentDark[0], accentDark[1], accentDark[2]);
  doc.triangle(pageWidth - 95, 0, pageWidth - 70, 0, pageWidth - 50, heroH, "F");
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, heroH, pageWidth, 1.5, "F");

  // Brand mark
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.circle(margin + 4, 14, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FICHA DE TREINO", margin + 11, 15);

  // Título do treino
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(
    treinoDetalhado.nome.toUpperCase(),
    pageWidth - margin * 2 - 50
  );
  doc.text(titleLines, margin, 28);

  // Data
  const dateStr = new Date().toLocaleDateString("pt-BR");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("EMITIDO EM", pageWidth - margin, 12, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(dateStr, pageWidth - margin, 19, { align: "right" });

  // ===== INFO STRIP =====
  const stripY = heroH + 8;
  const totalSeries = treinoDetalhado.exercicios.reduce(
    (s, ex) => s + ex.series,
    0
  );
  

  const cards: { label: string; value: string }[] = [
    { label: "ALUNO", value: nomeAluno ?? "—" },
    { label: "EXERCÍCIOS", value: String(treinoDetalhado.exercicios.length) },
    { label: "SÉRIES", value: String(totalSeries) },
  ];

  const cardGap = 3;
  const cardW =
    (pageWidth - margin * 2 - cardGap * (cards.length - 1)) / cards.length;
  const cardH = 18;

  cards.forEach((c, i) => {
    const x = margin + i * (cardW + cardGap);
    doc.setFillColor(248, 248, 250);
    doc.setDrawColor(232, 232, 236);
    doc.roundedRect(x, stripY, cardW, cardH, 1.8, 1.8, "FD");
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(x, stripY, 1.2, cardH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 140);
    doc.text(c.label, x + 4, stripY + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(25, 25, 30);
    const val = doc.splitTextToSize(c.value, cardW - 6)[0];
    doc.text(val, x + 4, stripY + 13.5);
  });

  // ===== SECTION HEADER =====
  const sectionY = stripY + cardH + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(25, 25, 30);
  doc.text("PLANO DE EXECUÇÃO", margin, sectionY);
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.6);
  doc.line(margin, sectionY + 1.5, margin + 38, sectionY + 1.5);
  doc.setLineWidth(0.2);


  // ===== TABELA DE EXERCÍCIOS =====
  autoTable(doc, {
    startY: sectionY + 5,
    head: [["#", "EXERCÍCIO", "SÉRIES", "REPETIÇÕES", "CARGA", "ANOTAÇÕES"]],
    body: treinoDetalhado.exercicios.map((ex, i) => [
      String(i + 1).padStart(2, "0"),
      ex.nomeTreino.nome,
      String(ex.series),
      ex.repeticoes,
      ex.carga ?? "—",
      "",
    ]),
    theme: "plain",
    margin: { left: margin, right: margin },
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
      textColor: [40, 40, 45],
      lineColor: [235, 235, 240],
      lineWidth: 0.15,
      valign: "middle",
    },
    headStyles: {
      fillColor: [22, 22, 26],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center", fontStyle: "bold", textColor: accent },
      1: { cellWidth: 55, fontStyle: "bold" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 25, halign: "center", fontStyle: "bold" },
      5: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: [250, 250, 252] },
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        doc.setFillColor(accent[0], accent[1], accent[2]);
        doc.rect(data.cell.x, data.cell.y + 1.5, 0.8, data.cell.height - 3, "F");
      }
    },
  });

  const finalY =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;

  // ===== OBSERVAÇÕES =====
  if (finalY < pageHeight - 50) {
    doc.setFillColor(248, 248, 250);
    doc.setDrawColor(232, 232, 236);
    doc.roundedRect(margin, finalY, pageWidth - margin * 2, 32, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("OBSERVAÇÕES DO PROFISSIONAL", margin + 4, finalY + 6);
    doc.setDrawColor(220, 220, 225);
    for (let i = 0; i < 3; i++) {
      const y = finalY + 13 + i * 6;
      doc.line(margin + 4, y, pageWidth - margin - 4, y);
    }
  }

  // ===== FOOTER =====
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
  doc.setLineWidth(0.2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 70);
  doc.text("ASSINATURA DO PROFISSIONAL", margin, pageHeight - 9);
  doc.text("ASSINATURA DO ALUNO", pageWidth / 2 + 10, pageHeight - 9);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 150);
  doc.text(
    "Execute cada movimento com técnica correta. Em caso de desconforto, interrompa e procure orientação.",
    pageWidth / 2,
    pageHeight - 4,
    { align: "center" }
  );

  const safeName = treinoDetalhado.nome.replace(/[^a-zA-Z0-9]+/g, "_");
  doc.save(`treino_${safeName}.pdf`);

  return { erro: null };
}