# Lits Editor

A syntax-highlighting code editor web component for the [Lits programming language](https://github.com/mojir/lits).

## Features

- 🎨 Real-time syntax highlighting
- 📝 Full text editing capabilities
- 🎯 Smart indentation (Tab/Shift+Tab)
- 🔢 Optional line numbers
- 🚨 Syntax error display
- 🎭 Customizable themes via CSS variables
- 📱 Mobile-friendly
- ♿ Accessible (ARIA labels, keyboard navigation)
- ⚡ Performance optimized with debouncing
- 🔧 Framework-agnostic

## Installation

```bash
npm install lits-code-editor
```

## Usage

### Basic HTML

```html
<script type="module">
  import "lits-code-editor";
</script>

<lits-code-editor show-line-numbers="true">
  let greeting = "Hello, World!"; write!(greeting)
</lits-code-editor>
```

### JavaScript API

```javascript
const editor = document.querySelector("lits-code-editor");

// Set/get value
editor.value = "let x = 42;";
console.log(editor.value);

// Configure options
editor.showLineNumbers = true;
editor.readonly = false;
editor.placeholder = "Enter Lits code...";

// Listen to events
editor.addEventListener("input", (e) => {
  console.log("Code changed:", e.detail.value);
});

editor.addEventListener("error", (e) => {
  console.log("Syntax error:", e.detail.error);
});

// Focus management
editor.focus();
```

### Vue Integration

```vue
<template>
  <lits-code-editor
    :value="code"
    :show-line-numbers="true"
    @input="code = $event.detail.value"
    @error="handleError"
  />
</template>

<script setup>
import "lits-code-editor";
import { ref } from "vue";

const code = ref("let x = 42;");
const handleError = (e) => {
  console.error("Syntax error:", e.detail.error);
};
</script>
```

### React Integration

```jsx
import { useEffect, useRef } from "react";
import "lits-code-editor";

function LitsEditor({ value, onChange, onError }) {
  const ref = useRef(null);

  useEffect(() => {
    const editor = ref.current;
    if (!editor) return;

    const handleInput = (e) => onChange?.(e.detail.value);
    const handleError = (e) => onError?.(e.detail.error);

    editor.addEventListener("input", handleInput);
    editor.addEventListener("error", handleError);

    return () => {
      editor.removeEventListener("input", handleInput);
      editor.removeEventListener("error", handleError);
    };
  }, [onChange, onError]);

  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  return <lits-code-editor ref={ref} show-line-numbers="true" />;
}
```

## Theming

Customize the appearance using CSS custom properties:

```css
lits-code-editor {
  --lits-background: #1e1e1e;
  --lits-text: #d4d4d4;
  --lits-selection: #264f78;
  --lits-cursor: #aeafad;
  --lits-line-number: #858585;
  --lits-line-number-bg: #252526;
  --lits-keyword: #569cd6;
  --lits-string: #ce9178;
  --lits-number: #b5cea8;
  --lits-comment: #6a9955;
  --lits-operator: #d4d4d4;
  --lits-symbol: #9cdcfe;
  --lits-regexp: #d16969;
  --lits-error: #f48771;
  --lits-error-bg: rgba(244, 135, 113, 0.1);
  --lits-border: #464647;
}
```

## API Reference

### Attributes

| Attribute           | Type    | Default | Description              |
| ------------------- | ------- | ------- | ------------------------ |
| `value`             | string  | `''`    | The code content         |
| `show-line-numbers` | boolean | `false` | Show line numbers        |
| `show-errors`       | boolean | `false` | Show syntax errors       |
| `readonly`          | boolean | `false` | Make editor read-only    |
| `placeholder`       | string  | `''`    | Placeholder text         |
| `max-length`        | number  | -       | Maximum character length |

### Properties

All attributes are also available as JavaScript properties:

```javascript
editor.value = "code";
editor.showLineNumbers = true;
editor.showErrors = true;
editor.readonly = false;
```

### Methods

| Method    | Description      |
| --------- | ---------------- |
| `focus()` | Focus the editor |
| `blur()`  | Blur the editor  |

### Events

| Event     | Detail                      | Description                   |
| --------- | --------------------------- | ----------------------------- |
| `input`   | `{ value: string }`         | Fired when content changes    |
| `error`   | `{ error: string \| null }` | Fired on syntax errors        |
| `focus`   | -                           | Fired when editor gains focus |
| `blur`    | -                           | Fired when editor loses focus |
| `keydown` | -                           | Standard keyboard event       |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run linter
npm run lint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT
