import { THEMES } from '../constants';
import { StepFullData, DeliverableItem, GuidanceItem, SupportData } from '../types';

// Re-export for backward compatibility
export type StepInfo = StepFullData;

export const STEPS_DATA: StepFullData[] = [
  {
    id: 'step1',
    stepNumber: "01",
    title: "Chọn vấn đề & Câu hỏi nghiên cứu",
    description: "Xác định đề tài Capstone/ResFes khả thi, được Mentor phê duyệt và phù hợp với chuyên ngành.",
    theme: THEMES.step1,
    deliverables: [
      {
        id: 'step1_d1',
        label: 'Đầu ra 1',
        criteria: ['Tiêu chí 1: Tên đề tài sơ bộ', 'Tiêu chí 2: Câu hỏi nghiên cứu chính'],
        placeholder: 'Ghi chú ngắn gọn về đề tài bạn chọn, các ý tưởng ban đầu...'
      },
      {
        id: 'step1_d2',
        label: 'Đầu ra 2',
        criteria: ['Tiêu chí 1: Các câu hỏi phụ', 'Tiêu chí 2: Phạm vi nghiên cứu'],
        placeholder: 'Ghi chú về câu hỏi phụ và phạm vi...'
      },
      {
        id: 'step1_d3',
        label: 'Đầu ra 3',
        criteria: ['Tiêu chí 1: Mục tiêu tổng quát', 'Tiêu chí 2: Mục tiêu cụ thể'],
        placeholder: 'Ghi chú về mục tiêu nghiên cứu...'
      }
    ],
    guidance: [
      {
        id: 'step1_g1',
        stepNumber: 1,
        title: 'Chọn 1-3 chủ đề bạn thật sự tò mò',
        description: 'Cả nhóm cần thể chí hiểu 1 chủ đề nghiên cứu của bạn từ đầu. Quan sát các hiện tượng xảy ra xung quanh mình. Liên hệ chương trình giảng viên, cựu sinh viên tại FPTU. Chia sẻ với người đi trước nếu chủ đề nhiều về sở thích riêng của bạn. Sử dụng ResMap / Research Explorer để xem người nghiên cứu xưa đã viết nhiều về vấn đề nào và xem liệu bạn có góc nhìn mới để trả lời hơn không.',
        subSteps: [
          'Dùng ResMap / Research Explorer để xem xu hướng (đang nghiên cứu)',
          'Tham khảo Capstone gần nhất của chuyên ngành',
          'Cân bằng tò mò cá nhân vs. giá trị học thuật',
          'Nên thảo luận với leader/mentor không quá 3 ngày'
        ]
      },
      {
        id: 'step1_g2',
        stepNumber: 2,
        title: 'Chuyển chủ đề → Câu hỏi / bài toán nghiên cứu',
        description: 'Đọc abstract của 3-5 bài về cùng chủ đề để xác định gap. Dùng template: "Mặc dù [vấn đề đã biết], vẫn chưa rõ [câu hỏi chưa được giải đáp]" để tìm lỗ hổng nghiên cứu.',
        subSteps: [
          'Tìm 3-5 abstract liên quan trên Google Scholar',
          'Xác định khoảng trống (research gap)',
          'Đặt câu hỏi theo format FINER'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'Research Explorer', description: 'Công cụ của ResMap (Bước 1: Tìm placeholder về câu hỏi nghiên cứu)' },
        { label: 'Check dẫn nguồn', description: 'Bước 6 - Kiểm tra nguồn trích dẫn' }
      ],
      tips: [
        'Nếu có clip ngắn liên quan tới bước này có sẵn, bạn sẽ thấy nút "Watch how others have done it before"',
        'Ấn vào sẽ hiển thị overlay với embed video phỏng vấn'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn chọn đề tài nghiên cứu'
    }
  },
  {
    id: 'step2',
    stepNumber: "02",
    title: "Tìm & Sàng lọc tài liệu (LR)",
    description: "Xây dựng cơ sở lý thuyết (Literature Review) từ các nguồn uy tín (IEEE, ScienceDirect) để tìm Research Gap.",
    theme: THEMES.step2,
    deliverables: [
      {
        id: 'step2_d1',
        label: 'Đầu ra 1',
        criteria: ['Tiêu chí 1: Danh sách 10-20 bài báo chất lượng', 'Tiêu chí 2: Bảng tổng hợp LR'],
        placeholder: 'Ghi chú các nguồn tài liệu đã tìm được...'
      },
      {
        id: 'step2_d2',
        label: 'Đầu ra 2',
        criteria: ['Tiêu chí 1: Research Gap được xác định', 'Tiêu chí 2: Khung lý thuyết sơ bộ'],
        placeholder: 'Ghi chú về gap và khung lý thuyết...'
      },
      {
        id: 'step2_d3',
        label: 'Đầu ra 3',
        criteria: ['Tiêu chí 1: File Mendeley/Zotero được setup', 'Tiêu chí 2: Trích dẫn theo chuẩn APA'],
        placeholder: 'Ghi chú về công cụ quản lý tài liệu...'
      }
    ],
    guidance: [
      {
        id: 'step2_g1',
        stepNumber: 1,
        title: 'Tìm kiếm trên các nguồn uy tín',
        description: 'Sử dụng IEEE Xplore, ScienceDirect, Google Scholar, Scopus để tìm các bài báo liên quan đến chủ đề nghiên cứu.',
        subSteps: [
          'Xác định keywords từ câu hỏi nghiên cứu',
          'Sử dụng Boolean operators (AND, OR, NOT)',
          'Lọc theo năm xuất bản (ưu tiên 5 năm gần nhất)',
          'Đọc abstract trước, full paper sau'
        ]
      },
      {
        id: 'step2_g2',
        stepNumber: 2,
        title: 'Tổng hợp và quản lý tài liệu',
        description: 'Sử dụng Mendeley hoặc Zotero để lưu trữ, gắn tag và tạo trích dẫn tự động.',
        subSteps: [
          'Import PDF vào Mendeley/Zotero',
          'Tạo folder theo chủ đề',
          'Highlight và note các điểm quan trọng',
          'Export bibliography theo chuẩn APA/IEEE'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'IEEE Xplore', description: 'Cơ sở dữ liệu khoa học kỹ thuật' },
        { label: 'Google Scholar', description: 'Tìm kiếm học thuật miễn phí' },
        { label: 'Mendeley', description: 'Quản lý tài liệu tham khảo' }
      ],
      tips: [
        'Đọc abstract trước để tiết kiệm thời gian',
        'Ưu tiên bài có số citation cao',
        'Sử dụng "Cited by" để tìm bài liên quan mới hơn'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn Literature Review'
    }
  },
  {
    id: 'step3',
    stepNumber: "03",
    title: "Xây dựng hướng tiếp cận & Phương pháp nghiên cứu",
    description: "Chọn cách tiếp cận phù hợp với câu hỏi nghiên cứu, xác định thiết kế và phương pháp để đảm bảo dữ liệu thu được có giá trị.",
    theme: THEMES.step3,
    deliverables: [
      {
        id: 'step3_d1',
        label: 'Đầu ra 1',
        criteria: ['Tiêu chí 1: Loại nghiên cứu (Định lượng/Định tính/Hỗn hợp)', 'Tiêu chí 2: Justification'],
        placeholder: 'Ghi chú lý do chọn phương pháp...'
      },
      {
        id: 'step3_d2',
        label: 'Đầu ra 2',
        criteria: ['Tiêu chí 1: Quần thể và mẫu nghiên cứu', 'Tiêu chí 2: Phương pháp lấy mẫu'],
        placeholder: 'Ghi chú về sampling...'
      },
      {
        id: 'step3_d3',
        label: 'Đầu ra 3',
        criteria: ['Tiêu chí 1: Công cụ phân tích dự kiến', 'Tiêu chí 2: Biến số nghiên cứu'],
        placeholder: 'Ghi chú về công cụ và biến số...'
      }
    ],
    guidance: [
      {
        id: 'step3_g1',
        stepNumber: 1,
        title: 'Xác định loại nghiên cứu phù hợp',
        description: 'Định lượng (khảo sát, thí nghiệm) vs Định tính (phỏng vấn, case study) - tùy thuộc vào câu hỏi nghiên cứu.',
        subSteps: [
          'Nếu cần đo lường, thống kê → Định lượng',
          'Nếu cần hiểu sâu, khám phá → Định tính',
          'Có thể kết hợp (Mixed methods)'
        ]
      },
      {
        id: 'step3_g2',
        stepNumber: 2,
        title: 'Thiết kế Sampling Strategy',
        description: 'Xác định quần thể, kích thước mẫu và phương pháp lấy mẫu phù hợp.',
        subSteps: [
          'Xác định quần thể mục tiêu',
          'Tính sample size (dùng công thức hoặc G*Power)',
          'Chọn sampling method (random, purposive, convenience)'
        ]
      }
    ],
    support: {
      tools: [
        { label: 'SPSS', description: 'Phân tích thống kê định lượng' },
        { label: 'NVivo', description: 'Phân tích dữ liệu định tính' },
        { label: 'G*Power', description: 'Tính sample size' }
      ],
      tips: [
        'Phương pháp phải align với câu hỏi nghiên cứu',
        'Chuẩn bị justify cho Hội đồng tại sao chọn method này',
        'Tham khảo các bài tương tự đã publish'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoTitle: 'Hướng dẫn chọn phương pháp nghiên cứu'
    }
  },
  {
    id: 'step4',
    stepNumber: "04",
    title: "Thiết kế pipeline triển khai nghiên cứu",
    description: "Xây dựng pipeline thực thi: công cụ thu thập dữ liệu, quy trình triển khai, timeline và nguồn lực để đảm bảo tiến độ.",
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
    title: "Triển khai, phân tích, diễn giải (& lặp lại)",
    description: "Thu thập dữ liệu, phân tích và diễn giải kết quả; lặp lại khi cần để tinh chỉnh câu hỏi, phương pháp và kết luận.",
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
    title: "Trình bày, phản biện & hoàn thiện nghiên cứu",
    description: "Hoàn thiện báo cáo, trình bày kết quả, phản biện và chỉnh sửa để đạt chuẩn học thuật và sẵn sàng bảo vệ.",
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
