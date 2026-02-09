import React, { useState, useEffect } from 'react';
import { FileText, Gavel } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LaborModule from './components/LaborModule';
import CalculationModule from './components/CalculationModule';
import ContractModule from './components/ContractModule';
import SimpleChatModule from './components/SimpleChatModule';
import SettingsModule from './components/SettingsModule';
import Onboarding from './components/Onboarding';
import Register from './components/Register';
import Login from './components/Login';
import SupportChat from './components/SupportChat';
import { ViewState } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  // App Stage: onboarding -> register -> login -> app
  const [appStage, setAppStage] = useState<'onboarding' | 'register' | 'login' | 'app'>('onboarding');
  
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [calculationData, setCalculationData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  // Global Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply Dark Mode to HTML Element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Global Office Profile State
  const [officeProfile, setOfficeProfile] = useState({
    nome: 'Dr. Advogado Responsável',
    oab: 'OAB/SP 000.000',
    email: 'contato@advocacia.com.br',
    whatsapp: '(11) 99999-9999',
    endereco: 'Av. Paulista, 1000 - CJ 12 - São Paulo/SP',
    logo: '' // Stores Base64 string of the logo
  });

  // --- FLOW HANDLERS ---
  if (appStage === 'onboarding') {
    return <Onboarding onNext={() => setAppStage('register')} />;
  }

  if (appStage === 'register') {
    return <Register onRegister={() => setAppStage('login')} />;
  }

  if (appStage === 'login') {
    return <Login onLogin={() => setAppStage('app')} />;
  }

  // --- MAIN APP CONTENT ---
  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard onChangeView={setCurrentView} onSaveCompanyContext={setCompanyData} />;
      case 'LABOR_MODULE':
        return <LaborModule initialContext={calculationData} companyContext={companyData} officeProfile={officeProfile} />;
      case 'CALCULATION_MODULE':
        return <CalculationModule onNavigate={setCurrentView} onSaveContext={setCalculationData} officeProfile={officeProfile} />;
      case 'CONTRACT_MODULE':
        return <ContractModule />;
      case 'PENAL_MODULE':
        return (
          <SimpleChatModule 
            title="Direito Penal" 
            subtitle="Habeas Corpus, Defesas e Execução Penal" 
            initialMessage="Olá, Doutor(a). Sou sua especialista em Direito Penal e Processual Penal. Posso auxiliar na redação de HCs, Respostas à Acusação ou análise de dosimetria da pena. Como posso ajudar?"
            icon={Gavel}
            colorClass="text-red-600"
            iconBgClass="bg-red-600"
            officeProfile={officeProfile}
          />
        );
      case 'SETTINGS':
        return (
          <SettingsModule 
            currentProfile={officeProfile} 
            onSaveProfile={setOfficeProfile}
            theme={theme}
            setTheme={setTheme}
          />
        );
      default:
        return <Dashboard onChangeView={setCurrentView} onSaveCompanyContext={setCompanyData} />;
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${theme === 'dark' ? 'bg-legal-900' : 'bg-slate-50'}`}>
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <Header />
      <main className="transition-all duration-300">
        {renderContent()}
      </main>
      
      {/* Floating Support Widget */}
      <SupportChat officeProfile={officeProfile} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;