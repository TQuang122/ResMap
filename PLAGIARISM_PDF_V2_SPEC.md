# Plagiarism PDF V2 Spec (ResMap)

## 1) Muc tieu
- Tao ban PDF bao cao dao van dang nop duoc ngay cho giang vien/sinh vien, doc de, co cau truc ro rang, khong vo dau tieng Viet.
- Su dung du lieu da co tu `PlagiarismCheckResponse` + `report_v2`, khong doi API bat buoc o Phase 1.
- Dam bao xuat duoc voi van ban dai (>= 1500 ky tu) va so luong nguon lon (> 20 sources) ma khong loi trang/khong cat noi dung.

## 2) Non-goals (Phase 1)
- Khong render PDF phia backend.
- Khong them service luu file PDF len cloud.
- Khong thay doi logic scoring plagiarism hien tai.

## 3) Hien trang va khoang trong can dong

### Hien trang
- PDF dang duoc tao trong `frontend/src/components/tools/PlagiarismChecker.tsx` (`exportToPDF`).
- Dang dung `jspdf` thuan, layout 1 pass, footer hard-code (`Page 1`), gioi han danh sach nguon (`slice(0, 8)`).
- Chua co dong chu Unicode an toan cho tieng Viet (co nguy co vo dau/ky tu loi).

### Khoang trong
- Chua co TOC/section numbering ro rang.
- Chua co bang tong hop nguon theo contribution.
- Chua co Evidence section (doan match dai dien + confidence + match type).
- Chua hieu chinh caveats/metadata thanh language than thien cho nguoi dung.

## 4) Data contract mapping cho PDF V2

Nguon du lieu vao la `result: PlagiarismResponse` (frontend).

### Bat buoc
- `overall_score`: diem tong (%).
- `plagiarism_percentage`: ty le plagiarism hien thi o executive summary.
- `total_sentences`, `plagiarized_sentences`.
- `results[]`: tung cau va danh sach `sources[]`.
- `report_v2.source_groups[]`: nhom nguon + spans.
- `report_v2.match_groups[]`: phan nhom citation/quotation.
- `report_v2.caveats[]`: canh bao chat luong.
- `report_v2.metadata`: debug/exclusion/scoring context.

### Optional (neu co thi hien thi)
- `ai_detection_score`, `ai_detection_confidence`.
- `source.confidence_score`, `source.match_type`, `source.passage_matches`.

### Fallback khi thieu field
- Neu `report_v2` null: van xuat Executive + Sentence Summary + Sources from `results`.
- Neu `match_groups` rong: an section Citation Breakdown.
- Neu `source_groups` rong: an section Source Contribution va ghi chu "No retained source groups".

## 5) Cau truc PDF V2 (output contract)

Tat ca section ben duoi la bat buoc, tru khi co ghi ro optional.

### Section A - Cover + Metadata
- Tieu de: `ResMap Similarity Report`.
- Subtitle: `Generated for educational use`.
- Hien thi ngay gio local (`vi-VN`) + report id tam thoi (`RM-${timestamp}`).
- Hien thi badge muc do similarity: `No Match | Low | Moderate | High | Very High`.

### Section B - Executive Summary
- KPI cards: Overall Similarity, Matched Sentences, Total Sentences, Distinct Sources.
- Neu co AI detection: them dong `AI-writing likelihood: X% (confidence: Y)`.
- Them 2 dong disclaimer ngan:
  - similarity != ket luan dao van tuyet doi;
  - can review context hoc thuat.

### Section C - Citation Breakdown
- Input: `report_v2.match_groups`.
- Render thanh bang (columns): Group, Count, Percentage, Samples.
- Mapping label:
  - `cited_and_quoted` -> `Properly Cited & Quoted`
  - `missing_quotations` -> `Missing Quotations`
  - `missing_citation` -> `Missing Citation`
  - `not_cited_or_quoted` -> `No Citation / No Quotes`

### Section D - Source Contribution Table
- Input uu tien: `report_v2.source_groups`.
- Moi dong: Source #, Domain/URL, Type, Span Count, Avg Similarity, Estimated Contribution.
- Cong thuc `Estimated Contribution` (frontend-only, explainable):
  - `sum(span.similarity for spans of source) / sum(all span similarities) * 100`.
- Sap xep giam dan theo contribution.
- Khong hard-limit 8 nguon; phan trang tu dong.

### Section E - Top Evidence
- Lay toi da 10 evidence blocks (co the config).
- Uu tien chon theo:
  1) similarity cao,
  2) source confidence (`high > medium > low`),
  3) passage length.
- Moi block:
  - Sentence excerpt,
  - Source URL/domain,
  - Similarity,
  - Match type,
  - Confidence,
  - Passage snippet (neu co `passage_matches`).

### Section F - Caveats & Method
- Liet ke `report_v2.caveats` theo bullet.
- Liet ke metadata quan trong (nho gon, khong dump full):
  - `scoring_policy`, `confidence_band`, `fallback_sentences`,
  - exclusion-related keys (`exclusion_applied`, `excluded_characters_ratio`, ...).

### Section G - Appendix (optional khi du lieu lon)
- Danh sach URL day du neu qua dai cho Source Table.
- Co page break rieng va danh so trang lien tuc.

## 6) Layout, font, pagination, unicode

### Font
- Phase 1 bat buoc embed font ho tro tieng Viet (de xuat: Noto Sans Regular/Bold).
- Khong duoc phu thuoc Helvetica cho noi dung tieng Viet.

### Margin va grid
- A4 portrait.
- Margin: 16mm trai/phai, 14mm tren/duoi.
- Header/footer lap lai moi trang.

### Header/Footer
- Header: report title + report id.
- Footer: generated time + `Page X/Y` (Y tinh sau khi render xong).

### Page break rules
- Khong cat giua row bang (autoTable hoac renderer tuong duong).
- Evidence block la atomic unit; neu khong du cho 1 block thi sang trang moi.

## 7) Ky thuat implementation de xuat

### 7.1 Thu vien
- Them `jspdf-autotable` de render table on dinh.
- Giu dynamic import cho `jspdf` de tranh tang initial bundle.

### 7.2 Tach module
- Tach logic PDF ra khoi component UI.
- `PlagiarismChecker.tsx` chi goi `exportPlagiarismPdfV2(result, options)`.

### 7.3 Data shaping layer
- Tao ham `buildPdfViewModel(result)` de:
  - normalize null/undefined,
  - tinh contribution,
  - build evidence list,
  - map labels.

### 7.4 Robustness
- URL parse dung safe helper (khong throw khi URL xau).
- Gioi han do dai text trong table cells + wrap line an toan.
- Neu loi PDF, fallback message cho user + log warning.

## 8) Backlog implementation chi tiet theo file

### 8.1 `frontend/package.json`
- Add dependency: `jspdf-autotable`.
- Acceptance:
  - `npm install` thanh cong.
  - `npm run build` pass.

### 8.2 `frontend/src/components/tools/PlagiarismChecker.tsx`
- Thay `exportToPDF` hien tai bang call den service moi.
- Truyen dung `result` va ten file output.
- Keep button UX hien tai, khong doi flow check plagiarism.
- Acceptance:
  - Nut Download van hoat dong.
  - Khong con logic render PDF dai trong component.

### 8.3 `frontend/src/utils/pdf/plagiarismPdfV2.ts` (new)
- Export API:
  - `export async function exportPlagiarismPdfV2(result: PlagiarismResponse): Promise<void>`
- Implement full section A->G, pagination, header/footer, page X/Y.
- Implement contribution + evidence ranking.
- Acceptance:
  - PDF sinh ra dung thu tu section.
  - Co page numbering dung voi tong so trang.
  - Ho tro > 20 sources khong mat dong.

### 8.4 `frontend/src/utils/pdf/plagiarismPdfViewModel.ts` (new)
- Chuyen doi `PlagiarismResponse` -> view model co fields da tinh san:
  - `summary`, `citationRows`, `sourceRows`, `evidenceRows`, `methodRows`, `caveatRows`.
- Acceptance:
  - Unit-level deterministic output cho input mau.
  - Khong throw khi `report_v2` thieu.

### 8.5 `frontend/src/utils/pdf/fonts.ts` (new)
- Nhung font Noto Sans (regular/bold) vao jsPDF VFS.
- API: `ensureVietnameseFont(doc)`.
- Acceptance:
  - Chu tieng Viet co dau hien thi dung trong PDF.

### 8.6 `frontend/src/utils/pdf/format.ts` (new)
- Helpers: date format, similarity label, confidence label, safe URL/domain.
- Acceptance:
  - Mapping labels dung theo spec.

### 8.7 `frontend/src/types/plagiarism.ts` (new, optional nhung khuyen nghi)
- Tach interfaces dang nam trong component de tai su dung cho PDF module.
- Acceptance:
  - Build pass, imports khong vong.

### 8.8 `frontend/tests/e2e/plagiarism-pdf.spec.ts` (new)
- E2E flow:
  - mo tool,
  - chay check voi text sample,
  - click download,
  - assert file duoc tai ve.
- Acceptance:
  - Test pass local/headed.

### 8.9 `backend/app/schemas/plagiarism.py` (optional Phase 1.5)
- Khong bat buoc doi schema cho PDF V2.
- Optional: them field metadata phuc vu report (`report_generated_at`, `report_version`).
- Acceptance:
  - Backward-compatible response.

## 9) Definition of Done (DoD)
- PDF V2 xuat duoc cho ca case ngan (500 ky tu) va dai (>= 1500 ky tu).
- Unicode tieng Viet dung (khong ky tu loi).
- Co Section A->F day du; G khi can.
- Footer `Page X/Y` chinh xac tren moi trang.
- Source table khong bi hard-limit 8 nguon.
- Build frontend pass (`npm run build`).
- E2E download PDF pass.

## 10) QA matrix

### Data scenarios
- S1: `report_v2` day du, 20+ sources.
- S2: `report_v2` null, chi co `results`.
- S3: co `caveats` + fallback_sentences > 0.
- S4: URLs malformed trong source.
- S5: passage_matches rong/toi da.

### Assertions
- Layout khong vo trang.
- Table wrap dung, khong overlap text.
- Vietnamese glyph dung.
- Contribution sum xap xi 100% (cho phep sai so +/-1 do lam tron).
- Time-to-export chap nhan duoc (< 3s voi du lieu trung binh tren may dev).

## 11) Rollout plan

### Phase 1 (frontend only, uu tien ngay)
- Implement cac file 8.1 -> 8.6.
- Manual QA + e2e basic.

### Phase 1.5
- Optional type extraction (`8.7`) + optional schema metadata (`8.9`).

### Phase 2 (neu can report enterprise)
- Danh gia backend renderer (HTML -> PDF) de support report rat dai, TOC click, branding templates.

## 12) Risk va giam thieu
- Risk: font file lon tang bundle.
  - Mitigation: dynamic import font module chi khi export PDF.
- Risk: jsPDF memory voi report rat dai.
  - Mitigation: split appendix, gioi han evidence default, xem xet Phase 2 backend render.
- Risk: du lieu backend thay doi key.
  - Mitigation: viewModel layer + fallback defaults + defensive parsing.

## 13) Task order khuyen nghi cho dev (lam thang, it rework)
1. Add dependency + scaffold `plagiarismPdfViewModel.ts`.
2. Implement `format.ts` + `fonts.ts`.
3. Implement `plagiarismPdfV2.ts` (A->F truoc, G sau).
4. Wire lai `PlagiarismChecker.tsx`.
5. Chay build + e2e download test.
6. QA manual voi 5 scenarios o muc 10.
