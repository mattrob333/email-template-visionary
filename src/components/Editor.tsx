
import { useState, useEffect, useRef } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

const Editor = ({ value, onChange, isDarkMode }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous editor instance
    if (editorView) {
      editorView.destroy();
    }

    // Create theme extension based on dark mode state
    const theme: Extension = isDarkMode ? oneDark : [];

    // Set up the editor
    const updateListener = EditorView.updateListener.of(update => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        lineNumbers(),
        highlightActiveLine(),
        html(),
        keymap.of([indentWithTab]),
        updateListener,
        theme,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    setEditorView(view);

    return () => {
      view.destroy();
    };
  }, [editorRef, isDarkMode]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorView && value !== editorView.state.doc.toString()) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value, editorView]);

  return <div ref={editorRef} className="w-full h-full" />;
};

export default Editor;
