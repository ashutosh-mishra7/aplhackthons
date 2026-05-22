export const floatingAnimation = (duration = 3, yRange = 8) => ({
  animate: {
    y: [-yRange, yRange, -yRange],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});
