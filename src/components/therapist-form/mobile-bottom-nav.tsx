"use client";

import { cn } from "@/lib/utils";
import { sections } from "./data/intake-form-data";

interface MobileBottomNavProps {
  activeSection: string;
}

export function MobileBottomNav({ activeSection }: MobileBottomNavProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Form sections"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm lg:hidden"
    >
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
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
    </nav>
  );
}
