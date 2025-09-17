import React from "react";
import { cn } from "../lib/utils";

/**
 * @param {{
 * children: React.ReactNode,
 * className?: string,
 * variant?: "default" | "strong" | "subtle" | "card"
 * }} props
 */
export default function GlassContainer({ children, className, variant = "default" }) {
  const variants = {
    default: "glass",
    strong: "glass-strong",
    subtle: "glass-subtle",
    card: "glass-card",
  };

  return <div className={cn(variants[variant], "rounded-xl", className)}>{children}</div>;
}