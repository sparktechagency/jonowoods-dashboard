import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import "./jodit-editor.css";

const JoditTextEditor = ({ value, onChange, tabIndex, onBlur, ...props }) => {
  const editor = useRef(null);

  return (
   <div className="jodit-editor-container">
     <JoditEditor
      ref={editor}
      value={value}
      tabIndex={tabIndex || 1}
      onBlur={onBlur || onChange}
      onChange={onChange}
      {...props}
    />
   </div>
  );
};

export default JoditTextEditor;
