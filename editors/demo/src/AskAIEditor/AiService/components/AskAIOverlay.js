import React, { useLayoutEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { WaxContext } from 'wax-prosemirror-core';
import { icons } from 'wax-prosemirror-core';

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

const AskAIFormText = styled.div`
  color: ${props => (props.isFocused ? '#000' : '#BFBFBF')};
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  outline: none;
  width: 100%;
  word-wrap: break-word;
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

const ActionSection = styled.div`
  align-items: flex-start;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 188px;
`;

const ActionItem = styled.div`
  align-items: center;
  align-self: stretch;
  background: white;
  border: 0.5px #f0f0f0 solid;
  display: inline-flex;
  gap: 8px;
  justify-content: flex-start;
  padding: 8px 12px;
`;

const ActionText = styled.div`
  color: ${props => props.color || '#434343'};
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  word-wrap: break-word;
`;

const SubmitButton = styled.div`
  cursor: pointer;
  padding: 0 8px; /* Adjust padding as needed */
`;

const AskAIOverlay = ({ setPosition, position, config }) => {
  const { activeView } = useContext(WaxContext);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const AskAiContentTransformation = config.AskAiContentTransformation;
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    const response = await AskAiContentTransformation(inputValue);
    setResult(response);
    setIsSubmitted(true);
    setIsLoading(false);
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
        <AskAIFormText
          contentEditable={true}
          onFocus={() => setIsFocused(true)}
          onBlur={e => {
            setInputValue(e.target.innerText);
            setIsFocused(false);
          }}
          onKeyDown={handleKeyDown}
        >
          {isFocused ? (
            ''
          ) : (
            <>
              <span role="img" aria-label="roleImg">
                ✨
              </span>{' '}
              Find a better way to word this
            </>
          )}
        </AskAIFormText>
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
            <ActionItem>
              <ActionText>
                <icons.replaceIco /> Replace selected text
              </ActionText>
            </ActionItem>
            <ActionItem>
              <ActionText>
                <icons.insertIco /> Insert
              </ActionText>
            </ActionItem>
            <ActionItem>
              <ActionText>
                <icons.tryAgain /> Try again
              </ActionText>
            </ActionItem>
            <ActionItem>
              <ActionText color="#FF4E4E">
                <icons.deleteIco /> Discard
              </ActionText>
            </ActionItem>
          </ActionSection>
        </>
      )}
    </>
  );
};

export default AskAIOverlay;
