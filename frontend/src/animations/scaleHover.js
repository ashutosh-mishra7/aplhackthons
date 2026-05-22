export const scaleHover = {
  initial: { scale: 1, filter: "brightness(1)" },
  hover: {
    scale: 1.03,
    filter: "brightness(1.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  },
  tap: { scale: 0.98 }
};
