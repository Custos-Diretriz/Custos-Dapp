import React, { useRef, useEffect } from "react";

const Section = ({ children, id, headerText }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      {
        threshold: 0.3, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id={id} className="section">
      {headerText && (
        <h2 className="text-3xl font-bold mb-12 text-center header-animation">
          {headerText}
        </h2>
      )}
      <div className="content">{children}</div>
    </section>
  );
};

export default Section;
