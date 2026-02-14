
export interface AnalysisResult {
  ingredients: {
    identified: string[];
    visualEvidence: string;
  };
  claim: string;
  realityCheck: {
    traditionalPerspective: string;
    modernScientificView: string;
    theGap: string;
  };
  verdict: {
    safetyRating: 'SAFE' | 'USE CAUTION' | 'DANGEROUS';
    riskLevel: string;
  };
  multilingualSummary: {
    english: string;
    local: string;
  };
  groundingSources?: { title: string; uri: string }[];
}

export enum SafetyColor {
  SAFE = 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'USE CAUTION' = 'bg-amber-100 text-amber-800 border-amber-200',
  DANGEROUS = 'bg-rose-100 text-rose-800 border-rose-200',
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}
