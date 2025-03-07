
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { indentWithTab } from '@codemirror/commands';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export const Editor = ({ value, onChange, isDarkMode }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  // Create and destroy the editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Custom editor theme for dark mode with colorful syntax
    const customTheme = EditorView.theme({
      "&": {
        backgroundColor: "#1A1F2C",
        color: "#f8f8f2",
        height: "100%",
        fontSize: "14px",
        fontFamily: "monospace"
      },
      ".cm-content": {
        padding: "10px"
      },
      ".cm-line": {
        padding: "0 4px"
      },
      // Tag names in purple
      ".cm-tag": {
        color: "#8B5CF6"
      },
      // Attributes in orange
      ".cm-attribute": {
        color: "#F97316"
      },
      // Attribute values in cyan
      ".cm-attributeValue": {
        color: "#0EA5E9"
      },
      // Text content in light green
      ".cm-content .cm-text": {
        color: "#F2FCE2"
      },
      // Comments in gray
      ".cm-comment": {
        color: "#94a3b8"
      },
      // Selection highlighting
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": { 
        background: "rgba(137, 221, 255, 0.2)" 
      },
      // Active line highlighting
      ".cm-activeLine": {
        backgroundColor: "rgba(255, 255, 255, 0.07)"
      }
    });

    // Create the editor state
    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        html(),
        keymap.of([indentWithTab]),
        customTheme,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      ]
    });

    // Create the editor view
    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    editorViewRef.current = view;

    // Cleanup on unmount
    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [isDarkMode]); // Recreate editor if dark mode changes

  // Update editor content when value prop changes externally
  useEffect(() => {
    const view = editorViewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);

  return (
    <div className="h-full">
      <div ref={editorRef} className="h-full overflow-auto" />
    </div>
  );
};

export default Editor;
