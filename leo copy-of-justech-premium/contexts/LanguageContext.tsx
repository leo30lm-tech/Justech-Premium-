import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'pt-BR' | 'en-US' | 'es-ES';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  'pt-BR': {
    'menu.dashboard': 'Painel Geral',
    'menu.labor': 'Trabalhista',
    'menu.calc': 'Cálculos',
    'menu.contract': 'Contratos',
    'menu.penal': 'Penal',
    'menu.settings': 'Configurações',
    
    'dash.title': 'Painel de Controle',
    'dash.welcome': 'Bem-vindo ao JusTech Premium. Selecione uma ferramenta.',
    'dash.version': 'Versão 2.5.0 (Beta)',
    'dash.diagnosis': 'Diagnóstico Preliminar (CNPJ/RAT)',
    'dash.analyze': 'ANALISAR RISCO',
    'dash.placeholder': 'Digite o CNPJ para análise de risco...',
    'dash.company': 'Empresa Identificada',
    'dash.classification': 'Classificação',
    'dash.insight': 'IA Insight',
    'dash.generate': 'Gerar Peça',
    'dash.soon': 'Em Breve',
    'dash.access': 'Acessar Módulo',
    
    'card.labor.title': 'Direito do Trabalho',
    'card.labor.desc': 'Reclamatórias, Defesas, Recursos e Consultoria TST.',
    'card.calc.title': 'Calculadora Trabalhista',
    'card.calc.desc': 'Liquidante de verbas, horas extras e rescisão.',
    'card.contract.title': 'Auditoria de Contratos',
    'card.contract.desc': 'Análise de risco e cláusulas abusivas com IA.',
    'card.penal.title': 'Criminal & Penal',
    'card.penal.desc': 'Habeas Corpus, Execução e Dosimetria.',
    
    'settings.title': 'Configurações do Sistema',
    'settings.subtitle': 'Personalize aparência, idioma e comportamento da IA.',
    'settings.interface': 'Interface e Idioma',
    'settings.theme': 'Tema do Sistema',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Escuro',
    'settings.lang': 'Idioma Principal',
    'settings.office': 'Perfil do Escritório',
    'settings.office.desc': 'Os dados abaixo aparecerão em todos os documentos gerados pela IA.',
    'settings.office.name': 'Nome do Titular / Escritório',
    'settings.office.oab': 'OAB Principal',
    'settings.office.addr': 'Endereço Completo (Rodapé)',
    'settings.office.email': 'E-mail de Contato',
    'settings.office.whats': 'WhatsApp para Petições',
    'settings.ai': 'Preferências da IA',
    'settings.ai.tone': 'Tom da Redação Jurídica',
    'settings.ai.desc': 'Define como o motor jurídico estrutura a argumentação nas peças processuais.',
    'settings.save': 'Salvar Alterações',
    'settings.saved': 'Salvo com Sucesso',
    'settings.logo': 'Sua Logo',
    'settings.tip': 'Dica:',
    'settings.tip.text': 'Ao alterar o nome ou logo aqui, todas as petições geradas hoje já sairão com a nova identidade visual.',

    'calc.title': 'Parecer Técnico de Liquidação',
    'calc.subtitle': 'JusTech Premium - Simulador Realista',
    'calc.salary': 'Salário Base (R$)',
    'calc.type': 'Tipo de Dispensa',
    'calc.months': 'Meses Trabalhados',
    'calc.he50': 'HE 50% (Qtd)',
    'calc.he100': 'HE 100% (Qtd)',
    'calc.adm': 'Admissão / Demissão (Opcional)',
    'calc.generate': 'GERAR MEMÓRIA',
    'calc.export': 'EXPORTAR PDF / IMPRIMIR',
    'calc.total': 'TOTAL LÍQUIDO:',
    'calc.res.he': 'Horas Extras (Acumuladas):',
    'calc.res.13': '13º Proporcional:',
    'calc.res.vac': 'Férias + 1/3:',
    'calc.res.fgts': 'FGTS + Multa 40%:',
    'calc.footer': 'Este documento é uma estimativa técnica gerada pelo JusTech Premium e não substitui cálculo pericial judicial.'
  },
  'en-US': {
    'menu.dashboard': 'Dashboard',
    'menu.labor': 'Labor Law',
    'menu.calc': 'Calculations',
    'menu.contract': 'Contracts',
    'menu.penal': 'Criminal',
    'menu.settings': 'Settings',
    
    'dash.title': 'Control Panel',
    'dash.welcome': 'Welcome to JusTech Premium. Select a tool.',
    'dash.version': 'Version 2.5.0 (Beta)',
    'dash.diagnosis': 'Preliminary Diagnosis (ID/Risk)',
    'dash.analyze': 'ANALYZE RISK',
    'dash.placeholder': 'Enter Company ID for risk analysis...',
    'dash.company': 'Company Identified',
    'dash.classification': 'Classification',
    'dash.insight': 'AI Insight',
    'dash.generate': 'Generate Doc',
    'dash.soon': 'Coming Soon',
    'dash.access': 'Access Module',

    'card.labor.title': 'Labor Law',
    'card.labor.desc': 'Complaints, Defenses, Appeals, and TST Consulting.',
    'card.calc.title': 'Labor Calculator',
    'card.calc.desc': 'Settlement of funds, overtime, and termination.',
    'card.contract.title': 'Contract Audit',
    'card.contract.desc': 'Risk analysis and abusive clauses with AI.',
    'card.penal.title': 'Criminal Law',
    'card.penal.desc': 'Habeas Corpus, Execution, and Dosimetry.',
    
    'settings.title': 'System Settings',
    'settings.subtitle': 'Customize appearance, language, and AI behavior.',
    'settings.interface': 'Interface & Language',
    'settings.theme': 'System Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.lang': 'Main Language',
    'settings.office': 'Office Profile',
    'settings.office.desc': 'Data below will appear on all AI-generated documents.',
    'settings.office.name': 'Holder / Office Name',
    'settings.office.oab': 'Primary Bar ID (OAB)',
    'settings.office.addr': 'Full Address (Footer)',
    'settings.office.email': 'Contact Email',
    'settings.office.whats': 'WhatsApp for Petitions',
    'settings.ai': 'AI Preferences',
    'settings.ai.tone': 'Legal Drafting Tone',
    'settings.ai.desc': 'Defines how the legal engine structures argumentation in procedural documents.',
    'settings.save': 'Save Changes',
    'settings.saved': 'Saved Successfully',
    'settings.logo': 'Your Logo',
    'settings.tip': 'Tip:',
    'settings.tip.text': 'Changing the name or logo here will update all documents generated today.',
    
    'calc.title': 'Technical Liquidation Report',
    'calc.subtitle': 'JusTech Premium - Realistic Simulator',
    'calc.salary': 'Base Salary',
    'calc.type': 'Dismissal Type',
    'calc.months': 'Months Worked',
    'calc.he50': 'OT 50% (Qty)',
    'calc.he100': 'OT 100% (Qty)',
    'calc.adm': 'Admission / Dismissal (Optional)',
    'calc.generate': 'GENERATE REPORT',
    'calc.export': 'EXPORT PDF / PRINT',
    'calc.total': 'NET TOTAL:',
    'calc.res.he': 'Overtime (Accumulated):',
    'calc.res.13': '13th Proportional:',
    'calc.res.vac': 'Vacation + 1/3:',
    'calc.res.fgts': 'FGTS + 40% Fine:',
    'calc.footer': 'This document is a technical estimate generated by JusTech Premium and does not replace judicial expert calculation.'
  },
  'es-ES': {
    'menu.dashboard': 'Panel General',
    'menu.labor': 'Laboral',
    'menu.calc': 'Cálculos',
    'menu.contract': 'Contratos',
    'menu.penal': 'Penal',
    'menu.settings': 'Configuración',
    
    'dash.title': 'Panel de Control',
    'dash.welcome': 'Bienvenido a JusTech Premium. Seleccione una herramienta.',
    'dash.version': 'Versión 2.5.0 (Beta)',
    'dash.diagnosis': 'Diagnóstico Preliminar (Riesgo)',
    'dash.analyze': 'ANALIZAR RIESGO',
    'dash.placeholder': 'Ingrese ID de empresa para análisis...',
    'dash.company': 'Empresa Identificada',
    'dash.classification': 'Clasificación',
    'dash.insight': 'Insight IA',
    'dash.generate': 'Generar Documento',
    'dash.soon': 'Próximamente',
    'dash.access': 'Acceder al Módulo',

    'card.labor.title': 'Derecho Laboral',
    'card.labor.desc': 'Reclamaciones, Defensas, Recursos y Consultoría.',
    'card.calc.title': 'Calculadora Laboral',
    'card.calc.desc': 'Liquidación de haberes, horas extras y despido.',
    'card.contract.title': 'Auditoría de Contratos',
    'card.contract.desc': 'Análisis de riesgos y cláusulas abusivas con IA.',
    'card.penal.title': 'Penal y Criminal',
    'card.penal.desc': 'Habeas Corpus, Ejecución y Dosimetría.',
    
    'settings.title': 'Configuración del Sistema',
    'settings.subtitle': 'Personalice apariencia, idioma y comportamiento.',
    'settings.interface': 'Interfaz e Idioma',
    'settings.theme': 'Tema del Sistema',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Oscuro',
    'settings.lang': 'Idioma Principal',
    'settings.office': 'Perfil del Despacho',
    'settings.office.desc': 'Los datos aparecerán en todos los documentos generados.',
    'settings.office.name': 'Nombre del Titular / Despacho',
    'settings.office.oab': 'Nº Colegiado (OAB)',
    'settings.office.addr': 'Dirección Completa (Pie de pág.)',
    'settings.office.email': 'Email de Contacto',
    'settings.office.whats': 'WhatsApp para Peticiones',
    'settings.ai': 'Preferencias de IA',
    'settings.ai.tone': 'Tono de Redacción Jurídica',
    'settings.ai.desc': 'Define cómo el motor jurídico estructura la argumentación.',
    'settings.save': 'Guardar Cambios',
    'settings.saved': 'Guardado con Éxito',
    'settings.logo': 'Su Logo',
    'settings.tip': 'Consejo:',
    'settings.tip.text': 'Al cambiar el nombre o logo, todos los documentos de hoy se actualizarán.',
    
    'calc.title': 'Informe Técnico de Liquidación',
    'calc.subtitle': 'JusTech Premium - Simulador Realista',
    'calc.salary': 'Salario Base',
    'calc.type': 'Tipo de Despido',
    'calc.months': 'Meses Trabajados',
    'calc.he50': 'HE 50% (Cant)',
    'calc.he100': 'HE 100% (Cant)',
    'calc.adm': 'Admisión / Despido (Opcional)',
    'calc.generate': 'GENERAR MEMORIA',
    'calc.export': 'EXPORTAR PDF / IMPRIMIR',
    'calc.total': 'TOTAL NETO:',
    'calc.res.he': 'Horas Extras (Acumuladas):',
    'calc.res.13': '13º Proporcional:',
    'calc.res.vac': 'Vacaciones + 1/3:',
    'calc.res.fgts': 'FGTS + Multa 40%:',
    'calc.footer': 'Este documento es una estimación técnica y no sustituye el cálculo pericial judicial.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};