export default function EditorLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 shrink-0 bg-editor-surface border-r border-editor-border overflow-y-auto">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-editor-text">Brightbase DS</h1>
          <p className="text-sm text-editor-text-muted mt-1">Design System Generator</p>
        </div>
      </aside>

      {/* Preview */}
      <main className="flex-1 bg-preview-bg overflow-y-auto">
        <div className="p-8">
          <p className="text-gray-500 text-sm">Preview panel — tokens will render here</p>
        </div>
      </main>
    </div>
  );
}
