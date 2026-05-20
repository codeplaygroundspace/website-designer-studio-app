"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { sections } from "./data/intake-form-data";

interface MobileBottomNavProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function MobileBottomNav({
  activeSection,
  onSectionChange,
}: MobileBottomNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateFades();
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateFades, { passive: true });
    return () => el?.removeEventListener("scroll", updateFades);
  }, []);

  // Scroll active pill into view when section changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>(
      `[data-section-id="${activeSection}"]`,
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSection]);

  return (
    <nav
      aria-label="Form sections"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm lg:hidden"
    >
      <div className="relative">
        {showLeftFade && (
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
        )}
        {showRightFade && (
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />
        )}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                data-section-id={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[13.5px] transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/75 hover:border-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-medium tabular-nums">{section.number}</span>
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
