Plan: Step 3 Content Restructure
1. Overview
Mục tiêu: Thay thế nội dung Step 3 hiện tại (rất ngắn, chỉ 2 guidance items) bằng nội dung mới đầy đủ và chuyên nghiệp hơn về "Xây dựng hướng tiếp cận & phương pháp nghiên cứu".
Phạm vi: 
- Cập nhật title, description, deliverables, guidance, support cho Step 3
- Áp dụng cho tất cả 6 khối ngành (stepsIt, stepsBusiness, stepsDesign, stepsLaw, stepsLanguages, stepsMedia)
---
2. Content Mapping
Nội dung mới → Sections
| # | Section | Nội dung | stepNumber |
|---|---------|----------|------------|
| 1 | Mục tiêu | 1 câu mục tiêu chính | 1 |
| 2 | Đầu ra cụ thể | 3 đầu ra với sub-items | 2 |
| 3 | Tiêu chí đánh giá | 4 tiêu chí (Rõ ràng, Khả thi, Gắn đúng câu hỏi, Có điểm dừng) + Test nhanh | 3 |
| 4 | Cách làm từng bước | 4 bước chi tiết | 4 |
| 5 | Lỗi thường gặp | 4 lỗi với Nhận biết + Xử lý | 5 |
---
3. Display Component Mapping
Phân tích UI phù hợp cho từng section:
| Section | Display Component | Pattern | Lý do |
|---------|-------------------|---------|-------|
| Mục tiêu | Default list với 💡 box | Simple list | Nội dung ngắn, cần highlight |
| Đầu ra cụ thể | TwoColumnOutputDisplay | OUTPUT\|Title\|items... | 2 cột: "Đầu ra cần có" vs "Giải thích chi tiết" |
| Tiêu chí đánh giá | NEW: CriteriaChecklistDisplay | CRITERIA\|Title\|items... | 4 tiêu chí với checkbox style + Test nhanh |
| Cách làm từng bước | NestedTabsDisplay | A\|Bước 1\|content... | 4 tabs cho 4 bước |
| Lỗi thường gặp | PitfallDisplay (sửa đổi) | Title: Nhận biết:...Xử lý:... | Đã có pattern tương tự |
---
4. UI Layout Proposal
Section 1: Mục tiêu (Simple)
┌─────────────────────────────────────────────────────────────────┐
│ ① Mục tiêu                                                       │
├─────────────────────────────────────────────────────────────────┤
│ Chuyển câu hỏi nghiên cứu thành cách tiếp cận và phương pháp    │
│ có thể triển khai, đủ rõ để người khác hiểu bạn làm gì và vì sao│
└─────────────────────────────────────────────────────────────────┘
Section 2: Đầu ra cụ thể (Two Column)
┌─────────────────────────────────────────────────────────────────┐
│ ② Đầu ra cụ thể                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────┬──────────────────────────────┐ │
│ │ 📋 Hướng tiếp cận (approach) │ 📝 Phương pháp chính         │ │
│ │    + Phương pháp             │    (methodology)             │ │
│ │                              │                              │ │
│ │ • Hướng tiếp cận (approach): │ • Thực nghiệm/đo lường       │ │
│ │   logic bạn dùng để giải    │ • Phân tích dữ liệu          │ │
│ │   quyết vấn đề              │ • Mô hình hoá/mô phỏng       │ │
│ │ • Một phương pháp chính      │ • Khảo sát/phỏng vấn         │ │
│ │   (methodology)              │ • Nghiên cứu lý thuyết       │ │
│ │ • Giải thích ngắn gọn        │                              │ │
│ └──────────────────────────────┴──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
Section 3: Tiêu chí đánh giá (4 Cards Grid + Warning)
┌─────────────────────────────────────────────────────────────────┐
│ ③ Tiêu chí đánh giá đầu ra                                       │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┬─────────────────┬─────────────────┬────────┐│
│ │ 1️⃣ Rõ ràng      │ 2️⃣ Khả thi      │ 3️⃣ Gắn đúng     │ 4️⃣ Có  ││
│ │                 │                 │    câu hỏi     │  điểm  ││
│ │ • Mô tả được    │ • Với thời gian │ • Chỉ ra được  │  dừng  ││
│ │   bằng 2-3 câu  │   hiện tại...   │   bước nào...  │        ││
│ │ • Hình dung     │ • Trong LR có   │ • Có bước nào  │ • Xác  ││
│ │   được output   │   ít nhất 1...  │   "làm cho hay"│   định ││
│ └─────────────────┴─────────────────┴─────────────────┴────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🧪 Test nhanh: Giải thích phương pháp cho mentor và 2-3    │ │
│ │    người khác. Nếu họ hiểu bạn sẽ quan sát/đo/phân tích... │ │
│ │    → đạt.                                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Nếu không trả lời được đồng thời làm gì – ra kết quả    │ │
│ │    gì – trong bao lâu – để trả lời câu hỏi nào → chưa đạt  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
Section 4: Cách làm từng bước (Nested Tabs)
┌─────────────────────────────────────────────────────────────────┐
│ ④ Cách làm từng bước                                             │
├─────────────────────────────────────────────────────────────────┤
│ [Bước 1] [Bước 2] [Bước 3] [Bước 4]                             │
│ ─────────────────────────────────────────────────────────────── │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Bước 1 – Bóc tách cách người khác trả lời câu hỏi           │ │
│ │                                                             │ │
│ │ Từ bảng 8–12 bài ở bước Literature Review:                  │ │
│ │ • Gạch chân câu hỏi/vấn đề mỗi bài trả lời                  │ │
│ │ • Gạch chân cách họ trả lời                                 │ │
│ │                                                             │ │
│ │ 🎯 Tự hỏi:                                                  │ │
│ │ • Những bài gần nhất với câu hỏi của tôi đã làm gì?         │ │
│ │ • Có mẫu hình lặp lại giữa nhiều bài không?                 │ │
│ │                                                             │ │
│ │ ⚠️ Nếu không chỉ ra được ít nhất 2 bài làm gần giống nhau   │ │
│ │    → literature review chưa đủ sâu.                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
Section 5: Lỗi thường gặp (Timeline/Pitfall)
┌─────────────────────────────────────────────────────────────────┐
│ ⑤ Lỗi thường gặp & cách xử lý                                    │
├─────────────────────────────────────────────────────────────────┤
│ │                                                               │
│ ●─── Phương pháp nghe "xịn" nhưng không trả lời câu hỏi        │
│ │    ┌────────────────────────┬────────────────────────┐        │
│ │    │ 🔴 Nhận biết           │ 🟢 Xử lý               │        │
│ │    │ Mô tả dài nhưng liên   │ Viết lại: "Phương pháp│        │
│ │    │ hệ với câu hỏi rất mờ  │ này trả lời phần nào?"│        │
│ │    └────────────────────────┴────────────────────────┘        │
│ │                                                               │
│ ●─── Nhầm giữa chủ đề và phương pháp                           │
│ │    ┌────────────────────────┬────────────────────────┐        │
│ │    │ 🔴 Nhận biết           │ 🟢 Xử lý               │        │
│ │    │ "Tôi dùng AI" nhưng    │ Bổ sung động từ hành   │        │
│ │    │ không nói để làm gì    │ động: đo, so sánh...   │        │
│ │    └────────────────────────┴────────────────────────┘        │
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
---
5. Technical Implementation
5.1. Components cần tạo/sửa đổi
| Component | Action | Mô tả |
|-----------|--------|-------|
| CriteriaGridDisplay | NEW | 4-column grid cho tiêu chí + test box + warning |
| PitfallDisplay | MODIFY | Hỗ trợ thêm pattern "Nhận biết:" bên cạnh "Dấu hiệu" |
5.2. Data Pattern cho Step 3
// Section 1: Mục tiêu
{
  id: 'step3_g1',
  stepNumber: 1,
  title: 'Mục tiêu',
  description: 'Chuyển câu hỏi nghiên cứu thành cách tiếp cận và phương pháp có thể triển khai, đủ rõ để người khác hiểu bạn làm gì và vì sao.',
  subSteps: []  // No subSteps, just description
}
// Section 2: Đầu ra cụ thể (Two Column)
{
  id: 'step3_g2',
  stepNumber: 2,
  title: 'Đầu ra cụ thể',
  description: 'Sau bước này, bạn cần có:',
  subSteps: [
    'OUTPUT|Đầu ra cần có|Hướng tiếp cận (approach): logic bạn dùng để giải quyết vấn đề|Một phương pháp chính (methodology)|Giải thích ngắn gọn vì sao phương pháp này phù hợp',
    'OUTPUT|Ví dụ methodology|Thực nghiệm / đo lường|Phân tích dữ liệu|Mô hình hoá / mô phỏng|Khảo sát / phỏng vấn|Nghiên cứu lý thuyết / tổng quan hệ thống'
  ]
}
// Section 3: Tiêu chí đánh giá (Grid)
{
  id: 'step3_g3',
  stepNumber: 3,
  title: 'Tiêu chí đánh giá đầu ra',
  description: 'Một phương pháp được coi là đủ tốt nếu bạn trả lời được CÓ cho đa số câu hỏi sau:',
  subSteps: [
    'GRID|1️⃣ Rõ ràng|Mô tả được phương pháp bằng 2–3 câu đơn giản|Hình dung được output cuối cùng (dữ liệu, bảng số liệu, biểu đồ, mô hình, lập luận…)',
    'GRID|2️⃣ Khả thi|Với thời gian, kỹ năng, nguồn lực hiện tại, tôi có làm được không?|Trong literature review có ít nhất một nghiên cứu gần dùng cách tiếp cận tương tự không?',
    'GRID|3️⃣ Gắn đúng câu hỏi|Chỉ ra được bước nào của phương pháp trả lời phần nào của câu hỏi|Có bước nào "làm cho hay" nhưng không cần thiết không?',
    'GRID|4️⃣ Có điểm dừng|Xác định được phiên bản tối thiểu của phương pháp|Biết khi nào thì đủ để chuyển sang bước tiếp theo',
    '🧪 Test nhanh: Giải thích phương pháp cho mentor và 2–3 người khác. Nếu họ hiểu bạn sẽ quan sát/đo/phân tích/so sánh cái gì → đạt.',
    '⚠️ Nếu không trả lời được đồng thời làm gì – ra kết quả gì – trong bao lâu – để trả lời câu hỏi nào → chưa đạt.'
  ]
}
// Section 4: Cách làm từng bước (Nested Tabs)
{
  id: 'step3_g4',
  stepNumber: 4,
  title: 'Cách làm từng bước',
  description: 'Bước này không bắt đầu từ số 0. Phương pháp phải xuất phát trực tiếp từ đầu ra Bước 2 (Literature Review).',
  subSteps: [
    'A|Cách làm|Bước 1 – Bóc tách cách người khác trả lời câu hỏi: Từ bảng 8–12 bài ở bước LR:\n• Gạch chân câu hỏi/vấn đề mỗi bài trả lời\n• Gạch chân cách họ trả lời (quan sát, đo, phân tích, so sánh gì)\n\n🎯 Tự hỏi:\n• Những bài gần nhất với câu hỏi của tôi đã làm gì cụ thể?\n• Có mẫu hình lặp lại giữa nhiều bài không?\n\n⚠️ Nếu không chỉ ra được ít nhất 2 bài làm gần giống nhau → literature review chưa đủ sâu.',
    'A|Cách làm|Bước 2 – Ánh xạ câu hỏi ↔ cách làm trong literature: Lập bảng đơn giản:\n| Câu hỏi NC | Bài nào đã xử lý | Họ làm bằng cách gì |\n\n🎯 Tự hỏi:\n• Phần nào đã có người làm?\n• Phần nào chưa rõ / còn yếu / mâu thuẫn?\n\n⚠️ Phương pháp phải xuất phát từ bảng này, không từ cảm giác.',
    'A|Cách làm|Bước 3 – Rút gọn còn 1–2 hướng phương pháp khả thi: Chọn 1–2 hướng:\n• Đã xuất hiện trong literature\n• Trả lời trực tiếp câu hỏi nghiên cứu\n\n🎯 Với mỗi hướng, trả lời:\n• Học từ bài nào?\n• Giữ điểm gì, bỏ/điều chỉnh điểm gì so với bài gốc?\n\n⚠️ Không chỉ ra được nguồn gốc từ literature → phương pháp thiếu nền tảng.',
    'A|Cách làm|Bước 4 – Chốt hướng tiếp cận chính (phiên bản của bạn): Viết 5–7 dòng gồm:\n• Bạn tiếp cận vấn đề theo hướng nào trong literature\n• Các bước chính (ở mức khái niệm)\n• Bạn giữ nguyên / điều chỉnh / đơn giản hoá điểm gì so với các bài trước\n\n⚠️ Nếu không chỉ ra được bài nào truyền cảm hứng cho từng bước → quay lại Bước 2.'
  ]
}
// Section 5: Lỗi thường gặp (Pitfall - modified pattern)
{
  id: 'step3_g5',
  stepNumber: 5,
  title: 'Lỗi thường gặp & cách xử lý',
  description: 'Tránh các cạm bẫy phổ biến khi xây dựng phương pháp nghiên cứu.',
  subSteps: [
    'Phương pháp nghe "xịn" nhưng không trả lời câu hỏi: Nhận biết: Mô tả dài nhưng liên hệ với câu hỏi rất mờ. Xử lý: Viết lại: "Phương pháp này trả lời phần nào của câu hỏi?" → không trả lời được thì đổi hoặc giản lược',
    'Nhầm giữa chủ đề và phương pháp: Nhận biết: "Tôi dùng AI/khảo sát/mô hình hoá" nhưng không nói để làm gì. Xử lý: Bổ sung động từ hành động: đo, so sánh, phân tích, kiểm chứng, giải thích…',
    'Phương pháp quá tham, vượt khả năng: Nhận biết: Quá nhiều bước, dữ liệu, kỹ thuật. Xử lý: Cắt về phiên bản tối thiểu: nếu chỉ làm 50%, phần nào quan trọng nhất?',
    'Không hình dung được kết quả: Nhận biết: Không trả lời được "Làm xong tôi có gì trong tay?". Xử lý: Chỉ rõ output (bảng, biểu đồ, mô hình, lập luận…). Không hình dung được → phương pháp chưa rõ.'
  ]
}
---
6. Files cần sửa
| # | File | Thay đổi |
|---|------|----------|
| 1 | GuidanceSection.tsx | Thêm CriteriaGridDisplay, sửa PitfallDisplay để hỗ trợ "Nhận biết:" |
| 2 | stepsIt.ts | Cập nhật Step 3: title, description, deliverables, guidance, support |
| 3 | stepsBusiness.ts | Cập nhật Step 3 giống stepsIt |
| 4 | stepsDesign.ts | Cập nhật Step 3 giống stepsIt |
| 5 | stepsLaw.ts | Cập nhật Step 3 giống stepsIt |
| 6 | stepsLanguages.ts | Cập nhật Step 3 giống stepsIt |
| 7 | stepsMedia.ts | Cập nhật Step 3 giống stepsIt |
---
7. Task Breakdown
| Task | Mô tả | Estimated |
|------|-------|-----------|
| T1 | Tạo CriteriaGridDisplay component (4-column grid) | 15 min |
| T2 | Sửa PitfallDisplay để hỗ trợ "Nhận biết:" pattern | 5 min |
| T3 | Thêm detection cho GRID\| trong SubStepsDisplay | 5 min |
| T4 | Cập nhật Step 3 trong stepsIt.ts | 10 min |
| T5 | Cập nhật Step 3 trong 5 files còn lại | 15 min |
| T6 | Build & test | 5 min |
| T7 | Commit & push | 2 min |