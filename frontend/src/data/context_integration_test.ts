export const CONTEXT_INTEGRATION_TEST = {
  name: "Research Context Tunnel Flow",
  description: "Verify data continuity across Steps 1, 2, and 3",
  steps: [
    {
      step: "Step 01: Research Suggestion",
      action: "Open AI Assistant -> Generate -> Select a Topic",
      inputs: {
        major: "Computer Science",
        keywords: "Blockchain IoT"
      },
      outcome: "User clicks 'Chọn đề tài này' on a result (e.g., 'Secure IoT Data with Blockchain').",
      validation: "Modal closes (optional) or Success message appears. Topic is stored in Context."
    },
    {
      step: "Step 02: ResHunter",
      action: "Open ResHunter (Paper Hunter)",
      expectation: "The 'Câu hỏi nghiên cứu' field should NOT be empty.",
      validation: "Field should auto-fill with: 'Secure IoT Data with Blockchain'.",
      subAction: "Search for papers -> Click 'Đánh giá' -> Score -> Click 'Keep' (Giữ lại).",
      subOutcome: "Paper 'Blockchain for Edge Computing' is added to Saved List."
    },
    {
      step: "Step 03: ResBlueprint",
      action: "Open ResBlueprint (Wizard)",
      validation: [
        "Tab 1 (Scope): 'What I WILL DO' list should automatically contain 'Đề tài: Secure IoT Data with Blockchain'.",
        "Tab 2 (Canvas) -> Data Block: 'Source' field should automatically contain 'Tham khảo từ các bài báo: Blockchain for Edge Computing...'."
      ]
    }
  ]
};
