import { BookOpen, Scale, Gavel, FileText, Briefcase, Calculator, ShieldCheck, Users } from 'lucide-react';
import { CardItem } from './types';

// The Persona definition for the AI - JusTech Premium
export const SYSTEM_INSTRUCTION = `
PERSONA: ARQUITETO DE SOFTWARE E ADVOGADO SÊNIOR (20+ ANOS DE EXPERIÊNCIA).
ESPECIALIDADE: Direito do Trabalho (CLT/TST), Processo Civil e Estratégia Processual.

DIRETRIZES DE COMPORTAMENTO:
1. **Atuação como Especialista**: Você não é apenas um chatbot, é um motor jurídico. Suas respostas devem ser técnicas, fundamentadas e estratégicas.
2. **Foco no TST**: Utilize Súmulas, OJs e Precedentes Normativos do TST como base principal de argumentação.
3. **Análise de Risco**: Sempre identifique riscos de sucumbência, prescrição ou nulidade.
4. **Formatação Premium**:
   - Use **Negrito** para destacar conceitos chave e teses.
   - Use Emojis Jurídicos (⚖️, 📄, ⚠️, 💡, 🏛️) para organizar a leitura.
   - Estruture em tópicos claros.

CONTEXTO TÉCNICO:
- Você está integrado a uma plataforma React/Node.js de alta performance.
- Quando dados numéricos (cálculos) ou dados empresariais (CNAE/RAT) forem fornecidos, use-os explicitamente na fundamentação.
`;

export const DASHBOARD_CARDS: CardItem[] = [
  {
    id: 'labor',
    title: 'Direito do Trabalho',
    description: 'Reclamatórias, Defesas, Recursos e Consultoria TST.',
    icon: Briefcase,
    viewTarget: 'LABOR_MODULE',
    isActive: true,
    color: '#3f51b5' // Indigo
  },
  {
    id: 'calc',
    title: 'Calculadora Trabalhista',
    description: 'Liquidante de verbas, horas extras e rescisão.',
    icon: Calculator,
    viewTarget: 'CALCULATION_MODULE',
    isActive: true,
    color: '#4caf50' // Green
  },
  {
    id: 'contract',
    title: 'Auditoria de Contratos',
    description: 'Análise de risco e cláusulas abusivas com IA.',
    icon: FileText,
    viewTarget: 'CONTRACT_MODULE',
    isActive: true,
    color: '#7b61ff' // Purple
  },
  {
    id: 'penal',
    title: 'Criminal & Penal',
    description: 'Habeas Corpus, Execução e Dosimetria.',
    icon: Gavel,
    viewTarget: 'PENAL_MODULE',
    isActive: true,
    color: '#f44336' // Red
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Análise de Sentença', message: 'A IA identificou 3 pontos de recurso no Proc. #10023.', time: 'Agora', read: false, type: 'SUCCESS' },
  { id: '2', title: 'Documento Processado', message: 'Leitura de PDF (OCR) concluída com sucesso.', time: '5 min atrás', read: false, type: 'INFO' },
  { id: '3', title: 'Risco Detectado', message: 'Prescrição intercorrente próxima no caso Silva v. Indústria.', time: '2 horas atrás', read: true, type: 'WARNING' },
];