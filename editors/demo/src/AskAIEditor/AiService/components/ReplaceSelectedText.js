import { TextSelection } from 'prosemirror-state';

export const replaceSelectedText = (view, AskAiContentTransformation) => {
  let { state } = view;
  let { tr } = state;

  // Log initial transaction
  console.log('Initial transaction:', tr);

  const { from, to } = tr.selection;

  // Log positions
  console.log('From:', from, 'To:', to);

  if (from !== to) {
    tr = tr.delete(from, to);
  }

  // Insert placeholder text
  const placeholderText = 'Please hold for a moment...';
  const placeholderNode = state.schema.text(placeholderText);
  tr = tr.replaceWith(from, from, placeholderNode);

  // Dispatch the transaction to update the state with placeholder
  view.dispatch(tr);

  // Perform the AI transformation
  AskAiContentTransformation().then(transformedText => {
    // Get the most recent state
    state = view.state;

    const newText = state.schema.text(transformedText);
    tr = state.tr.replaceWith(from, from + placeholderText.length, newText);

    // Log after replacing
    console.log('Transaction after replacing:', tr);

    // Dispatch the transaction to update the state
    view.dispatch(tr);

    // Fetch the most recent state again
    state = view.state;

    const newTo = from + transformedText.length;
    const newSelection = TextSelection.create(state.doc, newTo, newTo);
    tr = state.tr.setSelection(newSelection);

    // Log final transaction
    console.log('Final transaction:', tr);

    // Dispatch the final transaction to update the state
    view.dispatch(tr);
  });
};
