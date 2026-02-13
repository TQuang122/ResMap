import { THEMES } from '../constants';
import { StepFullData } from '../types';
import { STEP_0_DATA } from './step0Shared';

export const STEPS_DATA: StepFullData[] = [
  STEP_0_DATA,
  {
    id: 'step1',
    stepNumber: "01",
    title: "Chọn vấn đề & biến nó thành câu hỏi nghiên cứu",
    description: "Sau bước này, bạn cần xác định một câu hỏi/bài toán nghiên cứu đủ rõ để bắt đầu tìm tài liệu và triển khai trong một chu kỳ nghiên cứu hữu hạn. Một câu hỏi tốt giúp người hướng dẫn hiểu bạn định làm gì, giúp bạn không lan man và giúp nhóm sớm quyết định tiếp tục hay dừng một hướng.",
    theme: THEMES.step1,
    deliverables: [
      {
        id: 'step1_d1',
        label: 'Đầu ra chính',
        criteria: ['1 câu hỏi/bài toán nghiên cứu', 'Viết gọn trong 1–2 câu, rõ ràng', 'Tránh khẩu hiệu, từ mơ hồ', 'Người ngoài đề tài nhưng cùng lĩnh vực gần vẫn hiểu được ý chính'],
        placeholder: 'Ghi chú câu hỏi nghiên cứu chính của bạn...'
      },
      {
        id: 'step1_d2',
        label: 'Đánh giá: Đối tượng & Nguồn',
        criteria: ['Nghiên cứu trên cái gì (dữ liệu, tài liệu, hiện tượng, hệ thống)?', 'Nguồn từ đâu (công khai, nội bộ, khảo sát, thí nghiệm)?', 'Có thể tiếp cận hợp pháp và lặp lại được không?'],
        placeholder: 'Ghi chú về đối tượng và nguồn dữ liệu...'
      },
      {
        id: 'step1_d3',
        label: 'Đánh giá: Năng lực & Phương pháp',
        criteria: ['Nhóm đã từng làm hoặc học được cách phân tích tương tự chưa?', 'Có tài liệu, khóa học hoặc ví dụ đủ để học và áp dụng trong vài tuần không?'],
        placeholder: 'Ghi chú về năng lực và phương pháp...'
      },
      {
        id: 'step1_d4',
        label: 'Đánh giá: Thời gian & Tài nguyên',
        criteria: ['Có chia được thành các giai đoạn (chuẩn bị → triển khai → phân tích → viết) không?', 'Mỗi giai đoạn có hình dung được đầu ra không?', 'Công cụ, thời gian, kinh phí, nhân lực có đáp ứng không?'],
        placeholder: 'Ghi chú về thời gian và nguồn lực...'
      }
    ],
    guidance: [
      {
        id: 'step1_g1',
        stepNumber: 1,
        title: 'Khám phá & hình thành hướng nghiên cứu',
        description: 'Không có một con đường "đúng" duy nhất. Bạn có thể quan sát vấn đề từ học tập, công việc, trải nghiệm cá nhân hoặc chọn hướng từ lab, bộ môn, gợi ý của giảng viên. Với người mới, tham khảo chủ đề từ giảng viên/lab và có mentor giúp tránh nhiều ngõ cụt. Dù khám phá theo cách nào, luôn đánh giá từng hướng bằng khung khả thi ở trên.',
        subSteps: [
          'Quan sát vấn đề từ học tập, công việc, trải nghiệm cá nhân',
          'Chọn hướng từ lab, bộ môn hoặc gợi ý của giảng viên',
          'Bắt đầu từ một chủ đề bạn hứng thú rồi đọc để tìm điểm có thể đi sâu',
          'Dùng ResMap / Research Explorer để xem các hướng đã được nghiên cứu và tìm giảng viên/nhóm phù hợp',
          'Tham khảo Capstone gần nhất của chuyên ngành',
          'Thảo luận với mentor để hiểu nhanh bối cảnh và nhận ra hướng khó khả thi',
          '⚠️ Không nên khóa cứng một hướng quá sớm, giữ hơn 1 lựa chọn để linh hoạt đổi hướng'
        ],
        resExploreBox: {
          title: 'ResExplore',
          description: 'Khám phá giảng viên và hướng nghiên cứu tại FPTU để tìm mentor phù hợp cho đề tài của bạn.',
          buttonLabel: 'Mở ResExplore'
        }
      },
      {
        id: 'step1_g2',
        stepNumber: 2,
        title: 'Thu hẹp thành câu hỏi/bài toán nghiên cứu',
        description: 'Mục tiêu là câu hỏi đủ rõ và đủ cụ thể để kiểm tra khả thi, chưa cần hoàn hảo. Câu hỏi này sẽ tiếp tục được kiểm chứng và chỉnh ở Bước 2.',
        subSteps: [
          'Bước A – Cố định "mình đang làm gì": Tôi sẽ làm gì (phân tích, so sánh, đánh giá, thử nghiệm…)? Tôi không làm gì ở giai đoạn này (cố tình loại 1–2 thứ để tránh lan man)?',
          'Bước B – Khoanh vùng phạm vi: Đối tượng nghiên cứu cụ thể là gì? Phạm vi/bối cảnh/thời gian nào được bao gồm và loại trừ? Có giải thích được trong 30 giây cho mentor không?',
          'Bước C – Gắn với cách đánh giá: Làm sao biết kết quả có ý nghĩa? Tiêu chí đến từ đâu (nghiên cứu trước, chuẩn học thuật, so sánh…)? Kết quả sẽ ở dạng gì (bảng, biểu đồ, lập luận, đối chiếu…)?',
          'Bước D – Viết câu hỏi nháp & xin ý kiến mentor: Viết 1–2 câu, dùng từ đơn giản. Tránh "tốt hơn / hiệu quả / tối ưu" nếu chưa gắn tiêu chí. Trao đổi nhanh với mentor (~5 phút)'
        ]
      },
      {
        id: 'step1_g3',
        stepNumber: 3,
        title: 'Lỗi thường gặp & cách xử lý',
        description: 'Tránh các cạm bẫy phổ biến để không lan man hoặc mắc kẹt. Nhớ rằng đọc là để refine câu hỏi, không phải để trì hoãn việc chốt hướng.',
        subSteps: [
          'Quá rộng hoặc mơ hồ: Dấu hiệu là không nói rõ trong 1 câu; paper nào cũng "có vẻ liên quan". Xử lý: cố định một đối tượng chính, chấp nhận bỏ hướng phụ',
          'Ý tưởng hay nhưng không đo lường được: Dấu hiệu là không biết "tốt hay chưa" bằng cách nào. Xử lý: chuyển sang phân tích/so sánh/đánh giá; mượn tiêu chí từ nghiên cứu trước',
          'Chạy theo xu hướng nhưng chưa hiểu lõi: Dấu hiệu là không giải thích được nếu bỏ từ khóa thời thượng. Xử lý: thu hẹp về một cơ chế hoặc góc nhìn cụ thể; ưu tiên hiểu sâu',
          'Trì hoãn việc chốt câu hỏi: Dấu hiệu là đọc nhiều nhưng chưa viết được 1–2 câu. Xử lý: viết câu hỏi nháp và gửi mentor; nếu góp ý được ngay → đủ để đi tiếp'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'ResMap', description: 'Công cụ khám phá chủ đề và giảng viên (Bước 1)' },
        { label: 'Google Scholar', description: 'Tìm abstract để xác định research gap' }
      ],
      tips: [
        '✅ Kiểm tra: Có 1 câu hỏi rõ ràng? Có đối tượng/nguồn cụ thể? Có phương pháp khả thi? Có thời gian/tài nguyên phù hợp? → Nếu tất cả ĐÚNG → Đủ điều kiện sang Bước 2',
        '✅ Tự hỏi thêm: Có mô tả được đầu vào → quá trình → đầu ra? Có ít nhất 1 cách đánh giá kết quả không dựa vào cảm giác? Nếu kết quả không như kỳ vọng, nghiên cứu vẫn trả lời được câu hỏi ban đầu?',
        'Nhấp vào "Xem tài liệu tham khảo" để xem videos và blogs hướng dẫn',
        'Sử dụng công cụ ResExplore để tìm giảng viên phù hợp'
      ],
      videoUrl: 'https://www.youtube.com/embed/42-d2HdbyS8',
      videoTitle: 'How To Write A Research Question',
      blogs: [
        {
          title: 'How to Write a Good Research Question',
          url: 'https://www.scribbr.com/research-process/research-questions/',
          author: 'Scribbr',
          description: 'Hướng dẫn chi tiết cách viết câu hỏi nghiên cứu hiệu quả'
        },
        {
          title: 'Defining a Research Problem',
          url: 'https://www.scribbr.com/research-process/research-problem/',
          author: 'Scribbr',
          description: 'Cách xác định và định nghĩa vấn đề nghiên cứu'
        },
        {
          title: 'How to Choose a Research Topic',
          url: 'https://www.scribbr.com/research-process/research-topic/',
          author: 'Scribbr',
          description: '10 bước để chọn đề tài nghiên cứu phù hợp'
        }
      ],
      additionalVideos: [
        {
          title: 'How to Write a Problem Statement for Your Research',
          url: 'https://www.youtube.com/watch?v=iaGpj8ViH1w',
          duration: '13 min'
        },
        {
          title: 'Find A Research Gap In ONE Day',
          url: 'https://www.youtube.com/watch?v=JYTG8MP3-YI',
          duration: '10 min'
        }
      ]
    }
  },
  {
    id: 'step2',
    stepNumber: "02",
    title: "Tìm & Sàng lọc tài liệu",
    description: "Mục tiêu không phải đọc thật nhiều, mà là: biết người khác đã làm gì, biết những gì không cần làm lại, và xác định khoảng trống để đặt câu hỏi hoặc thiết kế nghiên cứu.",
    theme: THEMES.step2,
    deliverables: [
      {
        id: 'step2_d1',
        label: 'Bảng tổng hợp tài liệu cốt lõi',
        criteria: [
          '8–12 tài liệu cốt lõi đã được sàng lọc',
          '1–2 survey/review/theoretical overview',
          '4–6 bài nghiên cứu gốc (xương sống LR)',
          '2–3 bài so sánh/benchmark/case study'
        ],
        placeholder: 'Liệt kê các tài liệu cốt lõi đã chọn...'
      },
      {
        id: 'step2_d2',
        label: 'Thông tin mỗi tài liệu',
        criteria: [
          'Vấn đề / câu hỏi nghiên cứu của bài',
          'Cách tiếp cận / phương pháp / khung lý thuyết',
          'Dữ liệu / đối tượng / bối cảnh',
          'Kết quả hoặc lập luận chính',
          'Lý do giữ bài – nó giúp quyết định điều gì?'
        ],
        placeholder: 'Ghi chú tóm tắt từng tài liệu...'
      },
      {
        id: 'step2_d3',
        label: 'Kiểm tra đầu ra',
        criteria: [
          'Trả lời được: "Mình đang đứng ở đâu trong bức tranh nghiên cứu hiện tại?"',
          'Xác định được state of the art / prior work',
          'Nhận diện được khoảng trống (gap) để thiết kế nghiên cứu'
        ],
        placeholder: 'Ghi chú về vị trí nghiên cứu của bạn trong bức tranh tổng thể...'
      }
    ],
    guidance: [
      {
        id: 'step2_g1',
        stepNumber: 1,
        title: 'Mục tiêu thực sự của bước này',
        description: 'Mục tiêu không phải đọc thật nhiều, mà là:',
        subSteps: [
          'Biết người khác đã làm gì (state of the art / prior work)',
          'Biết những gì không cần làm lại',
          'Xác định khoảng trống để đặt câu hỏi hoặc thiết kế nghiên cứu',
          'Literature review còn giúp bạn nhận diện các hướng tiếp cận, phương pháp, cách đo lường, và chuẩn bị nền tảng cho quyết định ở Bước 3.',
          '⚠️ Nếu chưa trả lời được "Mình đang đứng ở đâu trong bức tranh nghiên cứu hiện tại?" → bước này chưa đạt'
        ]
      },
      {
        id: 'step2_g1b',
        stepNumber: 2,
        title: 'Đầu ra cụ thể',
        description: 'Sau Bước 2, bắt buộc phải có:',
        subSteps: [
          'OUTPUT|Bảng tổng hợp 8-12 tài liệu cốt lõi|1-2 survey / review / theoretical overview (nắm tổng quan & thuật ngữ)|4-6 bài nghiên cứu gốc (xương sống literature review)|2-3 bài so sánh / benchmark / case study / ứng dụng|(Tuỳ chọn) 0-1 bài replication / meta-analysis',
          'OUTPUT|Với mỗi tài liệu, ghi rõ|Vấn đề / câu hỏi nghiên cứu|Cách tiếp cận / phương pháp / khung lý thuyết|Dữ liệu / đối tượng / bối cảnh (nếu có)|Kết quả hoặc lập luận chính|Lý do giữ bài – nó giúp bạn quyết định điều gì?'
        ]
      },
      {
        id: 'step2_g2',
        stepNumber: 3,
        title: 'Tiêu chí đánh giá tài liệu',
        description: 'Sử dụng các tiêu chí sau để quyết định giữ hay loại một tài liệu trong quá trình sàng lọc.',
        subSteps: [
          'Giữ: Gắn trực tiếp hoặc rất gần câu hỏi nghiên cứu',
          'Giữ: Có phương pháp / lập luận rõ ràng, tóm tắt được',
          'Giữ: Có bằng chứng, dữ liệu, ví dụ hoặc logic kiểm chứng',
          'Giữ: References dẫn đến nhiều bài lõi khác',
          'Loại: Nói chung chung, thiếu phương pháp hoặc luận cứ',
          'Loại: Survey quá rộng, không chạm phần lõi bạn quan tâm',
          'Loại: Không có dữ liệu / ví dụ / khung phân tích để học hỏi',
          'Loại: Đọc xong không giúp quyết định gì tiếp theo'
        ]
      },
      {
        id: 'step2_g3',
        stepNumber: 4,
        title: 'Cách làm – hai lớp chiến lược',
        description: 'Kết hợp chiến lược macro (chọn & thu hẹp tài liệu) và micro (đọc từng tài liệu theo Three-Pass Method của S. Keshav).',
        subSteps: [
          'A|Chọn & thu hẹp tài liệu (macro)|A1 – Chọn seed paper: Seed là điểm xuất phát của literature map.\n\nSeed tốt thường là:\n• Survey / review uy tín\n• Công trình nền tảng, được trích dẫn nhiều\n• Bài gần đây, định nghĩa rõ vấn đề hoặc khung nghiên cứu\n\n⚠️ Không nên dùng seed nếu bài quá hẹp, references mỏng, hoặc đọc mà không hiểu trọng tâm.',
          'A|Chọn & thu hẹp tài liệu (macro)|A2 – Đọc "đồ thị nghiên cứu": Khi dùng Connected Papers / citation graph:\n\n• Nút trung tâm → công trình nền\n• Cụm → các trường phái / hướng tiếp cận\n• Bridge papers → nối các cụm (rất giá trị)\n\nLuôn hỏi: "Vì sao bài này nằm ở vị trí này trong mạng lưới?"',
          'A|Chọn & thu hẹp tài liệu (macro)|A3 – Dùng để ưu tiên, không phải để gom: Kết quả mong muốn là 5–10 bài tiềm năng, không phải 50 PDF.\n\n🎯 Với mỗi bài, quyết định rõ:\n• Chỉ đọc abstract\n• Pass 1\n• Đọc sâu (Pass 2/3)',
          'B|Đọc từng tài liệu (Three-Pass Method)|Pass 1 (5–10 phút) – Bird\'s-eye view: Đọc title, abstract, intro, conclusion; lướt headings và glance references. Sau Pass 1, trả lời "5 Cs": (1) Category – loại paper gì? (2) Context – liên quan papers nào, dùng lý thuyết nền nào? (3) Correctness – giả định có valid? (4) Contributions – đóng góp chính? (5) Clarity – viết có rõ ràng? → Không rõ/không liên quan/giả định không valid → DỪNG.',
          'B|Đọc từng tài liệu (Three-Pass Method)|Pass 2 (1 tiếng) – Nắm nội dung chính: Đọc kỹ hơn nhưng bỏ qua details như proofs. Ghi chú key points. CHÚ Ý ĐẶC BIỆT: figures, diagrams, graphs – axes có labeled đúng? Có error bars? Đánh dấu references chưa đọc. Sau pass này: tóm tắt được main thrust với supporting evidence cho người khác. Nếu vẫn không hiểu → đọc background hoặc tiếp Pass 3.',
          'B|Đọc từng tài liệu (Three-Pass Method)|Pass 3 (4–5 tiếng) – Hiểu sâu hoàn toàn: "Virtual re-implementation" – giả sử cùng assumptions, thử tái tạo công trình trong đầu. Challenge EVERY assumption in EVERY statement. So sánh re-creation với paper → thấy innovations + hidden failings. Nghĩ: "Mình sẽ present khác thế nào?" Ghi ideas cho future work. Sau pass: reconstruct được entire structure từ memory, chỉ ra implicit assumptions và potential issues.'
        ]
      },
      {
        id: 'step2_g4',
        stepNumber: 5,
        title: 'Nguồn tìm papers uy tín & Cách đánh giá',
        description: 'Biết nơi nào để tìm papers chất lượng và cách phân biệt uy tín thông qua conference/journal rankings.',
        subSteps: [
          'N|Nguồn tìm kiếm|• Google Scholar: Tổng hợp từ mọi nguồn học thuật, miễn phí\n• IEEE Xplore: Khoa học kỹ thuật, đặc biệt EE, CS, Telecom\n• ACM Digital Library: Khoa học máy tính, Software Engineering\n• Scopus: Thuộc Elsevier, phủ sóng rộng nhiều lĩnh vực\n• Web of Science: Thuộc Clarivate, index các tạp chí uy tín nhất\n• Springer Nature: Khoa học tự nhiên và xã hội\n• ScienceDirect: Elsevier platform cho journals và proceedings',
          'N|Conference vs Journal|• Conference: Công bố tại hội nghị khoa học\n- Thời gian: 3-4 ngày\n- Peer review ngắn hơn\n- Cập nhật xu hướng mới nhanh\n- Phù hợp: Computer Science, Engineering\n\n• Journal: Công bố trên tạp chí học thuật\n- Peer review kỹ lưỡng hơn\n- Thời gian xuất bản dài hơn\n- Phù hợp: Sciences, Social Sciences (nghiên cứu sâu)',
          'N|Conference Ranking|A*: Khoa học cấp cao nhất, elitist venues, acceptance rate 5-15%\nA: Hội nghị top-tier, well-known trong lĩnh vực, acceptance rate 15-25%\nB: Hội nghị tốt, solid venues, acceptance rate 25-35%\nC: Hội nghị chấp nhận được, bổ sung cho danh mục, acceptance rate 35-50%',
          'N|Journal Ranking|Q1 (Quartile 1): Top 25% các tạp chí trong lĩnh vực, impact factor cao nhất\nQ2 (Quartile 2): 25-50%, tạp chí tốt, cân bằng giữa quality và accessibility\nQ3 (Quartile 3): 50-75%, tạp chí trung bình\nQ4 (Quartile 4): Bottom 25%, các tạp chí chuyên ngành nhỏ hơn'
        ]
      },
      {
        id: 'step2_g5',
        stepNumber: 6,
        title: 'Lỗi thường gặp & cách xử lý',
        description: 'Tránh các cạm bẫy phổ biến trong quá trình tìm và sàng lọc tài liệu.',
        subSteps: [
          'Chỉ đọc tổng quan, né tài liệu gốc: Dấu hiệu là không chỉ ra được dữ liệu/lập luận đứng sau một kết luận. Xử lý: Bắt buộc giữ ≥4 bài nghiên cứu gốc, ghi rõ dữ liệu/lập luận → kết luận',
          'Thu thập nhiều nhưng không rõ vai trò: Dấu hiệu là không trả lời được bài này giúp quyết định gì ở Bước 3. Xử lý: Mỗi bài phải có 1 dòng "Bài này giúp mình quyết định ___"',
          'Sao chép cách làm mà không hiểu điều kiện: Dấu hiệu là không rõ bối cảnh khác nhau ảnh hưởng kết quả thế nào. Xử lý: Ghi rõ assumptions – constraints – phạm vi hiệu lực của mỗi phương pháp',
          'Giữ bài "có vẻ liên quan" nhưng không dùng được: Dấu hiệu là không gắn được bài vào quyết định hay lập luận cụ thể nào. Xử lý: Mạnh dạn loại và ghi lý do. Loại có lý do = hiểu nghiên cứu rõ hơn'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'Connected Papers', description: 'Trực quan hóa citation graph và tìm bài liên quan' },
        { label: 'Google Scholar', description: 'Tìm kiếm học thuật và theo dõi citations' },
        { label: 'Semantic Scholar', description: 'AI-powered research discovery' },
        { label: 'Zotero/Mendeley', description: 'Quản lý tài liệu và tạo trích dẫn' }
      ],
      tips: [
        'Kết quả mong muốn: 5–10 bài tiềm năng, không phải 50 PDF',
        'Mỗi bài giữ phải có 1 dòng: "Bài này giúp mình quyết định ___"',
        'Tham khảo Three-Pass Method: web.stanford.edu/class/cs114/reading-keshav.pdf',
        'Loại có lý do = hiểu nghiên cứu rõ hơn'
      ],
      videoUrl: 'https://www.youtube.com/embed/CqeqJBcloek',
      videoTitle: 'How to Read a Paper Efficiently (S. Keshav)',
      blogs: [
        {
          title: 'How to Read a Paper (Three-Pass Approach)',
          url: 'https://web.stanford.edu/class/cs114/reading-keshav.pdf',
          author: 'S. Keshav',
          description: 'Phương pháp Three-Pass kinh điển để đọc paper hiệu quả'
        },
        {
          title: 'How to do a Literature Review',
          url: 'https://www.scribbr.com/methodology/literature-review/',
          author: 'Scribbr',
          description: 'Hướng dẫn từng bước thực hiện literature review'
        }
      ]
    }
  },
  {
    id: 'step3',
    stepNumber: "03",
    title: "Xây dựng hướng tiếp cận & Phương pháp nghiên cứu",
    description: "Chuyển câu hỏi nghiên cứu thành cách tiếp cận và phương pháp có thể triển khai, đủ rõ để người khác hiểu bạn làm gì và vì sao.",
    theme: THEMES.step3,
    deliverables: [
      {
        id: 'step3_d1',
        label: 'Hướng tiếp cận (Approach)',
        criteria: ['Logic rõ ràng để giải quyết vấn đề', 'Giải thích được vì sao chọn cách này', 'Nêu được những gì sẽ làm và không làm'],
        placeholder: 'Ghi chú hướng tiếp cận của bạn...'
      },
      {
        id: 'step3_d2',
        label: 'Phương pháp chính (Methodology)',
        criteria: ['Thực nghiệm/Đo lường', 'Phân tích dữ liệu', 'Mô hình hóa/Mô phỏng', 'Khảo sát/Phỏng vấn', 'Nghiên cứu lý thuyết/Tổng quan hệ thống'],
        placeholder: 'Ghi chú phương pháp chính...'
      },
      {
        id: 'step3_d3',
        label: 'Giải thích ngắn gọn',
        criteria: ['Vì sao phương pháp này phù hợp với câu hỏi nghiên cứu', 'Nguồn lực và thời gian cần thiết', 'Đầu ra dự kiến của phương pháp'],
        placeholder: 'Ghi chú giải thích...'
      }
    ],
    guidance: [
      {
        id: 'step3_g1',
        stepNumber: 1,
        title: 'Mục tiêu',
        description: 'Chuyển câu hỏi nghiên cứu thành cách tiếp cận và phương pháp có thể triển khai, đủ rõ để người khác hiểu bạn làm gì và vì sao.',
        subSteps: [
          'BUTTON|BLUEPRINT_WIZARD',
          'Chuyển câu hỏi nghiên cứu thành cách tiếp cận và phương pháp có thể triển khai',
          'Đủ rõ để người khác hiểu bạn làm gì và vì sao',
          'Xác định được đầu ra cụ thể của từng bước trong phương pháp'
        ]
      },
      {
        id: 'step3_g2',
        stepNumber: 2,
        title: 'Đầu ra cụ thể',
        description: 'Sau bước này, bạn cần có:',
        subSteps: [
          'OUTPUT|Hướng tiếp cận (Approach)|Logic bạn dùng để giải quyết vấn đề|Giải thích vì sao chọn cách này|Những gì bạn sẽ làm và không làm',
          'OUTPUT|Phương pháp chính (Methodology)|Thực nghiệm/Đo lường|Phân tích dữ liệu|Mô hình hóa/Mô phỏng|Khảo sát/Phỏng vấn|Nghiên cứu lý thuyết/Tổng quan hệ thống',
          'OUTPUT|Giải thích ngắn gọn|Vì sao phương pháp này phù hợp với câu hỏi nghiên cứu|Nguồn lực và thời gian cần thiết|Đầu ra dự kiến của phương pháp'
        ]
      },
      {
        id: 'step3_g3',
        stepNumber: 3,
        title: 'Tiêu chí đánh giá',
        description: 'Sử dụng 4 tiêu chí sau để đánh giá hướng tiếp cận và phương pháp của bạn:',
        subSteps: [
          "1️⃣ Rõ ràng: Mô tả được phương pháp bằng 2–3 câu đơn giản; Hình dung được output cuối cùng",
          "2️⃣ Khả thi: Với thời gian, kỹ năng, nguồn lực hiện tại, có làm được không?; Trong LR có ít nhất một nghiên cứu gần dùng cách tiếp cận tương tự không?",
          "3️⃣ Gắn đúng câu hỏi: Chỉ ra được bước nào trả lời phần nào của câu hỏi; Có bước nào 'làm cho hay' nhưng không cần thiết?",
          "4️⃣ Có điểm dừng: Xác định được phiên bản tối thiểu; Biết khi nào thì đủ để chuyển sang bước tiếp theo"
        ]
      },
      {
        id: 'step3_g4',
        stepNumber: 4,
        title: 'Cách làm từng bước',
        description: 'Thực hiện theo 4 bước sau để xây dựng hướng tiếp cận và phương pháp:',
        subSteps: [
          'Bước 1 – Giải phẫu cách người khác giải quyết vấn đề: Method literacy - khả năng đọc và hiểu cách tri thức được tạo ra. Phân tích theo 4 trục: • Loại vấn đề: Mô tả (chuyện gì xảy ra?), Giải thích (vì sao?), Dự đoán (sẽ xảy ra gì?), Can thiệp (làm sao thay đổi?), Thiết kế (làm sao tạo thứ tốt hơn?) • Nguồn tri thức: dữ liệu số, quan sát con người, hoặc lý thuyết • Logic tạo kết luận: Input → Process → Output (ví dụ: Survey → thống kê → insight) • Ràng buộc thực tế: không có data tốt hơn, không thể thí nghiệm, giới hạn thời gian, vấn đề đạo đức',
          'Bước 2 – Ánh xạ câu hỏi vào bản đồ phương pháp: Biến câu hỏi mơ hồ thành đối tượng khoa học qua 3 bước: • Bước A - Rút về bản chất: Ép thành dạng "Tôi muốn hiểu ___ để có thể ___" • Bước B - Chọn engine tri thức: "vì sao/như thế nào" → định tính, "bao nhiêu/mạnh không" → định lượng, "sẽ xảy ra không" → mô hình dự đoán • Bước C - Reality check: Có đo được biến không? Có đủ mẫu không? Có quyền truy cập dữ liệu không?',
          'Bước 3 – Thu hẹp còn hướng khả thi: Áp dụng 5 bộ lọc chiến lược: • Directness: Phương pháp có trả lời thẳng câu hỏi không? • Feasibility: Bạn thực sự làm được không? Phương pháp trung bình + thực thi xuất sắc luôn thắng • Signal vs Noise: Data có đủ tín hiệu hay toàn nhiễu? • Contribution: Cách này giúp nói điều gì mới không? • Energy cost: Phương pháp có làm bạn kiệt sức không? Research là marathon',
          'Bước 4 – Chốt hướng tiếp cận: Viết 2 đoạn logic thuyết phục: • Đoạn 1 - Strategic logic: "Nghiên cứu này chọn cách tiếp cận ___ nhằm làm rõ ___. Cách này phù hợp vì bản chất câu hỏi là ___ và yêu cầu ___" • Đoạn 2 - Operational snapshot: "Dữ liệu được thu thập từ ___. Phân tích bằng ___. Phương pháp này cho phép phát hiện ___ trong bối cảnh ___"'
        ]
      },
      {
        id: 'step3_g5',
        stepNumber: 5,
        title: 'Lỗi thường gặp & cách xử lý',
        description: 'Tránh các cạm bẫy phổ biến trong quá trình xây dựng hướng tiếp cận và phương pháp.',
        subSteps: [
          'Phương pháp nghe "xịn" nhưng không trả lời câu hỏi: Nhận biết là phương pháp phức tạp nhưng khi hỏi "nó giúp trả lời câu nào" thì không trả lời được. Xử lý: Quay lại câu hỏi nghiên cứu, hỏi "phương pháp nào giúp mình trả lời chính xác câu hỏi này?"',
          'Nhầm giữa chủ đề và phương pháp: Nhận biết là nói "tôi nghiên cứu về AI" thay vì "tôi dùng phương pháp phân tích thống kê để đánh giá...". Xử lý: Tách rõ chủ đề (cái gì) khỏi phương pháp (làm thế nào)',
          'Phương pháp quá tham, vượt khả năng: Nhận biết là liệt kê nhiều phương pháp hoặc phạm vi quá rộng so với thời gian. Xử lý: Áp dụng nguyên tắc MVP - phiên bản tối thiểu khả thi, hoàn thành rồi mới mở rộng',
          'Không hình dung được kết quả: Nhận biết là không biết output của phương pháp sẽ như thế nào (bảng số liệu, biểu đồ, bài viết...). Xử lý: Vẽ ra hoặc mô tả bằng lời output cuối cùng trước khi bắt đầu'
        ]
      },
      {
        id: 'step3_g6',
        stepNumber: 6,
        title: 'Test nhanh & Kết luận',
        description: 'Trước khi kết thúc bước này, hãy kiểm tra:',
        subSteps: [
          'CHECK|Test nhanh: Giải thích phương pháp cho mentor và 2–3 người khác. Nếu họ hiểu → đạt.',
          'CHECK|Nếu không trả lời được đồng thời: làm gì – ra kết quả gì – trong bao lâu – để trả lời câu hỏi nào → chưa đạt',
          'CHECK|Đầu ra cuối cùng: 1 đoạn mô tả hướng tiếp cận + 1 đoạn mô tả phương pháp chính, cùng lý do vì sao chọn'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'Connected Papers', description: 'Tìm papers liên quan với cách tiếp cận tương tự' },
        { label: 'Research Methodologist', description: 'Hỏi về phương pháp phù hợp với câu hỏi nghiên cứu' },
        { label: 'Google Scholar', description: 'Tìm các nghiên cứu dùng phương pháp tương tự' }
      ],
      tips: [
        'Phương pháp phải align với câu hỏi nghiên cứu',
        'Kiểm tra 4 tiêu chí: Rõ ràng, Khả thi, Gắn câu hỏi, Có điểm dừng',
        'Giải thích phương pháp cho người khác để test tính rõ ràng',
        'Bắt đầu từ phiên bản tối thiểu, rồi mở rộng nếu có thời gian'
      ],
      videoUrl: 'https://www.youtube.com/embed/C2a00y9WXjM',
      videoTitle: 'Research Methodology Basics',
      blogs: [
        {
          title: 'Choosing a Research Methodology',
          url: 'https://www.scribbr.com/methodology/research-methodology/',
          author: 'Scribbr',
          description: 'Hướng dẫn chọn phương pháp nghiên cứu phù hợp'
        },
        {
          title: 'Research Methods: An Overview',
          url: 'https://www.scribbr.com/methodology/research-methods-overview/',
          author: 'Scribbr',
          description: 'Tổng quan về các phương pháp nghiên cứu phổ biến'
        }
      ]
    }
  },
  {
    id: 'step4',
    stepNumber: "04",
    title: "Thiết kế pipeline triển khai nghiên cứu",
    description: "Chuyển phương pháp nghiên cứu thành pipeline triển khai (dữ liệu, nguồn lực, thời gian), đảm bảo nghiên cứu có thể thực hiện được.",
    theme: THEMES.step4,
    deliverables: [
      {
        id: 'step4_d1',
        label: 'Đầu ra 1',
        criteria: ['Tiêu chí 1: Bảng hỏi/Kịch bản phỏng vấn hoàn chỉnh', 'Tiêu chí 2: Pilot test đã thực hiện'],
        placeholder: 'Ghi chú về công cụ thu thập dữ liệu...'
      },
      {
        id: 'step4_d2',
        label: 'Đầu ra 2',
        criteria: ['Tiêu chí 1: Timeline Gantt Chart', 'Tiêu chí 2: Milestone rõ ràng'],
        placeholder: 'Ghi chú về kế hoạch thời gian...'
      },
      {
        id: 'step4_d3',
        label: 'Đầu ra 3',
        criteria: ['Tiêu chí 1: Consent form', 'Tiêu chí 2: Danh sách participant dự kiến'],
        placeholder: 'Ghi chú về ethical preparation...'
      }
    ],
    guidance: [
      {
        id: 'step4_g1',
        stepNumber: 1,
        title: 'Mục tiêu của bước này',
        description: 'Chuyển phương pháp nghiên cứu đã chọn (Bước 3) thành pipeline triển khai nghiên cứu (dữ liệu, nguồn lực, thời gian), đảm bảo nghiên cứu có thể triển khai được, có điểm dừng rõ ràng, không còn ở mức giả định, và có thể tái lập bởi bạn và người khác.',
        subSteps: []
      },
      {
        id: 'step4_g2',
        stepNumber: 2,
        title: 'Đầu ra cụ thể',
        description: 'Sau bước này, bạn cần có 4 nhóm đầu ra chính:',
        subSteps: [
          'TABLE|Loại dữ liệu|Định lượng/định tính/tài liệu/hiện trường/mô phỏng; dữ liệu có sẵn hay cần tự thu thập',
          'TABLE|Thu thập dữ liệu|Nguồn dữ liệu (ai/ở đâu), cách thu thập (khảo sát/phỏng vấn/quan sát), quy mô tối thiểu dự kiến',
          'TABLE|Xử lý & phân tích|Phân tích/so sánh/mã hóa/mô hình hóa/diễn giải theo hướng nào',
          'TABLE|Kế hoạch thực hiện|Các bước theo thứ tự thời gian, ước lượng thời gian cho từng bước'
        ]
      },
      {
        id: 'step4_g3',
        stepNumber: 3,
        title: 'Tiêu chí đánh giá (5 Tests)',
        description: 'Kế hoạch dữ liệu & thực hiện được coi là đủ tốt nếu bạn trả lời được CÓ cho các câu hỏi sau:',
        subSteps: [
          '1️⃣ Hình dung dữ liệu: Tôi mô tả được dữ liệu bằng ví dụ cụ thể (bảng, ghi chép, tài liệu)? Người khác có thể tưởng tượng dữ liệu trông như thế nào?',
          '2️⃣ Đủ trả lời RQ: Mỗi loại dữ liệu tương ứng với phần nào của câu hỏi? Có phần nào của câu hỏi chưa có dữ liệu phù hợp?',
          '3️⃣ Tiếp cận được: Nguồn dữ liệu thực sự tiếp cận được với tôi? Có rào cản đạo đức, pháp lý, hay hành chính nào không?',
          '4️⃣ Vừa thời gian: Nếu bị cắt 30-50% thời gian, tôi sẽ giữ lại phần dữ liệu nào? Có xác định được phiên bản tối thiểu?',
          '5️⃣ Logic các bước: Thứ tự các bước có phụ thuộc nhau hợp lý không? Có bước nào "để cho đủ" nhưng không thực sự cần thiết?'
        ]
      },
      {
        id: 'step4_g4',
        stepNumber: 4,
        title: 'Cách làm từng bước',
        description: 'Thực hiện theo 4 bước sau để thiết kế pipeline triển khai nghiên cứu:',
        subSteps: [
          'Bước 1 – Truy ngược từ phương pháp sang dữ liệu: Lấy phương pháp đã chốt ở Bước 3 và tự hỏi: mỗi bước cần loại dữ liệu nào? Dữ liệu phải ở dạng nào để phân tích được? • Viết dưới dạng "Để làm X, tôi cần dữ liệu Y" • Xác định rõ format dữ liệu cần có',
          'Bước 2 – Đối chiếu với literature review: Quay lại các bài chính trong Bước 2: • Họ dùng loại dữ liệu gì? Quy mô dữ liệu của họ là bao nhiêu? • Tôi có thể giảm quy mô mà vẫn giữ logic nghiên cứu không? • Nếu dữ liệu khác hoàn toàn literature mà không có lý do rõ ràng → cần xem lại',
          'Bước 3 – Thiết kế phiên bản dữ liệu tối thiểu: Xác định tập dữ liệu nhỏ nhất nhưng đủ dùng, điều kiện để coi dữ liệu là "đủ" • Tự hỏi: Nếu chỉ có dữ liệu này, tôi có trả lời được câu hỏi nghiên cứu không? • Đặt điều kiện dừng rõ ràng (đủ mẫu, đủ trường hợp, đủ tài liệu)',
          'Bước 4 – Lập kế hoạch thực hiện theo dòng thời gian: Viết kế hoạch dạng gạch đầu dòng: Tuần 1-2: ..., Tuần 3-4: ... • Chỉ cần ở mức logic & ước lượng, chưa cần chi tiết kỹ thuật • Xác định dependencies giữa các bước'
        ]
      },
      {
        id: 'step4_g5',
        stepNumber: 5,
        title: 'Lỗi thường gặp & cách xử lý',
        description: 'Tránh các cạm bẫy phổ biến trong quá trình thiết kế pipeline triển khai.',
        subSteps: [
          'Nói nhiều về phương pháp nhưng không rõ dữ liệu: Nhận biết là mô tả rất kỹ cách phân tích, nhưng không biết dữ liệu từ đâu ra. Xử lý: Buộc viết rõ "Dữ liệu này đến từ đâu, ở dạng gì?"',
          'Thiết kế dữ liệu quá lớn so với quy mô: Nhận biết là kế hoạch thu thập kéo dài, vượt quá thời gian cho phép. Xử lý: Cắt về phiên bản tối thiểu đã xác định',
          'Bỏ qua rào cản đạo đức/tiếp cận dữ liệu: Nhận biết là chỉ khi bắt đầu mới nhận ra không xin được dữ liệu/không được phép dùng. Xử lý: Kiểm tra sớm vấn đề đạo đức, quyền truy cập, sự đồng ý',
          'Kế hoạch thực hiện không có mốc dừng: Nhận biết là không biết khi nào thì dữ liệu là "đủ" để dừng thu thập. Xử lý: Đặt điều kiện dừng rõ ràng (đủ mẫu, đủ trường hợp, đủ tài liệu)'
        ]
      },
      {
        id: 'step4_g6',
        stepNumber: 6,
        title: 'Test nhanh & Kết luận',
        description: 'Trước khi kết thúc bước này, hãy kiểm tra:',
        subSteps: [
          'CHECK|Tôi mô tả được dữ liệu bằng ví dụ cụ thể (một bảng, một đoạn ghi chép, một tài liệu)?',
          'CHECK|Mỗi loại dữ liệu tương ứng phần nào của câu hỏi nghiên cứu?',
          'CHECK|Nguồn dữ liệu thực sự tiếp cận được với tôi?',
          'CHECK|Nếu cắt 30-50% thời gian, tôi biết giữ lại phần nào?',
          'CHECK|Thứ tự các bước có phụ thuộc nhau hợp lý?',
          'CHECK|Nếu không chỉ ra được dữ liệu cụ thể, nguồn dữ liệu, và cách dùng dữ liệu để trả lời câu hỏi → bước này chưa đạt.'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'Google Forms', description: 'Tạo survey online miễn phí' },
        { label: 'Notion', description: 'Quản lý project và timeline' },
        { label: 'Canva', description: 'Thiết kế Gantt Chart đẹp' }
      ],
      tips: [
        'Pilot test giúp phát hiện lỗi sớm',
        'Gửi survey vào thứ 3-4, avoid weekend',
        'Chuẩn bị plan B nếu response rate thấp'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn thiết kế bảng hỏi'
    }
  },
  {
    id: 'step5',
    stepNumber: "05",
    title: "Triển khai, phân tích, diễn giải (& lặp lại)",
    description: "Chuyển dữ liệu từ pipeline thành lập luận có cơ sở để trả lời câu hỏi nghiên cứu, đồng thời cho phép điều chỉnh và lặp lại khi kết quả chưa đủ thuyết phục.",
    theme: THEMES.step5,
    deliverables: [
      {
        id: 'step5_d1',
        label: 'Tập kết quả chính',
        criteria: ['Bảng số liệu / trích dẫn / quan sát cốt lõi', 'Mỗi kết quả gắn rõ với nguồn dữ liệu'],
        placeholder: 'Ghi chú về kết quả chính...'
      },
      {
        id: 'step5_d2',
        label: 'Diễn giải có lập luận',
        criteria: ['Kết quả trả lời phần nào của RQ', 'Ý nghĩa trong bối cảnh cụ thể'],
        placeholder: 'Ghi chú về diễn giải...'
      },
      {
        id: 'step5_d3',
        label: 'Hạn chế & giả định',
        criteria: ['Điều kết quả chưa nói được', 'Điều kiện khiến kết luận có thể thay đổi'],
        placeholder: 'Ghi chú về hạn chế...'
      }
    ],
    guidance: [
      {
        id: 'step5_g1',
        stepNumber: 1,
        title: 'Mục tiêu của bước này',
        description: 'Chuyển dữ liệu từ pipeline (Bước 4) thành lập luận có cơ sở để trả lời trực tiếp câu hỏi nghiên cứu, đồng thời cho phép điều chỉnh và lặp lại khi kết quả chưa đủ thuyết phục.',
        subSteps: []
      },
      {
        id: 'step5_g2',
        stepNumber: 2,
        title: 'Đầu ra cụ thể',
        description: 'Sau bước này, bạn cần có 4 nhóm đầu ra chính:',
        subSteps: [
          '📊|Tập kết quả chính|Bảng số liệu / trích dẫn / quan sát / phân loại cốt lõi. Mỗi kết quả gắn rõ với nguồn dữ liệu cụ thể.',
          '📋|So sánh có kiểm soát|Giữa các phương án / nhóm / cách tiếp cận. Dựa trên tiêu chí đã xác định ở Bước 3–4.',
          '💡|Diễn giải có lập luận|Kết quả nói gì về câu hỏi nghiên cứu? Ý nghĩa của kết quả trong bối cảnh nào?',
          '⚠️|Hạn chế & giả định|Điều kết quả chưa nói được. Điều kiện khiến kết luận có thể thay đổi.'
        ]
      },
      {
        id: 'step5_g3',
        stepNumber: 3,
        title: 'Tiêu chí đánh giá đầu ra',
        description: 'Phân tích được coi là đạt nếu phần lớn câu hỏi sau trả lời được:',
        subSteps: [
          '1️⃣ Truy vết dữ liệu: Mỗi kết luận có chỉ ra bảng / trích dẫn / quan sát cụ thể không?',
          '2️⃣ Phân tích vs. mô tả: Nếu bỏ dữ liệu đi, đoạn văn còn đứng vững không? Tôi có trả lời "vì sao kết quả này quan trọng?" không?',
          '3️⃣ So sánh có kiểm soát: Các đối tượng được so sánh có cùng điều kiện? Có trộn tiêu chí khác mục tiêu không?',
          '4️⃣ Thừa nhận giới hạn: Ít nhất một hạn chế hoặc giả định được nêu rõ?'
        ]
      },
      {
        id: 'step5_g4',
        stepNumber: 4,
        title: 'Cách làm từng bước',
        description: 'Thực hiện theo 5 bước sau để triển khai, phân tích và diễn giải:',
        subSteps: [
          'Bước 1 – Cố định lại tiêu chí phân tích: Quay lại Bước 3–4 • Tôi đã cam kết dùng tiêu chí / thước đo / khung phân tích nào? • Có tiêu chí nào đang bị bỏ quên hoặc dùng sai mục đích không?',
          'Bước 2 – Trình bày kết quả trước, diễn giải sau: Đưa bảng, trích dẫn, sơ đồ, hoặc mô tả quan sát trước • Chỉ diễn giải khi người đọc đã thấy dữ liệu • Nếu chỉ đọc chữ mà không cần dữ liệu → bạn đang kể chuyện',
          'Bước 3 – So sánh và đối chiếu có kiểm soát: Mỗi kết luận gắn với ít nhất một đối chiếu cụ thể • Giữ nguyên điều kiện, chỉ thay đổi yếu tố đang phân tích',
          'Bước 4 – Diễn giải: từ kết quả sang ý nghĩa: Tự hỏi • Kết quả này trả lời phần nào của câu hỏi nghiên cứu? • Trong bối cảnh nào kết luận đúng, và khi nào thì không?',
          'Bước 5 – Quyết định có cần lặp lại không: Dựa trên kết quả hiện tại • Có dữ liệu cần bổ sung không? • Có giả định cần điều chỉnh không? • Nếu cần thay đổi cách thu thập hoặc xử lý dữ liệu → quay lại Bước 4 với pipeline đã có'
        ]
      },
      {
        id: 'step5_g5',
        stepNumber: 5,
        title: 'Lỗi thường gặp & cách xử lý',
        description: 'Tránh các cạm bẫy phổ biến trong quá trình phân tích và diễn giải.',
        subSteps: [
          'Chỉ lặp lại kết quả bằng lời: Nhận biết là chỉ nhắc lại con số / trích dẫn, không nói ý nghĩa. Xử lý: Bắt buộc trả lời "Kết quả này cho tôi hiểu biết hoặc quyết định mới nào?"',
          'Kết luận không gắn với dữ liệu: Nhận biết là kết luận nghe hợp lý nhưng không chỉ ra nguồn. Xử lý: Truy ngược lại bảng / trích dẫn / quan sát cụ thể hoặc bỏ kết luận',
          'Né tránh kết quả không đẹp hoặc mâu thuẫn: Nhận biết là chỉ trình bày phần thuận lợi cho giả thuyết ban đầu. Xử lý: Nêu rõ điều kiện khiến phương án không hiệu quả — điều này tăng độ tin cậy',
          'Không biết khi nào nên dừng phân tích: Nhận biết là phân tích kéo dài nhưng không tạo thêm lập luận mới. Xử lý: Quay lại câu hỏi nghiên cứu gốc và kiểm tra: đã trả lời đủ chưa?'
        ]
      },
      {
        id: 'step5_g6',
        stepNumber: 6,
        title: 'Test nhanh & Kết luận',
        description: 'Trước khi kết thúc bước này, hãy kiểm tra:',
        subSteps: [
          'CHECK|Mỗi kết luận có truy vết được về dữ liệu cụ thể (bảng/trích dẫn/quan sát)?',
          'CHECK|Tôi đã trả lời "vì sao kết quả này quan trọng?" cho mỗi kết quả chính?',
          'CHECK|Các so sánh có kiểm soát (cùng điều kiện, chỉ thay đổi 1 yếu tố)?',
          'CHECK|Ít nhất một hạn chế hoặc giả định được nêu rõ?',
          'CHECK|Nếu kết luận không truy vết được về dữ liệu hoặc né tránh hạn chế → bước này chưa đạt.'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'SPSS / Excel', description: 'Phân tích thống kê định lượng' },
        { label: 'NVivo', description: 'Phân tích định tính và mã hóa' },
        { label: 'Tableau / PowerBI', description: 'Trực quan hóa dữ liệu' }
      ],
      tips: [
        'Trình bày dữ liệu trước, diễn giải sau',
        'Mỗi kết luận phải truy vết được về nguồn',
        'Thừa nhận hạn chế tăng độ tin cậy',
        'Nếu phân tích không tạo lập luận mới → dừng lại'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn phân tích và diễn giải kết quả'
    }
  },
  {
    id: 'step6',
    stepNumber: "06",
    title: "Trình bày, phản biện & hoàn thiện nghiên cứu",
    description: "Chuyển toàn bộ kết quả và lập luận thành sản phẩm học thuật mạch lạc, có thể đọc – phản biện – đánh giá, và hoàn thiện dựa trên phản hồi.",
    theme: THEMES.step6,
    deliverables: [
      {
        id: 'step6_d1',
        label: 'Sản phẩm nghiên cứu hoàn chỉnh',
        criteria: ['Báo cáo / khoá luận / proposal hoàn chỉnh', 'Slide / poster / bản thuyết minh (nếu cần)'],
        placeholder: 'Ghi chú về sản phẩm cuối...'
      },
      {
        id: 'step6_d2',
        label: 'Cấu trúc lập luận',
        criteria: ['Mạch logic: câu hỏi → phương pháp → dữ liệu → kết quả → kết luận', 'Không nhảy bước, dễ theo dõi'],
        placeholder: 'Ghi chú về cấu trúc lập luận...'
      },
      {
        id: 'step6_d3',
        label: 'Phản hồi đã xử lý',
        criteria: ['Góp ý từ mentor/giảng viên đã được ghi nhận', 'Chỉnh sửa hoặc nêu rõ lý do không chỉnh'],
        placeholder: 'Ghi chú về xử lý phản hồi...'
      }
    ],
    guidance: [
      {
        id: 'step6_g1',
        stepNumber: 1,
        title: 'Mục tiêu của bước này',
        description: 'Chuyển toàn bộ kết quả và lập luận thành sản phẩm học thuật mạch lạc, có thể đọc – phản biện – đánh giá, và hoàn thiện dựa trên phản hồi. Góc nhìn giảng viên: muốn thấy bạn hiểu rõ mình đã làm gì, vì sao làm vậy và giới hạn ở đâu, không chỉ "đúng format".',
        subSteps: []
      },
      {
        id: 'step6_g2',
        stepNumber: 2,
        title: 'Đầu ra cụ thể',
        description: 'Sau bước này, bạn cần có 4 nhóm đầu ra chính:',
        subSteps: [
          '📊|Sản phẩm nghiên cứu hoàn chỉnh|Báo cáo / khoá luận / proposal, hoặc slide / poster / bản thuyết minh (tuỳ bối cảnh).',
          '📋|Cấu trúc lập luận rõ ràng|Câu hỏi → phương pháp → dữ liệu → kết quả → kết luận, nối logic, không nhảy bước.',
          '💡|Phản hồi đã được xử lý|Ghi nhận góp ý từ giảng viên / mentor / bạn học; chỉnh sửa hoặc nêu rõ lý do không chỉnh.',
          '⚠️|Phiên bản cuối có thể đánh giá độc lập|Người đọc không cần hỏi thêm vẫn hiểu nghiên cứu; dùng để chấm điểm, phản biện.'
        ]
      },
      {
        id: 'step6_g3',
        stepNumber: 3,
        title: 'Tiêu chí đánh giá đầu ra',
        description: 'Sản phẩm đạt nếu phần lớn câu hỏi sau trả lời được:',
        subSteps: [
          '1️⃣ Theo mạch: Chỉ đọc bản viết / slide, người đọc có hiểu câu hỏi, cách làm và kết luận không?',
          '2️⃣ Bảo vệ kết luận: Mỗi kết luận có dữ liệu và lập luận dẫn dắt không?',
          '3️⃣ Trung thực về giới hạn: Hạn chế và giả định có nêu rõ, đúng chỗ không?',
          '4️⃣ Xử lý phản hồi: Có dấu vết chỉnh sửa sau phản biện không?'
        ]
      },
      {
        id: 'step6_g4',
        stepNumber: 4,
        title: 'Cách làm từng bước',
        description: 'Đừng coi viết là pha cuối tách rời; đây là vòng lặp lập luận – người đọc – phản hồi.',
        subSteps: [
          'PRINCIPLE|Mỗi phần/đoạn đảm nhiệm một chức năng lập luận rõ ràng (đặt vấn đề, bảo vệ phương pháp, đưa bằng chứng, diễn giải ý nghĩa).',
          'PRINCIPLE|Viết để người đọc theo được logic, không để "trông học thuật".',
          'PRINCIPLE|Viết là chuỗi vòng lặp: nháp → phản hồi → chỉnh sửa có chủ đích.',
          'CYCLE|1|Khoá mạch lập luận|Trả lời ngắn gọn 3 câu hỏi — vấn đề là gì, vì sao cách làm hợp lý, kết quả trả lời được gì và không trả lời được gì.',
          'CYCLE|2|Trình bày theo người đọc|Mỗi mục trả lời một câu hỏi ngầm; nếu người đọc phải tự đoán bước nhảy logic → đoạn đó chưa đạt.',
          'CYCLE|3|Nhận phản hồi có chủ đích|Ưu tiên người không cùng đề tài để lộ điểm mù logic, không chỉ lỗi câu chữ.',
          'CYCLE|4|Chỉnh sửa có chọn lọc|Mỗi góp ý được gắn nhãn làm rõ, củng cố lập luận hoặc không áp dụng (kèm lý do).',
          'QUICKTEST|Một người ngoài đề tài có thể đọc và kể lại đúng câu chuyện nghiên cứu, bao gồm cả giới hạn, mà không cần hỏi thêm không? Nếu chưa chắc → cần thêm một vòng lặp.'
        ]
      },
      {
        id: 'step6_g5',
        stepNumber: 5,
        title: 'Lỗi thường gặp & cách xử lý',
        description: 'Tránh các cạm bẫy phổ biến trong quá trình trình bày và hoàn thiện.',
        subSteps: [
          'Viết cho người chấm, không cho người đọc: Nhận biết là nhiều thuật ngữ, mạch khó theo. Xử lý: Nhờ người ngoài lĩnh vực chỉ ra đoạn khó hiểu',
          'Che giấu hạn chế để nghiên cứu "đẹp" hơn: Nhận biết là không có mục hạn chế hoặc viết rất chung. Xử lý: Nêu rõ điều kiện khiến kết luận có thể không còn đúng',
          'Nhồi kết quả/ý tưởng mới phút cuối: Nhận biết là nội dung không gắn với phương pháp hoặc dữ liệu trước đó. Xử lý: Loại bỏ hoặc chuyển thành hướng nghiên cứu tiếp theo',
          'Bỏ qua phản biện vì thiếu thời gian: Nhận biết là bản cuối gần như giống bản trước phản hồi. Xử lý: Ưu tiên chỉnh các điểm ảnh hưởng trực tiếp đến mạch lập luận'
        ]
      },
      {
        id: 'step6_g6',
        stepNumber: 6,
        title: 'Test nhanh & Kết luận',
        description: 'Trước khi kết thúc bước này, hãy kiểm tra:',
        subSteps: [
          'CHECK|Người ngoài đề tài có thể đọc và kể lại đúng câu chuyện nghiên cứu không?',
          'CHECK|Mỗi kết luận có dữ liệu và lập luận dẫn dắt?',
          'CHECK|Hạn chế và giả định được nêu rõ, đúng chỗ?',
          'CHECK|Có dấu vết chỉnh sửa sau phản hồi?',
          'CHECK|Nếu sản phẩm khó theo, né hạn chế hoặc phớt lờ phản hồi → bước này chưa đạt.'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'Turnitin', description: 'Kiểm tra đạo văn chính thức' },
        { label: 'Grammarly', description: 'Kiểm tra ngữ pháp và clarity' },
        { label: 'Canva / PowerPoint', description: 'Thiết kế slide và poster' }
      ],
      tips: [
        'Viết cho người đọc, không cho người chấm',
        'Nhờ người ngoài đề tài review để lộ điểm mù logic',
        'Thừa nhận hạn chế một cách trung thực',
        'Ưu tiên chỉnh sửa các điểm ảnh hưởng đến mạch lập luận'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn trình bày và bảo vệ nghiên cứu'
    }
  }
];
