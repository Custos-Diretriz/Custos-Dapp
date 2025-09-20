declare module 'react-signature-canvas' {
  import { Component } from 'react';

  interface SignaturePadProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    backgroundColor?: string;
    penColor?: string;
    velocityFilterWeight?: number;
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    throttle?: number;
    onBegin?: () => void;
    onEnd?: () => void;
    ref?: React.Ref<SignaturePad>;
  }

  class SignaturePad extends Component<SignaturePadProps> {
    clear(): void;
    isEmpty(): boolean;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromDataURL(dataURL: string, options?: { ratio?: number; width?: number; height?: number }): void;
    getCanvas(): HTMLCanvasElement;
    getTrimmedCanvas(): HTMLCanvasElement;
    getSignaturePad(): any;
  }

  export default SignaturePad;
}
