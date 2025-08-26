import React, { useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import "./jodit-editor.css";

const JoditTextEditor = ({ value, onChange, tabIndex, onBlur, ...props }) => {
  const editor = useRef(null);

  // Use useEffect to handle value changes properly
  useEffect(() => {
    if (editor.current && value !== undefined) {
      // Only update if the current content is different from the new value
      const currentContent = editor.current.value || '';
      if (currentContent !== value) {
        editor.current.value = value || '';
      }
    }
  }, [value]);

  const config = {
    readonly: false,
    placeholder: 'Start typing...',
    height: 300,
    ...props.config
  };

  return (
    <div className="jodit-editor-container">
      <JoditEditor
        ref={editor}
        value={value || ''} // Ensure we always have a string
        config={config}
        onBlur={(newContent) => {
          if (onBlur) onBlur(newContent);
        }}
        onChange={(newContent) => {
          if (onChange) onChange(newContent);
        }}
        tabIndex={tabIndex || 1}
        {...props}
      />
    </div>
  );
};

export default JoditTextEditor;