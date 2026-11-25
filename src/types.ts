export type InputMode = 'paste' | 'screenshot' | 'link';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RescueSituation = 'talking' | 'money' | 'photos' | null;

export interface FlaggedPhrase {
  quote: string;
  tactic: string;
  margin_note: string;
}

export interface SugaredVsRaw {
  sweet_line: string;
  hidden_meaning: string;
}

export interface CheckResult {
  sweetener_score: number;
  verdict_headline: string;
  costar_roast: string;
  bestie_note: string;
  flagged_phrases: FlaggedPhrase[];
  sugared_vs_raw: SugaredVsRaw[];
  risk_level: RiskLevel;
  source?: 'gemini' | 'local';
}

export interface SampleTrap {
  id: string;
  label: string;
  subtitle: string;
  mode: InputMode;
  content: string;
}
