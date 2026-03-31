"use client";

import { useEffect, useState } from 'react';
import useTokenStore from '@/lib/tokens/store';
import Sidebar, { SidebarSection } from './Sidebar';
import PreviewPanel from '@/components/preview/PreviewPanel';
import TokenStyleInjector from '@/components/preview/TokenStyleInjector';
import ColorSection from './sections/ColorSection';
import TypographySection from './sections/TypographySection';
import SpacingSection from './sections/SpacingSection';
import BorderSection from './sections/BorderSection';
import ButtonStyleSection from './sections/ButtonStyleSection';
import CardStyleSection from './sections/CardStyleSection';
import InputStyleSection from './sections/InputStyleSection';
import StyleModeSection from './sections/StyleModeSection';
import { generateCSS } from '@/lib/export/css';
import { generateDTCG } from '@/lib/export/dtcg';
import { downloadJSON, uploadJSON, copyToClipboard } from '@/lib/persistence/storage';

function HeaderBar() {
  const store = useTokenStore();
  const [copied, setCopied] = useState(null);

  const handleExportCSS = async (mode) => {
    const css = generateCSS(store, mode);
    await copyToClipboard(css);
    setCopied(mode === 'resolved' ? 'css' : 'css-ref');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportDTCG = () => {
    const dtcg = generateDTCG(store);
    downloadJSON(dtcg, 'design-tokens.json');
  };

  const handleExportConfig = () => {
    downloadJSON(store.getExportConfig(), 'design-system-config.json');
  };

  const handleImportConfig = async () => {
    const config = await uploadJSON();
    if (config) store.loadConfig(config);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-editor-bg border-b border-editor-border">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-editor-text tracking-tight">Brightbase DS</h1>
        <span className="text-[10px] text-editor-text-muted font-mono">v0.1</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={store.undo}
          className="text-[10px] px-2 py-1 rounded text-editor-text-muted hover:text-editor-text hover:bg-editor-surface transition-colors"
          title="Undo (Cmd+Z)"
        >
          Undo
        </button>
        <button
          onClick={store.redo}
          className="text-[10px] px-2 py-1 rounded text-editor-text-muted hover:text-editor-text hover:bg-editor-surface transition-colors"
          title="Redo (Cmd+Shift+Z)"
        >
          Redo
        </button>
        <div className="w-px h-4 bg-editor-border mx-1" />
        <button
          onClick={() => handleExportCSS('resolved')}
          className="text-[10px] px-2 py-1 rounded bg-editor-surface text-editor-text-muted hover:text-editor-text border border-editor-border transition-colors"
        >
          {copied === 'css' ? 'Copied!' : 'Copy CSS'}
        </button>
        <button
          onClick={() => handleExportCSS('referenced')}
          className="text-[10px] px-2 py-1 rounded bg-editor-surface text-editor-text-muted hover:text-editor-text border border-editor-border transition-colors"
        >
          {copied === 'css-ref' ? 'Copied!' : 'Copy CSS (refs)'}
        </button>
        <button
          onClick={handleExportDTCG}
          className="text-[10px] px-2 py-1 rounded bg-editor-surface text-editor-text-muted hover:text-editor-text border border-editor-border transition-colors"
        >
          Export DTCG
        </button>
        <div className="w-px h-4 bg-editor-border mx-1" />
        <button
          onClick={handleExportConfig}
          className="text-[10px] px-2 py-1 rounded text-editor-text-muted hover:text-editor-text hover:bg-editor-surface transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleImportConfig}
          className="text-[10px] px-2 py-1 rounded text-editor-text-muted hover:text-editor-text hover:bg-editor-surface transition-colors"
        >
          Load
        </button>
        <button
          onClick={() => { if (confirm('Reset all tokens to defaults?')) store.resetToDefaults(); }}
          className="text-[10px] px-2 py-1 rounded text-red-400/60 hover:text-red-400 hover:bg-editor-surface transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function EditorLayout() {
  const undo = useTokenStore((s) => s.undo);
  const redo = useTokenStore((s) => s.redo);

  // Global keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return (
    <div className="flex flex-col h-screen">
      <HeaderBar />
      <div className="flex flex-1 min-h-0">
        <TokenStyleInjector />

        {/* Sidebar */}
        <Sidebar
          tokenSections={
            <>
              <SidebarSection title="Style Mode" defaultOpen={true}>
                <StyleModeSection />
              </SidebarSection>

              <SidebarSection title="Colors" defaultOpen={true}>
                <ColorSection />
              </SidebarSection>

              <SidebarSection title="Typography" defaultOpen={true}>
                <TypographySection />
              </SidebarSection>

              <SidebarSection title="Spacing" defaultOpen={true}>
                <SpacingSection />
              </SidebarSection>

              <SidebarSection title="Borders & Shadows" defaultOpen={true}>
                <BorderSection />
              </SidebarSection>
            </>
          }
          componentSections={
            <>
              <SidebarSection title="Button Styles" defaultOpen={true}>
                <ButtonStyleSection />
              </SidebarSection>

              <SidebarSection title="Card Styles" defaultOpen={true}>
                <CardStyleSection />
              </SidebarSection>

              <SidebarSection title="Input Styles" defaultOpen={true}>
                <InputStyleSection />
              </SidebarSection>
            </>
          }
        />

        {/* Preview */}
        <PreviewPanel />
      </div>
    </div>
  );
}
