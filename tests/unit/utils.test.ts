import { describe, it, expect, vi } from "vitest";
import { escapeHtml, debounce } from "../../src/utils/dom";
import { handleTab, insertPair } from "../../src/utils/editor";

describe("DOM Utils", () => {
  describe("escapeHtml", () => {
    it("should escape HTML characters", () => {
      expect(escapeHtml("<div>Test</div>")).toBe("&lt;div&gt;Test&lt;/div&gt;");
      expect(escapeHtml("&nbsp;")).toBe("&amp;nbsp;");
      expect(escapeHtml('"quotes"')).toBe("&quot;quotes&quot;");
    });
  });

  describe("debounce", () => {
    it("should debounce function calls", async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Editor Utils", () => {
  describe("handleTab", () => {
    it("should insert spaces on tab", () => {
      const textarea = document.createElement("textarea");
      textarea.value = "test";
      textarea.selectionStart = textarea.selectionEnd = 4;

      handleTab(textarea, false);
      expect(textarea.value).toBe("test  ");
      expect(textarea.selectionStart).toBe(6);
    });

    it("should remove spaces on shift+tab", () => {
      const textarea = document.createElement("textarea");
      textarea.value = "  test";
      textarea.selectionStart = textarea.selectionEnd = 2;

      handleTab(textarea, true);
      expect(textarea.value).toBe("test");
      expect(textarea.selectionStart).toBe(0);
    });
  });

  describe("insertPair", () => {
    it("should insert matching pairs", () => {
      const textarea = document.createElement("textarea");
      textarea.value = "test";
      textarea.selectionStart = textarea.selectionEnd = 4;

      insertPair(textarea, "(", ")");
      expect(textarea.value).toBe("test()");
      expect(textarea.selectionStart).toBe(5);
      expect(textarea.selectionEnd).toBe(5);
    });

    it("should wrap selection", () => {
      const textarea = document.createElement("textarea");
      textarea.value = "hello world";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;

      insertPair(textarea, '"', '"');
      expect(textarea.value).toBe('"hello" world');
      expect(textarea.selectionStart).toBe(1);
      expect(textarea.selectionEnd).toBe(6);
    });
  });
});
