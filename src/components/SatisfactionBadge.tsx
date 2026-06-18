import styles from './SatisfactionBadge.module.css';

/** Decorative "100% Wyze satisfaction guarantee" seal. */
export function SatisfactionBadge() {
  return (
    <div className={styles.badge} role="img" aria-label="100% Wyze satisfaction guarantee">
      <svg className={styles.scallop} viewBox="0 0 100 100" aria-hidden="true">
        <path
          d={scallopPath(50, 50, 50, 42, 18)}
          fill="var(--c-primary)"
        />
      </svg>
      <span className={styles.content}>
        <strong className={styles.pct}>100%</strong>
        <span className={styles.text}>
          Wyze
          <br />
          satisfaction
          <br />
          guarantee
        </span>
      </span>
    </div>
  );
}

/** Build a scalloped (flower-like) seal outline. */
function scallopPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  bumps: number,
): string {
  const pts: string[] = [];
  const steps = bumps * 2;
  for (let i = 0; i < steps; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * 2 * i) / steps - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${pts.join(' ')} Z`;
}
