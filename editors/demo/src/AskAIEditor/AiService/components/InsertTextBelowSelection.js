export const insertTextBelowSelection = (view, AskAiContentTransformation) => {
  let { state } = view;
  let { tr } = state;

  const { to } = tr.selection;

  // Insert placeholder text below the selection
  const placeholderText = 'Please hold for a moment...';
  const placeholderParagraph = state.schema.nodes.paragraph.create(
    {},
    state.schema.text(placeholderText),
  );

  // Insert the placeholder paragraph node below the selection
  tr = tr.insert(to + 1, placeholderParagraph);

  // Dispatch the transaction to update the state with placeholder
  view.dispatch(tr);

  // Perform the AI transformation
  AskAiContentTransformation().then(transformedText => {
    // Get the most recent state
    state = view.state;
    tr = state.tr; // Start with a new transaction from the most recent state

    // Create a new paragraph node with the transformed text
    const paragraph = state.schema.nodes.paragraph.create(
      {},
      state.schema.text(transformedText),
    );

    // Calculate the position to replace the placeholder
    const placeholderStart = to + 1;
    const placeholderEnd = placeholderStart + placeholderText.length;

    // Replace the placeholder paragraph node with the new paragraph node
    tr = tr.replaceWith(placeholderStart, placeholderEnd, paragraph);

    // Dispatch the transaction to update the state
    view.dispatch(tr);
  });
};
