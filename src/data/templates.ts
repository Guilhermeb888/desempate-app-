import { Dilemma } from '../types/decision';

export const DEFAULT_DILEMMA: Dilemma = {
  id: 'dilemma-default',
  title: 'Aceitar nova proposta de emprego ou continuar na empresa atual?',
  description: 'Recebi uma oferta de trabalho com remuneração 30% maior em regime híbrido, enquanto minha empresa atual oferece estabilidade, equipe integrada e bom ambiente.',
  category: 'carreira',
  status: 'em_analise',
  activeMethod: 'pros-cons',
  prosCons: {
    targetOptionName: 'Aceitar a Nova Proposta',
    pros: [
      { id: 'p1', text: 'Aumento salarial de 30% + pacote de bônus agressivo', weight: 5 },
      { id: 'p2', text: 'Trabalho com tecnologia mais moderna e stack atualizada', weight: 4 },
      { id: 'p3', text: 'Oportunidade de liderar novos projetos desde o início', weight: 4 },
      { id: 'p4', text: 'Auxílio educação e verba anual para congressos', weight: 3 },
    ],
    cons: [
      { id: 'c1', text: 'Período de experiência e adaptação a nova cultura corporativa', weight: 3 },
      { id: 'c2', text: 'Tempo de deslocamento maior nos 2 dias presenciais por semana', weight: 3 },
      { id: 'c3', text: 'Deixar para trás uma rede de contatos e confiança conquistada', weight: 2 },
    ],
  },
  comparative: {
    options: [
      { id: 'opt1', name: 'Nova Proposta (Empresa B)', color: '#3b82f6', description: 'Empresa em expansão acelerada' },
      { id: 'opt2', name: 'Empresa Atual (Empresa A)', color: '#10b981', description: 'Ambiente consolidado e seguro' },
      { id: 'opt3', name: 'Negociar Contraproposta', color: '#8b5cf6', description: 'Tentar alinhar expectativas internamente' },
    ],
    criteria: [
      { id: 'crit1', name: 'Remuneração e Benefícios', weight: 5 },
      { id: 'crit2', name: 'Qualidade de Vida e Equilíbrio', weight: 4 },
      { id: 'crit3', name: 'Potencial de Aprendizado e Carreira', weight: 5 },
      { id: 'crit4', name: 'Segurança e Estabilidade', weight: 3 },
      { id: 'crit5', name: 'Cultura da Equipe e Gestão', weight: 4 },
    ],
    scores: {
      opt1: { crit1: 9, crit2: 6, crit3: 9, crit4: 6, crit5: 7 },
      opt2: { crit1: 6, crit2: 8, crit3: 6, crit4: 9, crit5: 9 },
      opt3: { crit1: 8, crit2: 7, crit3: 7, crit4: 8, crit5: 7 },
    },
  },
  swot: {
    strengths: [
      { id: 's1', text: 'Possuo forte domínio técnico e entregas comprovadas', impact: 'alto' },
      { id: 's2', text: 'Facilidade de comunicação e adaptação rápida a times ágeis', impact: 'alto' },
      { id: 's3', text: 'Reserva financeira de emergência equivalente a 8 meses', impact: 'medio' },
    ],
    weaknesses: [
      { id: 'w1', text: 'Ansiedade em ambientes corporativos de alta pressão', impact: 'alto' },
      { id: 'w2', text: 'Pouca experiência em gestão de conflitos no novo nicho', impact: 'medio' },
    ],
    opportunities: [
      { id: 'o1', text: 'Mercado do setor novo está aquecido com escassez de profissionais', impact: 'alto' },
      { id: 'o2', text: 'Possibilidade de promoção para cargo sênior em 1 ano', impact: 'alto' },
      { id: 'o3', text: 'Expansão de networking internacional na nova empresa', impact: 'medio' },
    ],
    threats: [
      { id: 't1', text: 'Riscos macroeconômicos e cortes no setor tech', impact: 'medio' },
      { id: 't2', text: 'Gestor da nova vaga ainda não foi formalizado (processo de transição)', impact: 'alto' },
    ],
  },
  createdAt: Date.now() - 86400000,
  updatedAt: Date.now(),
};

export const PRESET_TEMPLATES: Array<{
  name: string;
  category: Dilemma['category'];
  badge: string;
  dilemma: Omit<Dilemma, 'id' | 'createdAt' | 'updatedAt'>;
}> = [
  {
    name: 'Carreira: Mudar de Emprego vs Continuar',
    category: 'carreira',
    badge: 'Profissional',
    dilemma: {
      title: 'Aceitar nova proposta de emprego ou continuar na empresa atual?',
      description: 'Análise detalhada ponderando aumento de renda versus previsibilidade e cultura de trabalho.',
      category: 'carreira',
      status: 'em_analise',
      activeMethod: 'pros-cons',
      prosCons: DEFAULT_DILEMMA.prosCons,
      comparative: DEFAULT_DILEMMA.comparative,
      swot: DEFAULT_DILEMMA.swot,
    },
  },
  {
    name: 'Finanças: Comprar Imóvel vs Alugar e Investir',
    category: 'financas',
    badge: 'Finanças Pessoais',
    dilemma: {
      title: 'Comprar imóvel financiado ou morar de aluguel e investir a diferença?',
      description: 'Dilema patrimonial avaliando liquidez, segurança psicológica, juros de financiamento e valorização imobiliária.',
      category: 'financas',
      status: 'em_analise',
      activeMethod: 'comparative',
      prosCons: {
        targetOptionName: 'Comprar Imóvel Próprio',
        pros: [
          { id: 'p1', text: 'Sensação de segurança e patrimônio físico consolidado', weight: 4 },
          { id: 'p2', text: 'Liberdade total para reformas, personalização e pets', weight: 4 },
          { id: 'p3', text: 'Imóvel em bairro com histórico de boa valorização', weight: 3 },
          { id: 'p4', text: 'Proteção contra reajustes anuais de aluguel (IGP-M/IPCA)', weight: 3 },
        ],
        cons: [
          { id: 'c1', text: 'Custo total de juros ao longo de 20 a 30 anos', weight: 5 },
          { id: 'c2', text: 'Falta de liquidez caso precise do dinheiro com urgência', weight: 4 },
          { id: 'c3', text: 'Despesas com ITBI, escritura, reformas e condomínio', weight: 3 },
          { id: 'c4', text: 'Amarra geográfica caso surja oportunidade em outra cidade', weight: 4 },
        ],
      },
      comparative: {
        options: [
          { id: 'opt1', name: 'Comprar Financiado', color: '#0ea5e9', description: 'Entrada de 20% + parcelas de 30 anos' },
          { id: 'opt2', name: 'Alugar e Investir a Diferença', color: '#10b981', description: 'Aluguel enxuto e aporte mensal em renda fixa/FIIs' },
          { id: 'opt3', name: 'Guardar mais 3 anos para comprar à vista/maior entrada', color: '#f59e0b', description: 'Acelerar poupança antes de assumir dívida' },
        ],
        criteria: [
          { id: 'crit1', name: 'Retorno Financeiro a Longo Prazo', weight: 5 },
          { id: 'crit2', name: 'Flexibilidade e Mobilidade', weight: 4 },
          { id: 'crit3', name: 'Paz de Espírito e Conforto Emocional', weight: 4 },
          { id: 'crit4', name: 'Custo de Oportunidade do Capital', weight: 5 },
          { id: 'crit5', name: 'Risco de Inadimplência ou Crise', weight: 4 },
        ],
        scores: {
          opt1: { crit1: 6, crit2: 4, crit3: 9, crit4: 5, crit5: 5 },
          opt2: { crit1: 9, crit2: 9, crit3: 6, crit4: 9, crit5: 8 },
          opt3: { crit1: 8, crit2: 7, crit3: 7, crit4: 8, crit5: 7 },
        },
      },
      swot: {
        strengths: [
          { id: 's1', text: 'Tenho disciplina para investir todos os meses sem falhar', impact: 'alto' },
          { id: 's2', text: 'Capacidade de gerar renda extra além do salário base', impact: 'medio' },
        ],
        weaknesses: [
          { id: 'w1', text: 'Preocupação constante com instabilidade do mercado de trabalho', impact: 'alto' },
          { id: 'w2', text: 'Pressão familiar para ter casa própria como sinônimo de sucesso', impact: 'medio' },
        ],
        opportunities: [
          { id: 'o1', text: 'Juros de renda fixa atrativos pagando acima da inflação', impact: 'alto' },
          { id: 'o2', text: 'Possibilidade de negociar bons descontos em aluguéis longos', impact: 'medio' },
        ],
        threats: [
          { id: 't1', text: 'Subida expressiva no preço dos imóveis no bairro desejado', impact: 'alto' },
          { id: 't2', text: 'Insegurança em contratos de locação com pedidos de desocupação', impact: 'medio' },
        ],
      },
    },
  },
  {
    name: 'Negócios: Lançar MVP Ágil vs Aperfeiçoar Produto',
    category: 'negocios',
    badge: 'Startups & Produtos',
    dilemma: {
      title: 'Lançar o MVP com funcionalidades básicas ou polir o produto por mais 3 meses?',
      description: 'Equilíbrio entre a velocidade de validação real no mercado e o risco de queimar a primeira impressão.',
      category: 'negocios',
      status: 'em_analise',
      activeMethod: 'swot',
      prosCons: {
        targetOptionName: 'Lançar MVP Imediatamente',
        pros: [
          { id: 'p1', text: 'Feedback real de clientes pagantes sem suposições teóricas', weight: 5 },
          { id: 'p2', text: 'Primeira receita entra mais cedo para financiar melhorias', weight: 4 },
          { id: 'p3', text: 'Antecipação frente a concorrentes que estão desenvolvendo algo parecido', weight: 4 },
        ],
        cons: [
          { id: 'c1', text: 'Interface inicial ainda possui limitações e bugs menores', weight: 3 },
          { id: 'c2', text: 'Risco de desapontar early adopters muito exigentes', weight: 3 },
          { id: 'c3', text: 'Demanda de suporte manual intensivo no início', weight: 2 },
        ],
      },
      comparative: {
        options: [
          { id: 'opt1', name: 'Lançamento Aberto de MVP', color: '#10b981', description: 'Abrir para todo o público com tag beta' },
          { id: 'opt2', name: 'Beta Fechado com 30 Usuários', color: '#3b82f6', description: 'Convite exclusivo para grupo seleto' },
          { id: 'opt3', name: 'Esperar mais 3 meses de Desenvolvimento', color: '#64748b', description: 'Polir todos os fluxos e automações' },
        ],
        criteria: [
          { id: 'crit1', name: 'Velocidade de Aprendizado', weight: 5 },
          { id: 'crit2', name: 'Controle de Reputação da Marca', weight: 4 },
          { id: 'crit3', name: 'Custo de Manutenção / Runway', weight: 5 },
          { id: 'crit4', name: 'Taxa de Retenção Prevista', weight: 4 },
        ],
        scores: {
          opt1: { crit1: 10, crit2: 5, crit3: 9, crit4: 6 },
          opt2: { crit1: 9, crit2: 8, crit3: 8, crit4: 8 },
          opt3: { crit1: 4, crit2: 9, crit3: 4, crit4: 7 },
        },
      },
      swot: {
        strengths: [
          { id: 's1', text: 'Proposta de valor clara e dor evidente resolvida no nicho', impact: 'alto' },
          { id: 's2', text: 'Time ágil com capacidade de deploy e correção em poucas horas', impact: 'alto' },
        ],
        weaknesses: [
          { id: 'w1', text: 'Documentação e onboarding automatizado ainda embrionários', impact: 'medio' },
          { id: 'w2', text: 'Equipe de suporte reduzida (apenas fundadores)', impact: 'alto' },
        ],
        opportunities: [
          { id: 'o1', text: 'Comunidades do nicho ativas procurando alternativas às ferramentas caras', impact: 'alto' },
          { id: 'o2', text: 'Parcerias com microinfluenciadores para o lançamento', impact: 'medio' },
        ],
        threats: [
          { id: 't1', text: 'Grandes players podem lançar feature equivalente no próximo semestre', impact: 'alto' },
          { id: 't2', text: 'Churn elevado caso a experiência nos primeiros 5 minutos seja confusa', impact: 'alto' },
        ],
      },
    },
  },
  {
    name: 'Estudos: Pós-Graduação Tradicional vs Cursos Práticos',
    category: 'estudos',
    badge: 'Educação',
    dilemma: {
      title: 'Investir R$ 25.000 em uma Pós-Graduação ou montar grade própria de bootcamps e mentorias?',
      description: 'Comparativo entre o peso formal do diploma e networking acadêmico versus habilidades práticas imediatas.',
      category: 'estudos',
      status: 'em_analise',
      activeMethod: 'comparative',
      prosCons: {
        targetOptionName: 'Fazer Pós-Graduação em Universidade Renomada',
        pros: [
          { id: 'p1', text: 'Diploma com chancela reconhecida pelo mercado corporativo', weight: 4 },
          { id: 'p2', text: 'Networking com profissionais seniores e professores influentes', weight: 4 },
          { id: 'p3', text: 'Estrutura curricular metódica e com disciplina obrigatória', weight: 3 },
        ],
        cons: [
          { id: 'c1', text: 'Custo financeiro substancial e compromisso por 18 a 24 meses', weight: 4 },
          { id: 'c2', text: 'Parte do conteúdo teórico desatualizado em relação às novas ferramentas', weight: 4 },
          { id: 'c3', text: 'Rigidez de horários em dias de semana ou fins de semana', weight: 3 },
        ],
      },
      comparative: {
        options: [
          { id: 'opt1', name: 'Pós-Graduação / MBA', color: '#6366f1', description: '18 meses em instituição de prestígio' },
          { id: 'opt2', name: 'Cursos Práticos + Portfólio + Mentorias', color: '#14b8a6', description: 'Trilhas direcionadas com foco em execução' },
          { id: 'opt3', name: 'Certificações Internacionais Oficiais', color: '#f59e0b', description: 'Exames reconhecidos globalmente' },
        ],
        criteria: [
          { id: 'crit1', name: 'Impacto Imediato na Prática do Trabalho', weight: 5 },
          { id: 'crit2', name: 'Reconhecimento em Processos Seletivos', weight: 4 },
          { id: 'crit3', name: 'Custo-Benefício Financeiro', weight: 4 },
          { id: 'crit4', name: 'Qualidade do Networking', weight: 4 },
          { id: 'crit5', name: 'Flexibilidade de Horários', weight: 3 },
        ],
        scores: {
          opt1: { crit1: 6, crit2: 9, crit3: 5, crit4: 9, crit5: 5 },
          opt2: { crit1: 9, crit2: 7, crit3: 9, crit4: 6, crit5: 9 },
          opt3: { crit1: 7, crit2: 8, crit3: 8, crit4: 5, crit5: 8 },
        },
      },
      swot: {
        strengths: [
          { id: 's1', text: 'Autodidata com facilidade para colocar teoria em prática rapidamente', impact: 'alto' },
          { id: 's2', text: 'Experiência prévia em projetos reais no portfólio', impact: 'medio' },
        ],
        weaknesses: [
          { id: 'w1', text: 'Currículo carente de marcas acadêmicas de peso', impact: 'medio' },
          { id: 'w2', text: 'Dificuldade de manter consistência sem cobrança formal de prazos', impact: 'alto' },
        ],
        opportunities: [
          { id: 'o1', text: 'Vagas internacionais valorizam habilidades práticas comprovadas', impact: 'alto' },
          { id: 'o2', text: 'Possibilidade da empresa atual subsidiar parte dos custos', impact: 'alto' },
        ],
        threats: [
          { id: 't1', text: 'Filtros automatizados de RH (ATS) que ainda exigem pós em vagas de gerência', impact: 'alto' },
        ],
      },
    },
  },
];
