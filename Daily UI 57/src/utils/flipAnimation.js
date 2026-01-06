/**
 * FLIP (First, Last, Invert, Play) Animation for Theater Mode
 * Provides 60fps performance by using transform instead of layout properties
 */

export const createFLIPAnimation = (element, fromRect, toRect, duration = 300) => {
  if (!element) return Promise.resolve();

  // Calculate the difference
  const deltaX = fromRect.left - toRect.left;
  const deltaY = fromRect.top - toRect.top;
  const deltaWidth = fromRect.width / toRect.width;
  const deltaHeight = fromRect.height / toRect.height;

  // Set initial state (INVERT)
  element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaWidth}, ${deltaHeight})`;
  element.style.transformOrigin = 'top left';

  // Force reflow
  element.offsetHeight;

  // Animate to final state (PLAY)
  return new Promise((resolve) => {
    element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.transform = 'translate(0, 0) scale(1, 1)';

    const handleTransitionEnd = () => {
      element.style.transition = '';
      element.style.transform = '';
      element.style.transformOrigin = '';
      element.removeEventListener('transitionend', handleTransitionEnd);
      resolve();
    };

    element.addEventListener('transitionend', handleTransitionEnd);
    
    // Fallback timeout
    setTimeout(() => {
      element.removeEventListener('transitionend', handleTransitionEnd);
      resolve();
    }, duration + 100);
  });
};

export const getBoundingRect = (element) => {
  if (!element) return null;
  return element.getBoundingClientRect();
};

