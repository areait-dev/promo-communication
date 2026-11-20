import { LOGO } from "@/data/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`logo ${className}`}
      viewBox="500 244.69 440 410.62"
      role="img"
      aria-label="PromoCommunication"
      dangerouslySetInnerHTML={{ __html: LOGO }}
    />
  );
}
