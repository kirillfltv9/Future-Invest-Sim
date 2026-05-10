import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}

/** Smoothly tweens between numeric values whenever `value` changes. */
export function AnimatedNumber({ value, durationMs = 700, format, className }: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);

    const step = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (value - fromRef.current) * e;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return <span className={className}>{format ? format(display) : Math.round(display).toLocaleString("en-US")}</span>;
}
