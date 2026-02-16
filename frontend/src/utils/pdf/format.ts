export const safeHostname = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    const normalized = url.trim().replace(/^https?:\/\//i, '');
    return normalized.split('/')[0] || 'unknown-source';
  }
};

export const clipText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
};

export const formatDateVi = (date: Date): string =>
  date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const similarityLabel = (score: number): string => {
  if (score <= 0) return 'No Match';
  if (score <= 24) return 'Low';
  if (score <= 49) return 'Moderate';
  if (score <= 74) return 'High';
  return 'Very High';
};

export const confidenceLabel = (value: string | undefined): string => {
  if (!value) return 'Unknown';
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'low') return 'Low';
  return 'Unknown';
};

export const matchGroupLabel = (groupType: string): string => {
  switch (groupType) {
    case 'cited_and_quoted':
      return 'Properly Cited & Quoted';
    case 'missing_quotations':
      return 'Missing Quotations';
    case 'missing_citation':
      return 'Missing Citation';
    case 'not_cited_or_quoted':
      return 'No Citation / No Quotes';
    default:
      return groupType;
  }
};
