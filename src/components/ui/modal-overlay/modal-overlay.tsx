import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    data-testid='modal-overlay'
    role='button'
    tabIndex={0}
    aria-label='Закрыть'
  />
);
