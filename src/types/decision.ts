export type AnalysisMethod = 'pros-cons' | 'comparative' | 'swot';

export type ImpactLevel = 'baixo' | 'medio' | 'alto';

export interface WeightedItem {
  id: string;
  text: string;
  weight: number; // 1 to 5
  notes?: string;
}

export interface ProsConsData {
  targetOptionName?: string;
  pros: WeightedItem[];
  cons: WeightedItem[];
}

export interface ComparativeOption {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface ComparativeCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5 (or 10)
  description?: string;
}

export interface ComparativeData {
  options: ComparativeOption[];
  criteria: ComparativeCriterion[];
  // scores[optionId][criterionId] = 1..10
  scores: Record<string, Record<string, number>>;
}

export interface SwotItem {
  id: string;
  text: string;
  impact: ImpactLevel;
  notes?: string;
}

export interface SwotData {
  strengths: SwotItem[];      // Forças (Interno Positivo)
  weaknesses: SwotItem[];     // Fraquezas (Interno Negativo)
  opportunities: SwotItem[];  // Oportunidades (Externo Positivo)
  threats: SwotItem[];        // Ameaças (Externo Negativo)
}

export interface Dilemma {
  id: string;
  title: string;
  description: string;
  category: 'carreira' | 'financas' | 'negocios' | 'pessoal' | 'estudos' | 'outro';
  status: 'em_analise' | 'decidido' | 'arquivado';
  activeMethod: AnalysisMethod;
  prosCons: ProsConsData;
  comparative: ComparativeData;
  swot: SwotData;
  finalDecision?: string;
  finalNotes?: string;
  createdAt: number;
  updatedAt: number;
}
