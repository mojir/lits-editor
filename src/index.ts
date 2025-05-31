import { LitsEditor } from "./components/LitsEditor";

// Register the custom element
if (!customElements.get("lits-editor")) {
  customElements.define("lits-editor", LitsEditor);
}

// Export for programmatic use
export { LitsEditor };
export * from "./types";
export * from "./themes/default";
export * from "./themes/dark";
