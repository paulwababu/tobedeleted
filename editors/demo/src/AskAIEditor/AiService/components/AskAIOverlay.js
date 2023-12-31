import React, { useRef, useLayoutEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { WaxContext } from 'wax-prosemirror-core';
import { icons } from 'wax-prosemirror-core';
import { replaceSelectedText } from '../ReplaceSelectedText';
import { insertTextBelowSelection } from '../InsertTextBelowSelection';

const ActionButton = styled.button`
  align-items: center;
  align-self: stretch;
  background: white;
  border: 0.5px #f0f0f0 solid;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  justify-content: flex-start;
  padding: 8px 12px;
`;

const ActionSection = styled.div`
  align-items: flex-start;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 188px;
`;

const ActionText = styled.div`
  color: ${props => props.color || '#434343'};
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  word-wrap: break-word;
`;

const AskAIForm = styled.div`
  align-items: center;
  background: #fafafa;
  border: 0.5px #dcdcdc solid;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  gap: 10px;
  justify-content: space-between;
  padding: 8px 12px;
  width: 458px;
`;

const AskAIFormInput = styled.input`
  background: transparent;
  border: none;
  color: #000;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  outline: none;
  width: 100%;
`;

const ResultDiv = styled.div`
  align-items: center;
  background: white;
  border: 0.5px #dcdcdc solid;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  gap: 10px;
  justify-content: space-between;
  padding: 8px 12px;
  width: 458px;
`;

const ResultText = styled.div`
  color: black;
  flex: 1 1 0;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  word-wrap: break-word;
`;

const SubmitButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0 8px; /* Adjust padding as needed */
`;

const AskAIOverlay = ({ setPosition, position, config }) => {
  const { activeView } = useContext(WaxContext);
  const [result, setResult] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const AskAiContentTransformation = config.AskAiContentTransformation;
  const inputRef = useRef(null);

  const tryAgain = () => {
    // Reset the state to initial values
    setIsSubmitted(false);
    setResult('');

    // Call the handleSubmit function again
    handleSubmit(new Event('submit'));
  };

  const handleInsertTextBelow = () => {
    insertTextBelowSelection(activeView, result);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    const inputValue = inputRef.current.value;
  
    // Get the highlighted text from the editor
    const { from, to } = activeView.state.selection;
    const highlightedText = activeView.state.doc.textBetween(from, to);
  
    // Combine the user's input and the highlighted text
    const combinedInput = `${inputValue}\n\nHighlighted Text: ${highlightedText}`;
  
    try {
      const response = await AskAiContentTransformation(combinedInput);
      setResult(response);
      setIsSubmitted(true);
    } catch (error) {
      setResult(error);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };  
  

  const handleReplaceText = () => {
    replaceSelectedText(activeView, result);
  };

  const discardResults = () => {
    // Clear the input field
    inputRef.current.value = '';

    // Reset the state variables
    setResult('');
    setIsSubmitted(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useLayoutEffect(() => {
    const WaxSurface = activeView.dom.getBoundingClientRect();
    const { selection } = activeView.state;
    const { from, to } = selection;
    const start = activeView.coordsAtPos(from);
    const end = activeView.coordsAtPos(to);

    const left = (start.left + end.left) / 2 - WaxSurface.left - 200;
    const topOffset = 24;
    const top = end.top - WaxSurface.top + topOffset;

    setPosition({ ...position, left, top });
  }, [position.left]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AskAIForm>
        <AskAIFormInput
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="✨ Find a better way to word this"
        />
        <SubmitButton onClick={handleSubmit}>
          {isLoading ? <icons.loaderIco /> : <icons.submitIco />}
        </SubmitButton>
      </AskAIForm>
      {isSubmitted && (
        <>
          <ResultDiv>
            <ResultText>{result}</ResultText>
          </ResultDiv>
          <ActionSection>
            <ActionButton onClick={handleReplaceText}>
              <ActionText>
                <icons.replaceIco /> Replace selected text
              </ActionText>
            </ActionButton>
            <ActionButton onClick={handleInsertTextBelow}>
              <ActionText>
                <icons.insertIco /> Insert
              </ActionText>
            </ActionButton>
            <ActionButton onClick={tryAgain}>
              <ActionText>
                <icons.tryAgain /> Try again
              </ActionText>
            </ActionButton>
            <ActionButton onClick={discardResults}>
              <ActionText color="#FF4E4E">
                <icons.deleteIco /> Discard
              </ActionText>
            </ActionButton>
          </ActionSection>
        </>
      )}
    </>
  );
};

export default AskAIOverlay;
