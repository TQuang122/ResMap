# Plan: Nâng cấp Plagiarism Checker giống Turnitin - Phase 2

## Mục tiêu
Nâng cấp plagiarism checker đạt 95% parity với Turnitin

## Features cần implement

### 1. Internal Repository Matching
**Mô tả**: So sánh bài nộp mới với các bài đã nộp trước đó trong hệ thống

**Backend:**
- [ ] Thêm bảng lưu trữ submissions (`submissions` table)
- [ ] Thêm API endpoint lưu trữ kết quả plagiarism
- [ ] Thêm logic so sánh với submissions trước đó
- [ ] Trả về matches từ internal repo riêng biệt

**Frontend:**
- [ ] Hiển thị "Internal Sources" tách biệt
- [ ] Toggle để bật/tắt internal matching

### 2. Full PDF Upload Support
**Mô tả**: Hỗ trợ upload PDF trực tiếp, không cần convert

**Backend:**
- [ ] Thêm PDF parsing library (`pypdf` hoặc `pdfplumber`)
- [ ] Trích xuất text từ PDF
- [ ] Xử lý multi-page PDFs

**Frontend:**
- [ ] Mở rộng file input accept=".pdf,.docx,.txt"
- [ ] Hiển thị processing indicator cho PDF

### 3. Real-time Live Checking
**Mô tả**: Kiểm tra plagiarism ngay khi user đang gõ (debounced)

**Frontend:**
- [ ] Thêm debounced input (delay 2-3s sau khi gõ)
- [ ] Thêm "Live Check" toggle
- [ ] Hiển thị partial results
- [ ] Tối ưu API cho incremental checks

**Backend:**
- [ ] Thêm lightweight endpoint cho quick checks
- [ ] Cache kết quả để tránh re-check

### 4. Gradebook Integration
**Mô tả**: Lưu kết quả vào gradebook của sinh viên

**Backend:**
- [ ] Thêm endpoint lưu kết quả vào database
- [ ] Thêm endpoint lấy lịch sử checks của user

**Frontend:**
- [ ] Thêm "Save to Gradebook" button
- [ ] Hiển thị lịch sử plagiarism checks
- [ ] Thêm filters cho lịch sử

### 5. Student View Mode
**Mô tả**: Chế độ xem dành cho sinh viên (hạn chế hơn instructor)

**Backend:**
- [ ] Thêm role-based access control
- [ ] Instructor: xem full details + all submissions
- [ ] Student: chỉ xem được kết quả của mình

**Frontend:**
- [ ] Thêm role indicator
- [ ] Ẩn sensitive controls cho student view
- [ ] Different UI cho instructor vs student

---

## Thứ tự ưu tiên

| Priority | Feature              | Effort | Impact |
| -------- | -------------------- | ------ | ------ |
| 1        | PDF Upload           | Medium | High   |
| 2        | Internal Repository  | High   | High   |
| 3        | Gradebook Integration| Medium | Medium |
| 4        | Real-time Checking  | Medium | Medium |
| 5        | Student View        | Medium | Medium |

---

## Dependencies

- Backend: `pypdf` hoặc `pdfplumber` cho PDF parsing
- Database: Thêm bảng `plagiarism_submissions` và `plagiarism_history`
- API: Thêm endpoints cho internal matching và gradebook

---

## Backward Compatibility

Tất cả features mới phải backward-compatible:
- Thêm optional parameters, không thay đổi existing behavior
- Frontend: toggle để bật/tắt features mới
