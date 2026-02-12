import React from 'react';
import { LayoutDashboard, Scale, Settings, LogOut, FileText, UserCircle, Calculator, Gavel, X } from 'lucide-react';
import { ViewState } from './types';
import { useLanguage } from './contexts/LanguageContext';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose }) => {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'DASHBOARD', label: t('menu.dashboard'), icon: LayoutDashboard },
    { id: 'LABOR_MODULE', label: t('menu.labor'), icon: Scale },
    { id: 'CALCULATION_MODULE', label: t('menu.calc'), icon: Calculator },
    { id: 'CONTRACT_MODULE', label: t('menu.contract'), icon: FileText },
    { id: 'PENAL_MODULE', label: t('menu.penal'), icon: Gavel },
    { id: 'SETTINGS', label: t('menu.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen bg-legal-900 dark:bg-black text-white flex flex-col shadow-xl z-30 border-r border-legal-800 dark:border-gray-800 transition-transform duration-300 w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-legal-800 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-legal-gold rounded-md flex items-center justify-center shadow-lg shadow-legal-gold/20">
              <Scale className="text-legal-900 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">JusTech</h1>
              <p className="text-xs text-legal-gold uppercase tracking-widest">Premium</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-legal-800 dark:bg-legal-800/50 text-legal-gold shadow-md border-l-4 border-legal-gold' 
                    : 'text-gray-400 hover:bg-legal-800/30 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-legal-gold' : 'text-gray-500 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-legal-800 dark:border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-legal-800/50 dark:bg-gray-900/50 border border-legal-800 dark:border-gray-800">
            <UserCircle className="w-8 h-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Dr. Advogado</p>
              <p className="text-xs text-gray-500 truncate">OAB Ativo</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;