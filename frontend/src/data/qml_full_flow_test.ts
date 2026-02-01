export const QML_FULL_FLOW_TEST = {
  scenario: "End-to-End Research Flow for Quantum Machine Learning",
  userProfile: {
    major: "Artificial Intelligence (AI)",
    interest: "Quantum Machine Learning, QSVM, Financial Fraud Detection"
  },
  
  steps: [
    {
      phase: "Step 01: Ideation (Research Suggestion)",
      actions: [
        "Open 'AI Assistant' (Research Suggestion Modal).",
        "Enter Major: 'Artificial Intelligence'.",
        "Enter Keywords: 'Quantum Machine Learning, Credit Card Fraud'.",
        "Click 'Tạo 5 đề tài gợi ý'.",
        "Wait for results...",
        "Select the topic: 'Benchmarking Quantum Support Vector Machines (QSVM) for Imbalanced Credit Card Fraud Detection'."
      ],
      expectedResult: [
        "Button 'Chọn đề tài này' turns green ('Đang chọn').",
        "Topic title and description are saved to Research Context."
      ]
    },
    {
      phase: "Step 02: Literature Search (ResHunter)",
      actions: [
        "Open 'ResHunter' (Paper Hunter).",
        "Check the 'Câu hỏi nghiên cứu' (Research Question) field."
      ],
      expectedResult: [
        "Field should AUTO-FILL with: 'Benchmarking Quantum Support Vector Machines (QSVM) for Imbalanced Credit Card Fraud Detection'.",
        "No need to re-type."
      ],
      subActions: [
        "Click 'Tạo Query' -> Generate Query -> Click 'Search'.",
        "Find a relevant paper, e.g., 'Quantum Kernel Methods for Fraud Detection'.",
        "Click 'Đánh giá' -> Score it -> Choose Decision: 'Keep' (Giữ lại)."
      ],
      subExpectedResult: [
        "Paper is added to the 'Đã đánh giá' tab.",
        "Paper is saved to Research Context."
      ]
    },
    {
      phase: "Step 03: Methodology Design (ResBlueprint)",
      actions: [
        "Open 'ResBlueprint' (Wizard).",
        "Check '1. Phạm vi (Scope)' tab.",
        "Check '2. Methodology Canvas' -> 'Data' block."
      ],
      expectedResult: [
        "Scope > What I WILL DO: Should contain 'Đề tài: Benchmarking Quantum Support Vector Machines...'",
        "Canvas > Data > Source: Should contain 'Tham khảo từ các bài báo: Quantum Kernel Methods for Fraud Detection...'."
      ]
    }
  ]
};
