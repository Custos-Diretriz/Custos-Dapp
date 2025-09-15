"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as?: "input" | "textarea";
}

const Input = React.forwardRef<
  HTMLInputElement & HTMLTextAreaElement,
  InputProps
>(({ className, type, as = "input", ...props }, ref) => {
  const radius = 100; // hover effect radius
  const [visible, setVisible] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const commonClasses = cn(
    `shadow-input dark:placeholder-text-neutral-600 w-full rounded-lg border-none bg-[#292929da] px-3 py-2 text-sm text-white
       transition duration-400 group-hover/input:shadow-none
       placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none
       disabled:cursor-not-allowed disabled:opacity-50
       dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
    className
  );

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
            radial-gradient(
              ${
                visible ? radius + "px" : "0px"
              } circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 80%
            )
          `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-lg p-[2px] transition duration-300"
    >
      {as === "textarea" ? (
        <textarea
          className={commonClasses + " min-h-[6rem] resize-none"}
          ref={ref as any}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          className={commonClasses}
          ref={ref as any}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </motion.div>
  );
});

Input.displayName = "Input";

export { Input };
