import { THEMES } from '../constants';
import { StepFullData } from '../types';

export const STEP_0_DATA: StepFullData = {
  id: 'step0',
  stepNumber: '0',
  title: 'Bước 0: Khởi Động - Đừng Để "Ngợp" Ngay Vòng Gửi Xe',
  description:
    'Có một hiểu lầm cực kỳ tai hại là: "Phải đọc sạch đống tài liệu này mới bắt đầu làm được". Tin mình đi, bạn sẽ không bao giờ đọc hết được đâu! Bước 0 không bắt bạn phải biến thành chuyên gia ngay lập tức. Nó đơn giản là lúc bạn tự vẽ cho mình một cái "vùng an toàn" để không bị lạc giữa rừng thông tin.',
  theme: THEMES.step1,
  deliverables: [
    {
      id: 'step0_d1',
      label: 'Keyword cốt lõi',
      criteria: [
        'Liệt kê 5-10 từ khóa cốt lõi của ngành',
        'Mỗi từ khóa có mô tả ngắn 1 dòng để tự nhớ',
        'Nhìn thấy từ khóa là nhận ra ngay bối cảnh sử dụng',
      ],
      placeholder: 'Ghi danh sách keyword cốt lõi bạn cần nắm...',
    },
    {
      id: 'step0_d2',
      label: 'Gu lập luận của ngành',
      criteria: [
        'Xác định ngành thiên về dữ liệu số hay dữ liệu định tính',
        'Nêu cách chứng minh phổ biến của ngành',
        'Biết cách đọc tài liệu đúng trọng tâm',
      ],
      placeholder: 'Ghi lại gu lập luận đặc trưng của ngành bạn...',
    },
    {
      id: 'step0_d3',
      label: 'Bản đồ tài liệu khởi động',
      criteria: [
        'Tìm được 1-2 bài review hoặc công trình nền tảng',
        'Nhận diện khoảng đã nghiên cứu nhiều và khoảng trống',
        'Có danh sách tài liệu mở đầu để đọc có chủ đích',
      ],
      placeholder: 'Ghi lại review paper và công trình nền tảng bạn chọn...',
    },
    {
      id: 'step0_d4',
      label: 'Minimum Viable Skill checklist',
      criteria: [
        'Xác định kỹ năng tối thiểu cần có để đọc 1 paper không ngợp',
        'Liệt kê X, Y cần học thêm theo mức ưu tiên',
        'Chuyển nỗi sợ thành checklist hành động cụ thể',
      ],
      placeholder: 'Ghi checklist kỹ năng tối thiểu bạn cần bổ sung...',
    },
  ],
  guidance: [
    {
      id: 'step0_g0',
      stepNumber: 1,
      title: 'Tư duy đúng trước khi bắt đầu',
      description:
        'Có một hiểu lầm cực kỳ tai hại là: "Phải đọc sạch đống tài liệu này mới bắt đầu làm được". Tin mình đi, bạn sẽ không bao giờ đọc hết được đâu! Bước 0 không bắt bạn phải biến thành chuyên gia ngay lập tức. Nó đơn giản là lúc bạn tự vẽ cho mình một cái "vùng an toàn" để không bị lạc giữa rừng thông tin. Thay vì cắm đầu vào đọc, hãy thử "soi" ngành mình định dấn thân qua 4 góc nhìn.',
      subSteps: [
        'WARNING|Không cần đọc sạch!|Thay vì cắm đầu vào đọc hết tài liệu, hãy "soi" ngành qua 4 góc nhìn để tạo vùng an toàn cho chính mình.',
        'ANGLE|🔑|Keyword cốt lõi|Những từ khóa "chủ đạo" mà mọi paper trong ngành đều dùng - nhận ra chúng là bạn đã thắng nửa trận.',
        'ANGLE|⚖️|Gu lập luận ngành|Ngành bạn thiên về số liệu (data) hay quan điểm (argument)? Biết "gu" này giúp đọc đúng trọng tâm.',
        'ANGLE|🗺️|Bản đồ tài liệu|Tìm "lối tắt" từ review papers và công trình nền tảng - đừng đọc tràn lan!',
        'ANGLE|🎒|Minimum Viable Skill|Xác định kỹ năng tối thiểu cần có để không bị "ngợp" khi đọc paper.'
      ],
    },
    {
      id: 'step0_g1',
      stepNumber: 2,
      title: '"Keyword" nào đang làm chủ cuộc chơi?',
      description:
        'Mỗi ngành có một bộ "mật mã" riêng. Thay vì học vẹt cả cuốn giáo trình, hãy nhặt ra 5-10 từ khóa cốt lõi mà bài báo nào cũng nhắc đi nhắc lại. Nếu coi nghiên cứu là một trận game, thì đây chính là các phím điều hướng cơ bản. Bạn chưa cần hiểu sâu, nhưng ít nhất khi thấy nó, bạn phải biết nó là "người quen" chứ không phải "người lạ".',
      subSteps: [
        'KEYWORD|🎮| NGHIÊN CỨU = GAME|Think of research like a video game! Mỗi ngành có bộ "phím điều khiển" riêng - nhận ra chúng là biết chơi!',
        'KEYWORD|🔑| TỪ KHÓA CỐT LÕI|Giống như tìm chìa khóa mở cửa - nhặt 5-10 từ khóa mà paper nào cũng dùng, bạn sẽ mở được mọi cánh cửa!',
        'KEYWORD|👤| GẶP LẠI BẠN CŨ|Khi đọc paper và thấy keyword đã biết = như gặp lại bạn cũ! Bạn sẽ tự tin hơn nhiều vì đã "nhận ra" chúng từ trước.',
        'KEYWORD|📚| CHƯA CẦN HIỂU SÂU|Giống như nhìn bản đồ trước khi đi - chỉ cần biết đường đi, không cần nhớ từng góc phố!'
      ],
    },
    {
      id: 'step0_g2',
      stepNumber: 3,
      title: '"Gu" lập luận ở đây là gì?',
      description:
        'Mỗi lĩnh vực lại có một "nết" riêng khi chứng minh vấn đề: Mấy ông kỹ thuật/tự nhiên thì chỉ tin vào con số, thí nghiệm, mô hình. Team xã hội/kinh tế thì lại thích soi khảo sát, phỏng vấn, hoặc dữ liệu lịch sử. Biết được "gu" của ngành sẽ giúp bạn không bị "lệch tông" và biết cách đọc tài liệu sao cho đúng trọng tâm.',
      subSteps: [
        'DETECTIVE|🕵️| THÁM TỬ KHOA HỌC|Giống như thám tử tìm bằng chứng - ngành kỹ thuật/tự nhiên chỉ tin vào CON SỐ có thể đo lường, thí nghiệm có thể reproduce, và mô hình có thể verify!',
        'DETECTIVE|📊| THÁM TỬ XÃ HỘI|Giống như thám tử phỏng vấn nhân chứng - ngành xã hội/kinh tế tin vào KHẢO SÁT thực tế, PHỎNG VẤN chuyên gia, và LỊCH SỬ dữ liệu có thể phân tích!',
        'DETECTIVE|⚖️|️ ĐỪNG "LỆCH TÔNG"|Biết "gu" ngành giúp bạn không đọc paper kinh tế như paper IT - mỗi ngành có cách chứng minh riêng, đọc đúng cách mới hiểu được!',
        'DETECTIVE|🎯| ĐỌC ĐÚNG TRỌNG TÂM|Biết ngành thiên về số liệu hay quan điểm = biết nên tập trung vào phần nào của paper, không bị "ngợp" vì thông tin không liên quan!'
      ],
    },
    {
      id: 'step0_g3',
      stepNumber: 4,
      title: 'Tìm "lối tắt" từ những người đi trước',
      description:
        'Đừng đọc tràn lan, mệt lắm! Hãy săn tìm 1-2 bài Review (tổng quan) mới nhất hoặc mấy công trình "huyền thoại" mà ai cũng phải trích dẫn. Những bài này như một bản đồ tổng thể, nó chỉ thẳng cho bạn thấy: "Chỗ này người ta làm nát rồi, còn chỗ kia vẫn tối thui, vào đó mà khai phá".',
      subSteps: [
        'MAP|🏆| REVIEW PAPERS MỚI NHẤT|Giống như tìm bản đồ kho báu - review papers tổng hợp toàn ngành trong 1 bài, cập nhật nhất! Đọc 1 review = Đọc 100 paper!',
        'MAP|🌟| CÔNG TRÌNH "HUYỀN THOẠI|Giống như tìm kho báu đã được đánh dấu - công trình nền tảng mà ai cũng phải trích dẫn, đọc 1 lần = hiểu cả lịch sử ngành!',
        'MAP|🎯| KHAI PHÁ VÙNG TỐI|Giống như đọc bản đồ để biết đâu đã khai thác, đâu còn nguyên sơ - review papers chỉ cho bạn thấy: "Vùng này đã đầy, vùng kia còn trống - vào đó mà nghiên cứu!"',
        'MAP|📍| ĐỪNG ĐỌC TRÀN LAN|Giống như đi tàu mà không có bản đồ - sẽ lạc giữa rừng paper! Có review = Có GPS, biết đường đi đâu!'
      ],
    },
    {
      id: 'step0_g4',
      stepNumber: 5,
      title: 'Món đồ "vắt vai" tối thiểu',
      description:
        'Để bơi được trong ngành này, bạn cần gì? Biết code một chút? Giỏi xác suất thống kê? Hay đơn giản là đọc hiểu tiếng Anh chuyên ngành mà không phải kè kè cái từ điển? Hãy xác định mức kỹ năng vừa đủ (Minimum Viable Skill) để bạn có thể đọc xong một bài báo mà không thấy "sang chấn tâm lý".',
      subSteps: [
        'Góc nhỏ từ ResMap: Thay vì ngồi tự trách "sao mình chưa đủ giỏi", hãy dùng Bước 0 để lên một cái checklist: "Mình cần học thêm X, cần biết thêm Y". Khi bạn gọi tên được cái mình thiếu, nỗi sợ sẽ biến mất.',
        'ResMap ở đây để giúp bạn định vị sớm những "món đồ" này. Bạn sẽ luôn ở thế chủ động, thay vì cứ mãi loay hoay với cảm giác "mình vẫn chưa sẵn sàng".',
      ],
    },
  ],
  support: {
    tools: [
      {
        label: 'ResMap',
        description: 'Định vị từ khóa, kỹ năng nền và hướng đọc tài liệu khởi động',
      },
    ],
    tips: [
      'Không cần đọc sạch trước khi bắt đầu - chỉ cần đủ để định hướng',
      'Ưu tiên checklist hành động thay vì tự đánh giá năng lực mơ hồ',
      'Luôn xác định rõ phần nào đã bão hòa, phần nào còn khoảng trống',
    ],
  },
};
