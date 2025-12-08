declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          alt?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};

