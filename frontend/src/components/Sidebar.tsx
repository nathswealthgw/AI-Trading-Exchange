import { BarChart3, Bot, Briefcase, ChevronLeft, ChevronRight, History, ListOrdered, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  collapsed: boolean;
  onToggleTheme: () => void;
  onToggleCollapsed: () => void;
}

export const Sidebar = ({ darkMode, collapsed, onToggleTheme, onToggleCollapsed }: SidebarProps) => (
  <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
    <div className="sidebar-title-row">
      <h2>{collapsed ? 'EX' : 'Exchange Pro'}</h2>
      <button className="icon-btn" onClick={onToggleCollapsed} aria-label="toggle sidebar">
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
    <nav>
      <a><BarChart3 size={16} /> {!collapsed && 'Dashboard'}</a>
      <a><ListOrdered size={16} /> {!collapsed && 'Order Book'}</a>
      <a><Briefcase size={16} /> {!collapsed && 'Portfolio'}</a>
      <a><Bot size={16} /> {!collapsed && 'AI Signals'}</a>
      <a><History size={16} /> {!collapsed && 'History'}</a>
    </nav>
    <button onClick={onToggleTheme}>{darkMode ? <Sun size={16} /> : <Moon size={16} />} {!collapsed && 'Toggle Theme'}</button>
  </aside>
);
