import { Dilemma } from '../types/decision';
import { DEFAULT_DILEMMA } from '../data/templates';

const STORAGE_KEY = 'desempate_dilemmas_v1';
const ACTIVE_ID_KEY = 'desempate_active_id_v1';

export function getSavedDilemmas(): Dilemma[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDilemmas([DEFAULT_DILEMMA]);
      return [DEFAULT_DILEMMA];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [DEFAULT_DILEMMA];
  } catch (e) {
    console.error('Erro ao ler dilemmas do localStorage:', e);
    return [DEFAULT_DILEMMA];
  }
}

export function saveDilemmas(dilemmas: Dilemma[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dilemmas));
  } catch (e) {
    console.error('Erro ao salvar no localStorage:', e);
  }
}

export function getActiveDilemmaId(all: Dilemma[]): string {
  try {
    const saved = localStorage.getItem(ACTIVE_ID_KEY);
    if (saved && all.some(d => d.id === saved)) {
      return saved;
    }
  } catch {
    // fallback
  }
  return all[0]?.id || DEFAULT_DILEMMA.id;
}

export function setActiveDilemmaId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function generateExportMarkdown(dilemma: Dilemma): string {
  const dateStr = new Date(dilemma.updatedAt).toLocaleDateString('pt-BR');
  
  let md = `# Relatório de Desempate: ${dilemma.title}\n`;
  md += `**Data da análise:** ${dateStr} | **Status:** ${dilemma.status === 'decidido' ? '✅ Decidido' : '🔍 Em Análise'}\n\n`;
  
  if (dilemma.description) {
    md += `### Contexto do Dilema\n${dilemma.description}\n\n`;
  }

  // Prós e Contras
  const prosSum = dilemma.prosCons.pros.reduce((acc, p) => acc + p.weight, 0);
  const consSum = dilemma.prosCons.cons.reduce((acc, c) => acc + c.weight, 0);
  const netProsCons = prosSum - consSum;

  md += `## 1. Análise de Prós e Contras (${dilemma.prosCons.targetOptionName || 'Opção em Avaliação'})\n`;
  md += `> **Pontuação Ponderada:** Prós: ${prosSum} pts | Contras: ${consSum} pts | **Saldo:** ${netProsCons > 0 ? '+' : ''}${netProsCons} pts\n\n`;
  
  md += `### ✅ Prós (Pontos Favoráveis)\n`;
  if (dilemma.prosCons.pros.length === 0) {
    md += `- Nenhum pró cadastrado.\n`;
  } else {
    dilemma.prosCons.pros.forEach(p => {
      md += `- **[Peso ${p.weight}/5]** ${p.text}\n`;
    });
  }

  md += `\n### ❌ Contras (Pontos Desfavoráveis)\n`;
  if (dilemma.prosCons.cons.length === 0) {
    md += `- Nenhum contra cadastrado.\n`;
  } else {
    dilemma.prosCons.cons.forEach(c => {
      md += `- **[Peso ${c.weight}/5]** ${c.text}\n`;
    });
  }

  // Tabela Comparativa
  md += `\n## 2. Matriz de Decisão Comparativa\n`;
  const optionsWithScores = dilemma.comparative.options.map(opt => {
    let totalScore = 0;
    let maxPossible = 0;
    dilemma.comparative.criteria.forEach(crit => {
      const score = dilemma.comparative.scores[opt.id]?.[crit.id] ?? 0;
      totalScore += score * crit.weight;
      maxPossible += 10 * crit.weight;
    });
    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    return { ...opt, totalScore, percentage };
  }).sort((a, b) => b.totalScore - a.totalScore);

  md += `| Alternativa | Nota Ponderada | Aproveitamento | Descrição |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  optionsWithScores.forEach((opt, idx) => {
    const medal = idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : '';
    md += `| ${medal}${opt.name} | **${opt.totalScore} pts** | ${opt.percentage}% | ${opt.description || '-'} |\n`;
  });

  md += `\n### Detalhamento por Critério:\n`;
  dilemma.comparative.criteria.forEach(crit => {
    md += `\n**${crit.name} (Peso: ${crit.weight}/5)**:\n`;
    dilemma.comparative.options.forEach(opt => {
      const score = dilemma.comparative.scores[opt.id]?.[crit.id] ?? 0;
      md += `- ${opt.name}: nota ${score}/10\n`;
    });
  });

  // SWOT
  md += `\n## 3. Análise SWOT (FOFA)\n`;
  md += `### 🛡️ Forças (Interno)\n`;
  dilemma.swot.strengths.forEach(s => md += `- [${s.impact.toUpperCase()}] ${s.text}\n`);
  if (dilemma.swot.strengths.length === 0) md += `- Nenhuma força listada.\n`;

  md += `\n### ⚠️ Fraquezas (Interno)\n`;
  dilemma.swot.weaknesses.forEach(w => md += `- [${w.impact.toUpperCase()}] ${w.text}\n`);
  if (dilemma.swot.weaknesses.length === 0) md += `- Nenhuma fraqueza listada.\n`;

  md += `\n### 🚀 Oportunidades (Externo)\n`;
  dilemma.swot.opportunities.forEach(o => md += `- [${o.impact.toUpperCase()}] ${o.text}\n`);
  if (dilemma.swot.opportunities.length === 0) md += `- Nenhuma oportunidade listada.\n`;

  md += `\n### 🌪️ Ameaças (Externo)\n`;
  dilemma.swot.threats.forEach(t => md += `- [${t.impact.toUpperCase()}] ${t.text}\n`);
  if (dilemma.swot.threats.length === 0) md += `- Nenhuma ameaça listada.\n`;

  if (dilemma.finalNotes) {
    md += `\n## Veredito & Decisão Final\n`;
    md += `${dilemma.finalNotes}\n`;
  }

  md += `\n---\n*Gerado pelo Desempate — Ferramenta para tomada de decisões estruturadas.*`;
  return md;
}
