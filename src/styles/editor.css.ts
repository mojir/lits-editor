export function getStyles(): string {
  return `
    :host {
      display: block;
      position: relative;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      font-size: 14px;
      line-height: 1.5;
      border: 1px solid var(--lits-border, #ddd);
      border-radius: 4px;
      overflow: hidden;
      background: var(--lits-background, #ffffff);
      color: var(--lits-text, #333333);
    }

    .editor-container {
      position: relative;
      display: flex;
      min-height: 100px;
      max-height: 600px;
      overflow: auto;
    }

    .line-numbers {
      flex-shrink: 0;
      padding: 8px 4px;
      text-align: right;
      background: var(--lits-line-number-bg, #f7f7f7);
      color: var(--lits-line-number, #999);
      user-select: none;
      border-right: 1px solid var(--lits-border, #ddd);
    }

    .line-number {
      display: block;
      padding: 0 8px;
    }

    .editor-content {
      position: relative;
      flex: 1;
      padding: 8px;
    }

    textarea,
    .highlight-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 8px;
      border: none;
      outline: none;
      resize: none;
      font: inherit;
      line-height: inherit;
      white-space: pre;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    textarea {
      color: transparent;
      background: transparent;
      caret-color: var(--lits-cursor, #333);
      z-index: 2;
    }

    textarea::selection {
      background: var(--lits-selection, rgba(0, 120, 215, 0.3));
    }

    .highlight-layer {
      pointer-events: none;
      z-index: 1;
      color: var(--lits-text, #333);
    }

    /* Token highlighting */
    .token-ReservedSymbol {
      color: var(--lits-keyword, #0000ff);
      font-weight: 500;
    }
    .token-String {
      color: var(--lits-string, #a31515);
    }
    .token-Number,
    .token-BasePrefixedNumber {
      color: var(--lits-number, #098658);
    }
    .token-SingleLineComment,
    .token-MultiLineComment,
    .token-DocString {
      color: var(--lits-comment, #008000);
      font-style: italic;
    }
    .token-Operator {
      color: var(--lits-operator, #333);
    }
    .token-Symbol {
      color: var(--lits-symbol, #001080);
    }
    .token-RegexpShorthand {
      color: var(--lits-regexp, #811f3f);
    }
    .token-Unknown {
      color: var(--lits-error, #ff0000);
      text-decoration: wavy underline;
    }

    .error-line {
      background: var(--lits-error-bg, rgba(255, 0, 0, 0.1));
    }

    .error-tooltip {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: var(--lits-error, #ff0000);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      margin-bottom: 4px;
      z-index: 10;
      display: none;
    }

    .error-tooltip.show {
      display: block;
    }

    :host([readonly="true"]) textarea {
      cursor: default;
    }

    @media (max-width: 600px) {
      :host {
        font-size: 16px; /* Prevent iOS zoom */
      }
    }
  `;
}
