# Match Groups Implementation Plan

## Overview
Implement Turnitin-style Match Groups - categorize similarity matches into 4 groups based on citation and quotation status.

## Match Groups Categories

| Group | Criteria | Color | Description |
|-------|----------|-------|-------------|
| **Not Cited or Quoted** | No citation + No quotes | 🔴 Red | Potential plagiarism - needs citation |
| **Missing Quotations** | Has citation + No quotes | 🟠 Orange | Exact match - needs quotes |
| **Missing Citation** | No citation + Has quotes | 🟡 Yellow | Quote without citation |
| **Cited and Quoted** | Has citation + Has quotes | 🟢 Green | Properly cited |

## Technical Implementation

### Backend

#### Detection Logic
1. **Citation Detection**: Regex patterns for:
   - `(Author, Year)` - APA style
   - `[1]` - IEEE/Vancouver
   - `¹²³` - Superscript numbers
   - `Nguyen et al., 2020` - Multiple authors
   - Vietnamese: `(Tác giả, 2020)`

2. **Quotation Detection**: 
   - `"text in quotes"`
   - «text»
   - 『text』

3. **Categorization per sentence**:
   ```
   if has_citation AND has_quotes -> Cited and Quoted
   if has_citation AND NOT has_quotes -> Missing Quotations
   if NOT has_citation AND has_quotes -> Missing Citation
   if NOT has_citation AND NOT has_quotes -> Not Cited or Quoted
   ```

#### Data Model
```python
class MatchGroup(BaseModel):
    group_type: str  # "not_cited_or_quoted", "missing_quotations", "missing_citation", "cited_and_quoted"
    count: int  # Number of sentences/matches in this group
    percentage: float  # Percentage of total matches
    sample_matches: List[str]  # Sample sentences for display

class ReportV2(BaseModel):
    # ... existing fields
    match_groups: Optional[List[MatchGroup]] = []
```

### Frontend

#### UI Components
1. **Match Groups Summary** - 4 colored cards showing counts/percentages
2. **Filter Toggle** - Show/hide each group
3. **Color Legend** - Explain what each color means

#### Visual Design
- Use Turnitin-inspired colors: Red, Orange, Yellow, Green
- Each group expandable to show sample matches
- Toggle to filter results by group

## Implementation Tasks

### Task 1: Backend - Citation Detection
- Add citation regex patterns
- Add quotation detection
- Implement categorization logic

### Task 2: Backend - Match Groups Data
- Add MatchGroup model to schema
- Aggregate matches into groups
- Include in report_v2 response

### Task 3: Frontend - UI
- Add Match Groups summary cards
- Add filter toggles
- Add color legend

### Task 4: Tests
- Test citation detection patterns
- Test quotation detection
- Test categorization edge cases
- Test UI rendering

## Acceptance Criteria
- [ ] Each sentence is categorized into exactly one group
- [ ] Counts sum to total matches
- [ ] Frontend displays all 4 groups with correct colors
- [ ] Filters work correctly
- [ ] Tests pass

## References
- Turnitin Match Groups: https://guides.turnitin.com/hc/en-us/articles/27395528629517-Navigating-the-new-enhanced-Similarity-Report
