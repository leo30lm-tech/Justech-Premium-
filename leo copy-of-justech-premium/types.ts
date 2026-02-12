import React from 'react';

export type ViewState = 'DASHBOARD' | 'LABOR_MODULE' | 'CALCULATION_MODULE' | 'CONTRACT_MODULE' | 'PENAL_MODULE' | 'SETTINGS';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface LegalCaseConfig {
  type: 'COMPLAINT' | 'DEFENSE' | 'APPEAL' | 'ANALYSIS';
  subType?: string; // e.g., 'Dano Moral', 'Horas Extras'
  jurisdiction: 'TRT' | 'TST';
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  viewTarget?: ViewState;
  isActive: boolean;
  color?: string;
}