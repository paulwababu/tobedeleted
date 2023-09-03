import React, { useLayoutEffect, useContext } from 'react';
import styled from 'styled-components';
import { WaxContext } from 'wax-prosemirror-core';

const AskAIForm = styled.div`
  width: 400px;
  height: 100%;
  padding: 8px 12px;
  background: #FAFAFA;
  border: 0.5px #DCDCDC solid;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const AskAIFormText = styled.label`
  color: #BFBFBF;
  font-size: 14px;
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 400;
  line-height: 22px;
  word-wrap: break-word;
  cursor: text;
`;

const AskAIOverlay = ({ setPosition, position }) => {
  const { activeView } = useContext(WaxContext);

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
    <AskAIForm>
      <AskAIFormText contentEditable={true}>
        How can AI help you?
      </AskAIFormText>
    </AskAIForm>
  );
};

export default AskAIOverlay;
