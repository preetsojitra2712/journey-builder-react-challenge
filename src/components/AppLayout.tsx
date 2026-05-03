import { ReactNode } from 'react';
import './AppLayout.css';

interface AppLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function AppLayout({ leftPanel, rightPanel }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <aside className="app-layout-left">{leftPanel}</aside>
      <main className="app-layout-right">{rightPanel}</main>
    </div>
  );
}
