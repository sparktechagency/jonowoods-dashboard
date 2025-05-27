import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const JoditTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

//   const config = {
//     readonly: false,
//     height: 200,
//     placeholder: "Share your thoughts...",
//     toolbarSticky: false,
//     buttons: [
//       "bold",
//       "italic",
//       "underline",
//       "strikethrough",
//       "|",
//       "ul",
//       "ol",
//       "|",
//       "link",
//       "image",
//       "video",
//       "|",
//       "undo",
//       "redo",
//       "|",
//       "source",
//     ],
//     // Customize or remove buttons here as needed
//   };

  return (
    <JoditEditor
      ref={editor}
      value={value}
    //   config={config}
      onChange={(newContent) => onChange(newContent)}
    />
  );
};

export default JoditTextEditor;
