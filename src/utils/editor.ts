export function handleTab(
  textarea: HTMLTextAreaElement,
  isShift: boolean,
): void {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  if (start === end) {
    // No selection, insert/remove spaces
    if (isShift) {
      // Remove indentation
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const beforeCursor = value.substring(lineStart, start);
      const spacesToRemove = Math.min(
        2,
        beforeCursor.match(/^ */)?.[0].length || 0,
      );

      if (spacesToRemove > 0) {
        textarea.value =
          value.substring(0, lineStart) +
          value.substring(lineStart + spacesToRemove);
        textarea.selectionStart = textarea.selectionEnd =
          start - spacesToRemove;
      }
    } else {
      // Add indentation
      textarea.value = value.substring(0, start) + "  " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }
  } else {
    // Selection, indent/dedent lines
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = value.indexOf("\n", end);
    const endPos = lineEnd === -1 ? value.length : lineEnd;

    const lines = value.substring(lineStart, endPos).split("\n");
    const newLines = lines.map((line) => {
      if (isShift) {
        return line.replace(/^ {2}/, "");
      } else {
        return "  " + line;
      }
    });

    const newText = newLines.join("\n");
    textarea.value =
      value.substring(0, lineStart) + newText + value.substring(endPos);

    // Restore selection
    textarea.selectionStart = lineStart;
    textarea.selectionEnd = lineStart + newText.length;
  }
}

export function insertPair(
  textarea: HTMLTextAreaElement,
  open: string,
  close: string,
): void {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.substring(start, end);

  textarea.value =
    value.substring(0, start) + open + selected + close + value.substring(end);
  textarea.selectionStart = start + 1;
  textarea.selectionEnd = start + 1 + selected.length;
}
