import type { ReactNode } from 'react';
import type { StepDef } from '../types';
import { ProductIcon, ChevronDown } from './icons';
import styles from './AccordionStep.module.css';

interface Props {
  step: StepDef;
  index: number;
  total: number;
  open: boolean;
  selectedCount: number;
  onToggle: () => void;
  children: ReactNode;
}

export function AccordionStep({
  step,
  index,
  total,
  open,
  selectedCount,
  onToggle,
  children,
}: Props) {
  const panelId = `step-panel-${step.id}`;

  return (
    <section className={`${styles.step} ${open ? styles.open : ''}`}>
      <p className={styles.eyebrow}>
        STEP {index} OF {total}
      </p>

      <div className={styles.inner}>
        <button
          type="button"
          className={styles.header}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <span className={styles.heading}>
            <ProductIcon name={step.icon} className={styles.stepIcon} />
            <span className={styles.title}>{step.title}</span>
          </span>
          <span className={styles.state}>
            {open && (
              <span className={styles.count}>{selectedCount} selected</span>
            )}
            <ChevronDown
              className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
            />
          </span>
        </button>

        {open && (
          <div id={panelId} className={styles.body}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
