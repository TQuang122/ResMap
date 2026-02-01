export const SMART_SEARCH_TEST = {
  name: "Unified Smart Search UX Test",
  steps: [
    {
      action: "Open ResHunter (Paper Hunter)",
      expectation: "Header should show Search Input + Year Filters. NO 'Tạo Query' tab."
    },
    {
      action: "Enter a topic (e.g., 'Transformer for Time Series')",
      expectation: "Click 'Gợi ý từ khóa AI' button (or it auto-triggers if context exists)."
    },
    {
      action: "Observe AI Suggestions",
      expectation: "Chips appear below input: 'Best Match' (Indigo), Keywords (Grey), Synonyms (White)."
    },
    {
      action: "Click on 'Best Match' chip",
      expectation: "Search results below update immediately. No tab switching required."
    }
  ]
};
