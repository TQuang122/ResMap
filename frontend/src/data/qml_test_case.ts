export const QML_TEST_CASE = {
  topic: "Comparative Analysis of Quantum SVM (QSVM) vs Classical SVM for Credit Card Fraud Detection",
  
  // Tab 1: Scope Builder
  scope: {
    willDo: [
      "Sử dụng bộ dữ liệu Credit Card Fraud Detection từ Kaggle (đã ẩn danh)",
      "Triển khai Quantum Kernel Estimation (Quantum Kernel Alignment) trên Qiskit",
      "Chạy mô phỏng trên QasmSimulator (không chạy trên máy lượng tử thật)",
      "So sánh hiệu năng với Classical SVM (RBF Kernel)",
      "Sử dụng PCA để giảm chiều dữ liệu xuống 4-8 chiều (để phù hợp với số lượng qubit mô phỏng)"
    ],
    wontDo: [
      "Không chạy trên phần cứng lượng tử thực tế (IBM Quantum Real Hardware) do hàng chờ lâu và nhiễu",
      "Không nghiên cứu Quantum Neural Networks (QNN) hay Variational Quantum Eigensolver (VQE)",
      "Không xử lý vấn đề bảo mật lượng tử (Quantum Security)"
    ]
  },

  // Tab 2: Methodology Canvas
  canvas: {
    data: {
      source: "Kaggle - Credit Card Fraud Detection Dataset",
      size: "284,807 giao dịch (sẽ under-sample xuống còn 1000 mẫu để train QSVM)",
      type: "Dữ liệu dạng bảng (Tabular), Numerical features (V1-V28)"
    },
    preprocessing: {
      cleaning: "Loại bỏ cột 'Time' không quan trọng",
      transformation: "StandardScaler (Normalization) về khoảng [0, 1] hoặc [-1, 1]",
      split: "PCA (Principal Component Analysis) để giảm từ 28 chiều xuống N chiều (N = số qubit, ví dụ 4 hoặc 8). Train/Test split: 80/20"
    },
    method: {
      framework: "Qiskit Machine Learning & Scikit-learn",
      architecture: "Quantum Support Vector Machine (QSVM) sử dụng ZZFeatureMap để mã hóa dữ liệu vào Hilbert Space",
      reasoning: "Tận dụng khả năng tính toán hạt nhân (Kernel trick) của máy tính lượng tử để phân tách dữ liệu phi tuyến tính tốt hơn cổ điển"
    },
    procedure: {
      steps: "1. Mã hóa dữ liệu cổ điển thành trạng thái lượng tử (Feature Map). 2. Tính toán ma trận Kernel lượng tử. 3. Đưa ma trận này vào thuật toán SVM cổ điển để phân lớp.",
      params: "Feature Map: ZZFeatureMap (depth=2). Shots: 1024 (simulation).",
      tools: "Python, Qiskit, Numpy, Scikit-learn"
    },
    evaluation: {
      metrics: "Vì dữ liệu mất cân bằng (Fraud rất ít), dùng: Precision, Recall, F1-Score, và ROC-AUC. Không chỉ dùng Accuracy.",
      baseline: "Classical SVM với RBF Kernel và Polynomial Kernel chạy trên cùng tập dữ liệu đã giảm chiều."
    },
    analysis: {
      errors: "Phân tích xem QSVM có bị overfitting khi số chiều tăng không.",
      insights: "Liệu Quantum Kernel có giúp tách biệt các ca gian lận khó phát hiện (biên mờ) tốt hơn cổ điển không?",
      limitations: "Giới hạn số lượng qubit mô phỏng khiến việc giảm chiều dữ liệu (PCA) làm mất mát thông tin quan trọng."
    }
  }
};
