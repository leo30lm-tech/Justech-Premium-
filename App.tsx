import React, { useState, useEffect } from 'react';
import { Gavel } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import LaborModule from './LaborModule';
import CalculationModule from './CalculationModule';
import ContractModule from './ContractModule';
import SimpleChatModule from './SimpleChatModule';
import SettingsModule from './SettingsModule';
import Onboarding from './Onboarding';
import Register from './Register';
import Login from './Login';
import SupportChat from './SupportChat';
import { ViewState } from './types';
import { LanguageProvider } from './LanguageContext';

const AppContent: React.FC = () => {
  // App Stage: onboarding -> register -> login -> app
  const [appStage, setAppSsetAppStagetage] = useState<'onboarding' | 'register' | 'login' | 'app'>('onboarding');
  
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [calculationDatacalculationData, setCalculationData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    nome: 'Dr. Advogado ResponsÃ¡vel',
    oab: 'OAB/SP 000.000',
    email: 'contato@advocacia.com.br',
    whatsapp: '(11) 99999-9999',
    endereco: 'Av. Paulista, 1000 - CJ 12 - SÃ£o Paulo/SP',
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
        return <Dashboard onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} onSaveCompanyContext={setCompanyData} />;
      case 'LABOR_MODULE':
        return <LaborModule initialContext={calculationData} companyContext={companyData} officeProfile={officeProfile} />;
      case 'CALCULATION_MODULE':
        return <CalculationModule onNavigate={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} onSaveContext={setCalculationData} officeProfile={officeProfile} />;
      case 'CONTRACT_MODULE':
        return <ContractModule />;
      case 'PENAL_MODULE':
        return (
          <SimpleChatModule 
            title="Direito Penal" 
            subtitle="Habeas Corpus, Defesas e ExecuÃ§Ã£o Penal" 
            initialMessage="OlÃ¡, Doutor(a). Sou sua especialista em Direito Penal e Processual Penal. Posso auxiliar na redaÃ§Ã£o de HCs, Respostas Ã  AcusaÃ§Ã£o ou anÃ¡lise de dosimetria da pena. Como posso ajudar?"
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
        return <Dashboard onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} onSaveCompanyContext={setCompanyData} />;
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${theme === 'dark' ? 'bg-legal-900' : 'bg-slate-50'}`}>
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      
      <div className={`transition-all duration-300 ${mobileMenuOpen ? 'opacity-50 pointer-events-none' : ''} md:opacity-100 md:pointer-events-auto`}>
        <Header onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="transition-all duration-300">
          {renderContent()}
        </main>
      </div>
      
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
