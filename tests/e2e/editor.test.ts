import { describe, it, expect, beforeAll } from "vitest";
import { LitsEditor } from "../../src/components/LitsEditor";

describe("LitsEditor E2E", () => {
  beforeAll(() => {
    if (!customElements.get("lits-editor")) {
      customElements.define("lits-editor", LitsEditor);
    }
  });

  it("should tokenize and highlight code", async () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    document.body.appendChild(element);

    element.value = "let x = 42; comment";

    // Wait for tokenization
    await new Promise((resolve) => setTimeout(resolve, 100));

    const shadowRoot = element.shadowRoot!;
    const highlightLayer = shadowRoot.querySelector(".highlight-layer");

    expect(highlightLayer?.innerHTML).toContain("token-ReservedSymbol");
    expect(highlightLayer?.innerHTML).toContain("token-Number");
    expect(highlightLayer?.innerHTML).toContain("token-SingleLineComment");

    document.body.removeChild(element);
  });

  it("should show line numbers when enabled", () => {
    const element = document.createElement("lits-editor") as LitsEditor;
    document.body.appendChild(element);

    element.value = "line1\nline2\nline3";
    element.showLineNumbers = true;

    const shadowRoot = element.shadowRoot!;
    const lineNumbers = shadowRoot.querySelectorAll(".line-number");

    expect(lineNumbers.length).toBe(3);
    expect(lineNumbers[0].textContent).toBe("1");
    expect(lineNumbers[2].textContent).toBe("3");

    document.body.removeChild(element);
  });
});
