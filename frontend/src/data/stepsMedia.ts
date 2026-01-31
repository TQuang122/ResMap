import { THEMES } from '../constants';
import { StepFullData } from '../types';

export const STEPS_DATA: StepFullData[] = [
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
          title: 'Media ResExplore',
          description: 'Khám phá giảng viên và hướng nghiên cứu Truyền thông & Media tại FPTU để tìm mentor phù hợp cho đề tài của bạn.',
          buttonLabel: 'Mở Media ResExplore'
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
          '💡 Literature review còn giúp bạn nhận diện các hướng tiếp cận, phương pháp, cách đo lường, và chuẩn bị nền tảng cho quyết định ở Bước 3.',
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
          'A|Chọn & thu hẹp tài liệu (macro)|A2 – Đọc "đồ thị nghiên cứu": Khi dùng Connected Papers / citation graph:\n\n• Nút trung tâm → công trình nền\n• Cụm → các trường phái / hướng tiếp cận\n• Bridge papers → nối các cụm (rất giá trị)\n\n💡 Luôn hỏi: "Vì sao bài này nằm ở vị trí này trong mạng lưới?"',
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
          'N|Nguồn tìm kiếm|• Google Scholar: Tổng hợp từ mọi nguồn học thuật, miễn phí\n• Scopus: Thuộc Elsevier, phủ sóng rộng Communication, Media Studies\n• Web of Science: Thuộc Clarivate, index các tạp chí uy tín nhất\n• JSTOR: Communication, Media Studies, Cultural Studies\n• Springer Nature: Media Research, Communication Studies\n• Wiley Online Library: Journalism, Broadcasting, Media Management\n• Communication & Mass Media Complete (CMMC): Chuyên về truyền thông',
          'N|Conference vs Journal|Conference: Công bố tại hội nghị, peer review ngắn hơn. Phù hợp với Media Studies khi cần trao đổi về emerging media technologies và industry trends. Journal: Công bố trên tạp chí là kênh chính cho media research. Media journals có vai trò quan trọng trong việc phát triển lý thuyết và phương pháp.',
          'N|Conference Ranking|A*: Hội nghị elite trong Communication & Media Studies, acceptance rate 5-15%\nA: Hội nghị top-tier, well-known trong lĩnh vực, acceptance rate 15-25%\nB: Hội nghị tốt, solid venues, acceptance rate 25-35%\nC: Hội nghị chấp nhận được, bổ sung cho danh mục, acceptance rate 35-50%',
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
          'Bước 1 – Bóc tách cách người khác trả lời câu hỏi: Trong LR, mỗi bài dùng cách tiếp cận nào? Phương pháp cụ thể là gì? Tại sao họ chọn như vậy?',
          'Bước 2 – Ánh xạ câu hỏi của bạn ↔ cách làm trong literature: Câu hỏi bạn thuộc loại nào? Phương pháp nào thường được dùng? Có dùng được không hay cần điều chỉnh?',
          'Bước 3 – Rút gọn còn 1–2 hướng phương pháp khả thi: Dựa trên 4 tiêu chí (Rõ ràng, Khả thi, Gắn câu hỏi, Có điểm dừng), loại bỏ những hướng không khả thi',
          'Bước 4 – Chốt hướng tiếp cận chính (phiên bản của bạn): Viết 1–2 đoạn mô tả phương pháp sẽ dùng, giải thích vì sao phù hợp với câu hỏi và bối cảnh của bạn'
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
          'Test nhanh: Giải thích phương pháp cho mentor và 2–3 người khác. Nếu họ hiểu → đạt.',
          '⚠️ Nếu không trả lời được đồng thời: làm gì – ra kết quả gì – trong bao lâu – để trả lời câu hỏi nào → chưa đạt',
          'Đầu ra cuối cùng: 1 đoạn mô tả hướng tiếp cận + 1 đoạn mô tả phương pháp chính, cùng lý do vì sao chọn'
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
    title: "Thiết kế công cụ & Lập kế hoạch",
    description: "Thiết kế bảng hỏi, kịch bản phỏng vấn và lập kế hoạch thu thập dữ liệu thực tế tại FPTU hoặc doanh nghiệp.",
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
        title: 'Thiết kế công cụ thu thập dữ liệu',
        description: 'Tạo bảng hỏi (questionnaire) hoặc kịch bản phỏng vấn (interview guide) phù hợp.',
        subSteps: [
          'Dùng Likert scale 5-7 điểm cho survey',
          'Thiết kế câu hỏi mở cho phỏng vấn',
          'Thực hiện pilot test với 5-10 người',
          'Revise dựa trên feedback'
        ]
      },
      {
        id: 'step4_g2',
        stepNumber: 2,
        title: 'Lập Gantt Chart và Timeline',
        description: 'Phân chia công việc theo tuần, xác định deadline cho từng milestone.',
        subSteps: [
          'List tất cả tasks cần làm',
          'Estimate thời gian cho mỗi task',
          'Xác định dependencies',
          'Buffer 20% cho unexpected issues'
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
    title: "Phân tích & Trình bày kết quả",
    description: "Phân tích dữ liệu (SPSS, Nvivo), trực quan hóa kết quả và viết báo cáo theo chuẩn format của trường.",
    theme: THEMES.step5,
    deliverables: [
      {
        id: 'step5_d1',
        label: 'Đầu ra 1',
        criteria: ['Tiêu chí 1: Kết quả phân tích thống kê/thematic', 'Tiêu chí 2: Tables và Figures'],
        placeholder: 'Ghi chú về kết quả phân tích...'
      },
      {
        id: 'step5_d2',
        label: 'Đầu ra 2',
        criteria: ['Tiêu chí 1: Discussion section hoàn chỉnh', 'Tiêu chí 2: So sánh với literature'],
        placeholder: 'Ghi chú về phần thảo luận...'
      },
      {
        id: 'step5_d3',
        label: 'Đầu ra 3',
        criteria: ['Tiêu chí 1: Limitations acknowledged', 'Tiêu chí 2: Future research directions'],
        placeholder: 'Ghi chú về hạn chế và hướng mở rộng...'
      }
    ],
    guidance: [
      {
        id: 'step5_g1',
        stepNumber: 1,
        title: 'Phân tích dữ liệu thu được',
        description: 'Sử dụng SPSS/Excel cho định lượng, NVivo/manual coding cho định tính.',
        subSteps: [
          'Clean data trước khi phân tích',
          'Chạy descriptive statistics',
          'Thực hiện hypothesis testing',
          'Interpret kết quả'
        ]
      },
      {
        id: 'step5_g2',
        stepNumber: 2,
        title: 'Trực quan hóa và trình bày theo IMRaD',
        description: 'Tạo charts, tables theo chuẩn APA. Viết Results và Discussion sections.',
        subSteps: [
          'Chọn đúng loại chart cho data',
          'Results: Trình bày KHÔNG giải thích',
          'Discussion: Giải thích ý nghĩa, so với LR',
          'Nêu limitations một cách honest'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'SPSS', description: 'Phân tích thống kê chuyên nghiệp' },
        { label: 'Tableau', description: 'Trực quan hóa dữ liệu' },
        { label: 'PowerBI', description: 'Dashboard và reporting' }
      ],
      tips: [
        'Đừng chỉ report số, hãy explain meaning',
        'Link findings với câu hỏi nghiên cứu',
        'Be honest về limitations'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn phân tích SPSS'
    }
  },
  {
    id: 'step6',
    stepNumber: "06",
    title: "Đạo đức & Chuẩn mực",
    description: "Kiểm tra đạo văn (Turnitin), đảm bảo đạo đức nghiên cứu và chuẩn bị slide bảo vệ trước Hội đồng.",
    theme: THEMES.step6,
    deliverables: [
      {
        id: 'step6_d1',
        label: 'Đầu ra 1',
        criteria: ['Tiêu chí 1: Turnitin report < 20%', 'Tiêu chí 2: Tất cả sources được trích dẫn'],
        placeholder: 'Ghi chú về kết quả Turnitin...'
      },
      {
        id: 'step6_d2',
        label: 'Đầu ra 2',
        criteria: ['Tiêu chí 1: Ethical considerations documented', 'Tiêu chí 2: Consent forms archived'],
        placeholder: 'Ghi chú về ethical compliance...'
      },
      {
        id: 'step6_d3',
        label: 'Đầu ra 3',
        criteria: ['Tiêu chí 1: Slide bảo vệ hoàn chỉnh', 'Tiêu chí 2: Rehearsal completed'],
        placeholder: 'Ghi chú về chuẩn bị defense...'
      }
    ],
    guidance: [
      {
        id: 'step6_g1',
        stepNumber: 1,
        title: 'Kiểm tra đạo văn và ethical compliance',
        description: 'Submit qua Turnitin, review kết quả và fix các issues về trích dẫn.',
        subSteps: [
          'Submit draft qua Turnitin',
          'Review similarity report',
          'Fix quotes chưa có citation',
          'Paraphrase properly (không chỉ đổi từ)'
        ]
      },
      {
        id: 'step6_g2',
        stepNumber: 2,
        title: 'Chuẩn bị bảo vệ trước Hội đồng',
        description: 'Tạo slide presentation, rehearse và chuẩn bị cho Q&A session.',
        subSteps: [
          'Tạo slide 15-20 trang (theo template trường)',
          'Rehearse nhiều lần',
          'Chuẩn bị câu trả lời cho questions thường gặp',
          'Backup slides và laptop'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'Turnitin', description: 'Kiểm tra đạo văn chính thức' },
        { label: 'Grammarly', description: 'Check grammar và clarity' },
        { label: 'Canva/PPT', description: 'Thiết kế slide presentation' }
      ],
      tips: [
        'Turnitin dưới 20% là yêu cầu tối thiểu',
        'Paraphrase = đổi cấu trúc câu, không chỉ đổi từ',
        'Rehearse trước gương hoặc record lại'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Tips bảo vệ Capstone thành công'
    }
  }
];
