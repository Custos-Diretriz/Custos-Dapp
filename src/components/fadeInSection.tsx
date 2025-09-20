import React from "react";

function FadeInSection(props: { children: React.ReactNode, skipAnimation?: boolean }) {
  const [isVisible, setVisible] = React.useState(props.skipAnimation || false);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // If skipAnimation is true, make it visible immediately
    if (props.skipAnimation) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Add a small delay to ensure smooth transition
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              setVisible(true);
            });
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "10px", // Small margin to trigger slightly earlier
      }
    );

    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [props.skipAnimation]);

  return (
    <div
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
      style={{
        WebkitTransform: isVisible ? "none" : (props.skipAnimation ? "none" : "translateY(20vh)"),
        transform: isVisible ? "none" : (props.skipAnimation ? "none" : "translateY(20vh)"),
      }}
    >
      {props.children}
    </div>
  );
}

export default FadeInSection;
