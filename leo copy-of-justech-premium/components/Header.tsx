import React, { useState } from 'react';
import { Bell, Search, Menu, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

interface HeaderProps {
  onToggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS as Notification[]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm md:ml-64 transition-all duration-300">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={onToggleMenu}
        className="mr-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Pesquisar processos, peças ou jurisprudência..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-legal-700 bg-gray-50 transition-all"
          />
        </div>
        <span className="md:hidden text-lg font-bold text-legal-900">JusTech</span>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-legal-50">
                <h3 className="font-semibold text-legal-900 text-sm">Notificações</h3>
                <button onClick={markAllRead} className="text-xs text-legal-gold hover:underline font-medium">
                  Marcar todas como lidas
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto legal-scroll">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Nenhuma notificação recente.</div>
                ) : (
                  notifications.map(item => (
                    <div key={item.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${item.read ? 'opacity-60' : 'bg-blue-50/30'}`}>
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">{getIcon(item.type)}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{item.message}</p>
                          <p className="text-[10px] text-gray-400 mt-2">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;