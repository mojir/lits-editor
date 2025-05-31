import { Lits } from "@mojir/lits";
import type { TokenInfo } from "../types";
import { escapeHtml, debounce } from "../utils/dom";
import { handleTab, insertPair } from "../utils/editor";
import { tokenizeCode } from "../utils/tokenizer";
import { getStyles } from "../styles/editor.css";

export class LitsEditor extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      "value",
      "show-line-numbers",
      "show-errors",
      "readonly",
      "placeholder",
      "theme",
      "max-length",
    ];
  }

  private _value = "";
  private _tokens: TokenInfo[] = [];
  private _lits: Lits | null = null;
  private _isComposing = false;
  private _textarea: HTMLTextAreaElement | null = null;
  private _highlightLayer: HTMLDivElement | null = null;
  private _lineNumbers: HTMLDivElement | null = null;

  private _debouncedTokenize = debounce(() => this.tokenize(), 50);

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
    this.initializeLits();

    // Set initial value from text content if no value attribute
    if (!this.hasAttribute("value") && this.textContent?.trim()) {
      this.value = this.textContent.trim();
      this.textContent = "";
    }
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;

    switch (name) {
      case "value":
        this.value = newValue || "";
        break;
      case "show-line-numbers":
      case "show-errors":
      case "readonly":
        this.updateDisplay();
        break;
      case "placeholder":
        if (this._textarea) {
          this._textarea.placeholder = newValue || "";
        }
        break;
      case "max-length":
        if (this._textarea) {
          this._textarea.maxLength = newValue ? parseInt(newValue) : -1;
        }
        break;
    }
  }

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    if (this._value !== val) {
      this._value = val || "";
      this.updateTextarea();
      this._debouncedTokenize();
    }
  }

  get showLineNumbers(): boolean {
    return this.getAttribute("show-line-numbers") === "true";
  }

  set showLineNumbers(val: boolean) {
    this.setAttribute("show-line-numbers", val ? "true" : "false");
  }

  get showErrors(): boolean {
    return this.getAttribute("show-errors") === "true";
  }

  set showErrors(val: boolean) {
    this.setAttribute("show-errors", val ? "true" : "false");
  }

  get readonly(): boolean {
    return this.getAttribute("readonly") === "true";
  }

  set readonly(val: boolean) {
    this.setAttribute("readonly", val ? "true" : "false");
  }

  focus(): void {
    this._textarea?.focus();
  }

  blur(): void {
    this._textarea?.blur();
  }

  private async initializeLits(): Promise<void> {
    try {
      const { Lits } = await import("@mojir/lits");
      this._lits = new Lits();
      this.tokenize();
      this.updateLineNumbers();
    } catch (error) {
      console.error("Failed to load Lits:", error);
      this.updateHighlighting();
    }
  }

  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${getStyles()}</style>
      <div class="editor-container" role="group" aria-label="Code editor">
        <div class="line-numbers" aria-hidden="true" style="display: none;"></div>
        <div class="editor-content">
          <div class="highlight-layer" aria-hidden="true"></div>
          <textarea 
            spellcheck="false" 
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="off"
            aria-label="Code input"
            aria-multiline="true"
            role="textbox"
          ></textarea>
          <div class="error-tooltip" role="tooltip"></div>
        </div>
      </div>
    `;

    this._textarea = this.shadowRoot.querySelector("textarea");
    this._highlightLayer = this.shadowRoot.querySelector(".highlight-layer");
    this._lineNumbers = this.shadowRoot.querySelector(".line-numbers");

    this.updateDisplay();
  }

  private setupEventListeners(): void {
    if (!this._textarea) return;

    this._textarea.addEventListener("input", this.handleInput.bind(this));
    this._textarea.addEventListener("keydown", this.handleKeydown.bind(this));
    this._textarea.addEventListener("scroll", this.handleScroll.bind(this));
    this._textarea.addEventListener("focus", () =>
      this.dispatchEvent(new Event("focus")),
    );
    this._textarea.addEventListener("blur", () =>
      this.dispatchEvent(new Event("blur")),
    );
    this._textarea.addEventListener(
      "compositionstart",
      () => (this._isComposing = true),
    );
    this._textarea.addEventListener("compositionend", () => {
      this._isComposing = false;
      this.handleInput();
    });

    const container = this.shadowRoot?.querySelector(".editor-container");
    container?.addEventListener("scroll", this.handleScroll.bind(this));
  }

  private removeEventListeners(): void {
    // Event listeners are automatically removed when the element is disconnected
  }

  private handleInput(): void {
    if (this._isComposing || !this._textarea) return;

    this._value = this._textarea.value;
    this._debouncedTokenize();
    this.updateLineNumbers();

    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this._value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTab(this._textarea!, e.shiftKey);
      this.handleInput();
    }

    const closeChars: Record<string, string> = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
    };

    if (closeChars[e.key] && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      insertPair(this._textarea!, e.key, closeChars[e.key]!);
      this.handleInput();
    }

    this.dispatchEvent(new KeyboardEvent("keydown", e));
  }

  private handleScroll(): void {
    if (!this._textarea || !this._highlightLayer) return;

    this._highlightLayer.scrollTop = this._textarea.scrollTop;
    this._highlightLayer.scrollLeft = this._textarea.scrollLeft;

    if (this._lineNumbers && this.showLineNumbers) {
      this._lineNumbers.scrollTop = this._textarea.scrollTop;
    }
  }

  private tokenize(): void {
    if (!this._lits) return;

    try {
      const tokens = tokenizeCode(this._lits, this._value);
      this._tokens = tokens;
      this.updateHighlighting();

      this.dispatchEvent(
        new CustomEvent("error", {
          detail: { error: null },
          bubbles: true,
        }),
      );
    } catch (error) {
      this.updateHighlighting();

      this.dispatchEvent(
        new CustomEvent("error", {
          detail: { error: (error as Error).message },
          bubbles: true,
        }),
      );
    }
  }

  private updateTextarea(): void {
    if (this._textarea && this._textarea.value !== this._value) {
      this._textarea.value = this._value;
    }
  }

  private updateDisplay(): void {
    this.updateLineNumbers();
    this.updateHighlighting();

    if (this._textarea) {
      this._textarea.readOnly = this.readonly;
      this._textarea.placeholder = this.getAttribute("placeholder") || "";
      const maxLength = this.getAttribute("max-length");
      if (maxLength && !isNaN(parseInt(maxLength))) {
        this._textarea.maxLength = parseInt(maxLength);
      }
    }
  }

  private updateLineNumbers(): void {
    if (!this._lineNumbers) return;

    if (this.showLineNumbers) {
      const lines = this._value.split("\n").length;
      const numbers = Array.from(
        { length: lines },
        (_, i) => `<span class="line-number">${i + 1}</span>`,
      ).join("");
      this._lineNumbers.innerHTML = numbers;
      this._lineNumbers.style.display = "block";
    } else {
      this._lineNumbers.style.display = "none";
    }
  }

  private updateHighlighting(): void {
    if (!this._highlightLayer) return;

    let html = "";
    let lastEnd = 0;

    for (const token of this._tokens) {
      // Add any text between tokens
      if (token.start > lastEnd) {
        html += escapeHtml(this._value.substring(lastEnd, token.start));
      }

      // Add the token
      html += `<span class="token-${token.type}">${escapeHtml(token.value)}</span>`;
      lastEnd = token.end;
    }

    // Add any remaining text
    if (lastEnd < this._value.length) {
      html += escapeHtml(this._value.substring(lastEnd));
    }

    // Add a trailing newline to ensure proper height
    if (!html.endsWith("\n")) {
      html += "\n";
    }

    this._highlightLayer.innerHTML = html;
  }
}
