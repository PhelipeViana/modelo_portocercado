import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Link, List, ListOrdered, Quote, RemoveFormatting, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || '');
  };

  const createLink = () => {
    const url = window.prompt('Informe a URL do link:');
    if (url?.trim()) runCommand('createLink', url.trim());
  };

  const controls = [
    { label: 'Negrito', icon: Bold, action: () => runCommand('bold') },
    { label: 'Itálico', icon: Italic, action: () => runCommand('italic') },
    { label: 'Título', icon: Type, action: () => runCommand('formatBlock', 'h2') },
    { label: 'Lista', icon: List, action: () => runCommand('insertUnorderedList') },
    { label: 'Lista numerada', icon: ListOrdered, action: () => runCommand('insertOrderedList') },
    { label: 'Citação', icon: Quote, action: () => runCommand('formatBlock', 'blockquote') },
    { label: 'Inserir link', icon: Link, action: createLink },
    { label: 'Limpar formatação', icon: RemoveFormatting, action: () => runCommand('removeFormat') },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
        {controls.map(({ label, icon: Icon, action }) => (
          <button key={label} type="button" onMouseDown={(event) => event.preventDefault()} onClick={action} title={label} aria-label={label} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950 dark:hover:text-emerald-300">
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder={placeholder} onInput={() => onChange(editorRef.current?.innerHTML || '')} className="rich-text-editor min-h-52 w-full p-3 text-sm font-medium text-slate-900 outline-none dark:text-slate-100" />
    </div>
  );
};
