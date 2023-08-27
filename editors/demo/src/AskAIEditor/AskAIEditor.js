import React, { useRef } from 'react';
import { Wax } from 'wax-prosemirror-core';
import { config } from './config';
import { AskAILayout } from './layout';

const initialValue = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`;  // Initial content for the editor

const AskAIEditor = () => {
  const editorRef = useRef();

  return (
    <Wax
      ref={editorRef}
      config={config}
      autoFocus
      placeholder="Type Something..."
      value={initialValue}
      onChange={source => console.log(source)}
      layout={AskAILayout}
    />
  );
};

export default AskAIEditor;
