"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

interface CustomMotionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const Motion = ({
  children,
  className,
  ...props
}: CustomMotionProps) => {
  const Component = motion as any;
  return (
    <Component {...props} className={className}>
      {children}
    </Component>
  );
};
