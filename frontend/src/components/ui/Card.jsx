import React from "react";
import { clsx } from "clsx";

const Card = ({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "default",
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200 shadow-sm";
  const hoverClasses = hover
    ? "hover:shadow-md transition-shadow duration-200 cursor-pointer"
    : "";

  const paddingClasses = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        baseClasses,
        hoverClasses,
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
