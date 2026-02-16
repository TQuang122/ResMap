import type { jsPDF } from 'jspdf';
import type { PlagiarismResponse } from '../../types/plagiarism';
import { buildPdfViewModel } from './plagiarismPdfViewModel';
import { formatDateVi, similarityLabel } from './format';
import { ensureVietnameseFont, FONT_FAMILY } from './fonts';

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

const addSectionTitle = (doc: jsPDF, text: string, x: number, y: number): number => {
  doc.setFontSize(13);
  doc.setFont(FONT_FAMILY, 'bold');
  doc.setTextColor(25, 25, 25);
  doc.text(text, x, y);
  return y + 4;
};

const addHeaderFooter = (
  doc: jsPDF,
  reportId: string,
  generatedAt: string,
  marginX: number,
  marginTop: number,
  marginBottom: number
): void => {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);

    doc.setDrawColor(230, 230, 230);
    doc.line(marginX, marginTop - 4, pageWidth - marginX, marginTop - 4);

    doc.setFont(FONT_FAMILY, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('ResMap Similarity Report', marginX, marginTop - 7);
    doc.setFont(FONT_FAMILY, 'normal');
    doc.text(reportId, pageWidth - marginX, marginTop - 7, { align: 'right' });

    doc.setDrawColor(230, 230, 230);
    doc.line(marginX, pageHeight - marginBottom + 2, pageWidth - marginX, pageHeight - marginBottom + 2);

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${generatedAt}`, marginX, pageHeight - marginBottom + 6);
    doc.text(`Page ${page}/${totalPages}`, pageWidth - marginX, pageHeight - marginBottom + 6, {
      align: 'right',
    });
  }
};

export const exportPlagiarismPdfV2 = async (result: PlagiarismResponse): Promise<void> => {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  await ensureVietnameseFont(doc);

  const evidenceLimit = result.total_sentences > 120 ? 8 : 10;
  const vm = buildPdfViewModel(result, { evidenceLimit });
  const marginX = 16;
  const marginTop = 14;
  const marginBottom = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  const generatedDate = new Date();
  const generatedAt = formatDateVi(generatedDate);
  const reportId = `RM-${generatedDate.getTime()}`;

  let y = marginTop + 4;

  doc.setFillColor(243, 111, 33);
  doc.rect(marginX, y, pageWidth - marginX * 2, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(FONT_FAMILY, 'bold');
  doc.setFontSize(16);
  doc.text('ResMap Similarity Report', marginX + 4, y + 7);
  doc.setFont(FONT_FAMILY, 'normal');
  doc.setFontSize(10);
  doc.text('Generated for educational use', marginX + 4, y + 13);
  doc.setFont(FONT_FAMILY, 'bold');
  doc.text(`${vm.summary.overallScore}% - ${similarityLabel(vm.summary.overallScore)}`, pageWidth - marginX - 4, y + 10, {
    align: 'right',
  });
  y += 26;

  y = addSectionTitle(doc, 'Section B - Executive Summary', marginX, y);
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { font: FONT_FAMILY, fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [243, 111, 33] },
    body: [
      ['Overall Similarity', `${vm.summary.overallScore}%`],
      ['Plagiarism Percentage', `${vm.summary.plagiarismPercentage}%`],
      ['Matched Sentences', `${vm.summary.matchedSentences}`],
      ['Total Sentences', `${vm.summary.totalSentences}`],
      ['Distinct Sources', `${vm.summary.distinctSources}`],
      ['AI-writing likelihood', vm.summary.aiDetectionText ?? 'N/A'],
    ],
  });
  y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 5;

  doc.setFont(FONT_FAMILY, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text('- Similarity score supports review, not a final misconduct verdict.', marginX, y);
  y += 4;
  doc.text('- Interpret matches with academic context and citation standards.', marginX, y);
  y += 8;

  y = addSectionTitle(doc, 'Section C - Citation Breakdown', marginX, y);
  if (vm.citationRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      theme: 'striped',
      styles: { font: FONT_FAMILY, fontSize: 9, cellPadding: 2, valign: 'top' },
      headStyles: { fillColor: [37, 99, 235] },
      head: [['Group', 'Count', 'Percentage', 'Samples']],
      body: vm.citationRows.map((row) => [row.group, `${row.count}`, row.percentage, row.samples]),
    });
    y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 8;
  } else {
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('No citation groups available.', marginX, y + 4);
    y += 10;
  }

  y = addSectionTitle(doc, 'Section D - Source Contribution Table', marginX, y);
  if (vm.sourceRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      styles: { font: FONT_FAMILY, fontSize: 8.5, cellPadding: 2, valign: 'top' },
      headStyles: { fillColor: [22, 163, 74] },
      head: [['Source #', 'Domain', 'Type', 'Spans', 'Avg Similarity', 'Contribution']],
      body: vm.sourceRows.map((row) => [
        row.sourceId,
        row.domain,
        row.sourceType,
        `${row.spanCount}`,
        `${row.avgSimilarity}%`,
        `${row.contribution}%`,
      ]),
    });
    y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 8;
  } else {
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('No retained source groups.', marginX, y + 4);
    y += 10;
  }

  y = addSectionTitle(doc, 'Section E - Top Evidence', marginX, y);
  if (vm.evidenceRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      styles: { font: FONT_FAMILY, fontSize: 8, cellPadding: 2, valign: 'top' },
      headStyles: { fillColor: [124, 58, 237] },
      head: [['Sentence', 'Source', 'Similarity', 'Type', 'Confidence', 'Passage']],
      body: vm.evidenceRows.map((row) => [
        row.sentence,
        row.source,
        `${row.similarity}%`,
        row.matchType,
        row.confidence,
        row.passageSnippet,
      ]),
    });
    y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 8;
  } else {
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('No evidence rows available.', marginX, y + 4);
    y += 10;
  }

  y = addSectionTitle(doc, 'Section F - Caveats & Method', marginX, y);
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    styles: { font: FONT_FAMILY, fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [71, 85, 105] },
    head: [['Field', 'Value']],
    body: vm.methodRows,
  });
  y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 6;

  if (vm.caveatRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      styles: { font: FONT_FAMILY, fontSize: 8.5, cellPadding: 2 },
      headStyles: { fillColor: [220, 38, 38] },
      head: [['Caveats']],
      body: vm.caveatRows.map((item) => [item]),
    });
    y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 6;
  }

  if (vm.warnings.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      styles: { font: FONT_FAMILY, fontSize: 8.5, cellPadding: 2 },
      headStyles: { fillColor: [217, 119, 6] },
      head: [['PDF Warnings']],
      body: vm.warnings.map((item) => [item]),
    });
    y = ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y) + 6;
  }

  const appendixRows = vm.sourceRows
    .filter((row) => row.sourceUrl.length > 70)
    .map((row) => [row.sourceId, row.sourceUrl]);

  if (appendixRows.length > 0) {
    doc.addPage();
    y = marginTop + 4;
    y = addSectionTitle(doc, 'Section G - Appendix (Full Source URLs)', marginX, y);
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      styles: { font: FONT_FAMILY, fontSize: 8.5, cellPadding: 2 },
      headStyles: { fillColor: [2, 132, 199] },
      head: [['Source #', 'URL']],
      body: appendixRows,
    });
  }

  addHeaderFooter(doc, reportId, generatedAt, marginX, marginTop, marginBottom);
  doc.save(`ResMap_Similarity_Report_${reportId}.pdf`);
};
