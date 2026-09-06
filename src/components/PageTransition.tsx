import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * PageTransition wraps the page outlet and applies a smooth
 * fade + slight upward-slide animation whenever the pathname changes.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useRouterState({ select: (s) => s.location.pathname });
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionState, setTransitionState] = useState<"idle" | "exit" | "enter">("idle");
  const prevPath = useRef(location);

  useEffect(() => {
    if (location === prevPath.current) {
      setDisplayChildren(children);
      return;
    }

    // Start exit animation
    setTransitionState("exit");

    const enterTimer = setTimeout(() => {
      setDisplayChildren(children);
      prevPath.current = location;
      setTransitionState("enter");

      const idleTimer = setTimeout(() => {
        setTransitionState("idle");
      }, 400);

      return () => clearTimeout(idleTimer);
    }, 250); // exit duration

    return () => clearTimeout(enterTimer);
  }, [location, children]);

  return (
    <div
      data-transition={transitionState}
      className="page-transition-wrapper"
    >
      {displayChildren}
    </div>
  );
}
