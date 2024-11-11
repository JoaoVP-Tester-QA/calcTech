// src/declaration.d.ts
declare namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        placeholder?: string;
      };
    }
  }
  