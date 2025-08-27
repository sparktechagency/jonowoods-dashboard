import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import JoditEditor from "jodit-react";
import "./jodit-editor.css";

const JoditTextEditor = forwardRef(({ value, onChange, tabIndex, onBlur, ...props }, ref) => {
  const editor = useRef(null);
  const [internalValue, setInternalValue] = useState(value || '');
  const [isInitialized, setIsInitialized] = useState(false);
  const isUserTyping = useRef(false);
  const lastExternalValue = useRef(value);

  // Expose editor methods to parent component
  useImperativeHandle(ref, () => ({
    get value() {
      return editor.current?.value || internalValue;
    },
    focus: () => {
      editor.current?.focus();
    },
    blur: () => {
      editor.current?.blur();
    }
  }), [internalValue]);

  // Enhanced config with focus preservation
  const config = {
    readonly: false,
    placeholder: 'Start typing...',
    height: 300,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    processPasteHTML: false,
    // Prevent auto-focus issues
    autofocus: false,
    tab: {
      tabSize: 4,
    },
    // Event handlers to maintain cursor position
    events: {
      afterInit: () => {
        setIsInitialized(true);
      },
      beforeDestruct: () => {
        setIsInitialized(false);
      }
    },
    ...props.config
  };

  // Only update internal value when external value changes significantly
  useEffect(() => {
    // Only update if:
    // 1. User is not currently typing
    // 2. External value has actually changed
    // 3. Editor is initialized
    if (!isUserTyping.current && 
        value !== lastExternalValue.current && 
        isInitialized) {
      
      lastExternalValue.current = value;
      setInternalValue(value || '');
    }
  }, [value, isInitialized]);

  // Debounced change handler to prevent excessive updates
const handleChange = useCallback((newContent) => {
  setInternalValue(newContent);

  if (onChange) {
    onChange(newContent); // parent এ পাঠাবে সাথে সাথে
  }
}, [onChange]);

  const handleBlur = useCallback((newContent) => {
    isUserTyping.current = false;
    if (onBlur) {
      onBlur(newContent);
    }
  }, [onBlur]);

  // Handle focus events
  const handleFocus = useCallback(() => {
    isUserTyping.current = true;
  }, []);

  return (
    <div className="jodit-editor-container">
      <JoditEditor
        ref={editor}
        value={internalValue}
        config={{
          ...config,
          events: {
            ...config.events,
            focus: handleFocus,
          }
        }}
        onBlur={handleBlur}
        onChange={handleChange}
        tabIndex={tabIndex || 1}
        {...props}
      />
    </div>
  );
});

export default JoditTextEditor;