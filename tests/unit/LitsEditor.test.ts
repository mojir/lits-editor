import { describe, it, expect, beforeEach, vi } from "vitest";
import { LitsEditor } from "../../src/components/LitsEditor";

// Mock @mojir/lits
vi.mock("@mojir/lits", () => ({
  Lits: class {
    tokenize(_code: string) {
      return {
        tokens: [
          ["ReservedSymbol", "let", 0],
          ["Whitespace", " ", 3],
          ["Symbol", "x", 4],
          ["Whitespace", " ", 5],
          ["Operator", "=", 6],
          ["Whitespace", " ", 7],
          ["Number", "42", 8],
        ],
      };
    }
  },
}));

describe("LitsEditor", () => {
  beforeEach(() => {
    if (!customElements.get("lits-editor")) {
      customElements.define("lits-editor", LitsEditor);
    }
  });

  it("should create element", () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    expect(element).toBeInstanceOf(LitsEditor);
  });

  it("should handle value property", () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    element.value = "let x = 42";
    expect(element.value).toBe("let x = 42");
  });

  it("should handle showLineNumbers property", () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    element.showLineNumbers = true;
    expect(element.showLineNumbers).toBe(true);
    expect(element.getAttribute("show-line-numbers")).toBe("true");
  });

  it("should emit input event on value change", async () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    document.body.appendChild(element);

    const inputHandler = vi.fn();
    element.addEventListener("input", inputHandler);

    element.value = "let x = 42";

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(inputHandler).toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it("should handle readonly attribute", () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    element.readonly = true;
    expect(element.readonly).toBe(true);
    expect(element.getAttribute("readonly")).toBe("true");
  });

  it("should focus and blur", () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    document.body.appendChild(element);

    const focusHandler = vi.fn();
    const blurHandler = vi.fn();
    element.addEventListener("focus", focusHandler);
    element.addEventListener("blur", blurHandler);

    element.focus();
    expect(focusHandler).toHaveBeenCalled();

    element.blur();
    expect(blurHandler).toHaveBeenCalled();

    document.body.removeChild(element);
  });
});
