"use client";

import { useState } from 'react';

function SidebarSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-editor-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-editor-text-muted hover:text-editor-text transition-colors"
      >
        {title}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

const TABS = [
  { key: 'tokens', label: 'Tokens' },
  { key: 'components', label: 'Components' },
];

export default function Sidebar({ tokenSections, componentSections }) {
  const [activeTab, setActiveTab] = useState('tokens');

  return (
    <aside className="w-80 shrink-0 bg-editor-surface border-r border-editor-border overflow-y-auto flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-editor-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-[11px] font-semibold uppercase tracking-wider py-2.5 transition-colors ${
              activeTab === tab.key
                ? 'text-editor-accent border-b-2 border-editor-accent'
                : 'text-editor-text-muted hover:text-editor-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tokens' && tokenSections}
      {activeTab === 'components' && (
        componentSections || (
          <div className="px-4 py-8 text-center">
            <div className="text-editor-text-muted text-xs">
              Style modes and molecule controls coming in Phase 3.5b
            </div>
          </div>
        )
      )}
    </aside>
  );
}

export { SidebarSection };
