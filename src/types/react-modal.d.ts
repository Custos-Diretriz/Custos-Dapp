declare module 'react-modal' {
  import { Component, ReactNode } from 'react';

  interface ModalProps {
    isOpen: boolean;
    onRequestClose?: () => void;
    contentLabel?: string;
    children?: ReactNode;
    className?: string;
    overlayClassName?: string;
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEsc?: boolean;
    ariaHideApp?: boolean;
    style?: {
      content?: React.CSSProperties;
      overlay?: React.CSSProperties;
    };
  }

  class Modal extends Component<ModalProps> {}

  export default Modal;
}
