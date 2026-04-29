"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/features/reservaciones/lib/cn";

type StickyAsideProps = {
  children: ReactNode;
  className?: string;
  bottomOffset?: number;
};

export function StickyAside({
  children,
  className,
  bottomOffset = 2,
}: StickyAsideProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isPinned, setIsPinned] = useState(false);
  const [floatingStyle, setFloatingStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    function updatePosition() {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;

      if (!wrapper || !content) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const contentHeight = content.offsetHeight;
      const contentFitsViewport =
        contentHeight + bottomOffset * 2 < window.innerHeight;

      const shouldPin =
        window.scrollY > 0 &&
        contentFitsViewport &&
        wrapperRect.top + contentHeight <= window.innerHeight - bottomOffset;

      setIsPinned(shouldPin);

      if (shouldPin) {
        setFloatingStyle({
          position: "fixed",
          left: wrapperRect.left,
          bottom: bottomOffset,
          width: wrapperRect.width,
          zIndex: 30,
        });
      } else {
        setFloatingStyle({});
      }
    }

    updatePosition();

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    const resizeObserver = new ResizeObserver(updatePosition);

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      resizeObserver.disconnect();
    };
  }, [bottomOffset]);

  return (
    <div
      ref={wrapperRef}
      style={{
        minHeight: isPinned ? contentRef.current?.offsetHeight : undefined,
      }}
    >
      <div ref={contentRef} className={cn(className)} style={floatingStyle}>
        {children}
      </div>
    </div>
  );
}
