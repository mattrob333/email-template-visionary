
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
        backgroundColor: "#0D1117", // Deeper black background
        color: "#f8f8f2",
        height: "100%",
        fontSize: "14px",
        fontFamily: "monospace",
      },
      ".cm-content": {
        padding: "10px",
        color: "#E06C75"
      },
      ".cm-line": {
        padding: "0 4px"
      },
      // Tag names in vibrant purple
      ".cm-tag": {
        color: "#C678DD"
      },
      // Attributes in bright orange
      ".cm-attribute": {
        color: "#E5C07B"
      },
      // Attribute values in bright cyan/blue
      ".cm-attributeValue": {
        color: "#61AFEF"
      },
      // Text content in bright green - more visible
      ".cm-text": {
        color: "#98C379"
      },
      // Comments in muted gray
      ".cm-comment": {
        color: "#7F848E",
        fontStyle: "italic"
      },
      // Selection highlighting
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": { 
        background: "rgba(137, 221, 255, 0.2)" 
      },
      // Active line highlighting - more visible
      ".cm-activeLine": {
        backgroundColor: "rgba(55, 65, 81, 0.5)"
      },
      // Gutters (line numbers)
      ".cm-gutters": {
        backgroundColor: "#0D1117",
        color: "#545862",
        border: "none"
      },
      ".cm-gutterElement": {
        padding: "0 5px 0 3px"
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
        EditorView.lineWrapping,
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
