import type { HTMLAttributes } from "react";

export function Card(props: HTMLAttributes<HTMLElement>) {
  const { className = "", ...rest } = props;
  return <section className={`ui-card ${className}`} {...rest} />;
}
