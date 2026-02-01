export const BLUEPRINT_TEST_CASE = {
  scenario: "IT Student researching 'Applying Transformers for Medical Image Segmentation'",
  steps: [
    {
      action: "Open Wizard",
      expected: "Modal opens with '1. Phạm vi (Scope)' tab active."
    },
    {
      action: "Add 'What I WILL DO'",
      input: "Use VinDr-CXR dataset for lung anomaly detection",
      expected: "Item appears in green list with bullet point."
    },
    {
      action: "Add 'What I WON'T DO'",
      input: "No real-time deployment on edge devices",
      expected: "Item appears in red list with 'x' mark."
    },
    {
      action: "Switch to 'Methodology Canvas'",
      expected: "Flowchart with 6 blocks appears (Data -> Analysis)."
    },
    {
      action: "Click 'Data' block",
      expected: "Drawer opens. Title 'Data / Input'. Hint mentions 'VinDr-CXR'."
    },
    {
      action: "Fill 'Source' field in Data block",
      input: "VinDr-CXR (public), 18000 images",
      expected: "Field updates. If all fields filled, block turns green/blue in overview."
    },
    {
      action: "Switch to 'Export'",
      expected: "A4 preview shows 'Research Scope' lists and 'Methodology Pipeline' table."
    }
  ]
};
