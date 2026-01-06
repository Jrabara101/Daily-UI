/**
 * Gestural Interaction System
 * Handles double-tap, swipe, and pinch gestures
 */

export const createGestureHandler = (callbacks) => {
  const {
    onDoubleTapRight,
    onSwipeVertical,
    onPinchZoom,
  } = callbacks;

  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let initialDistance = 0;
  let initialVolume = 1;

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    
    // Handle double tap
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 300 && tapLength > 0) {
      const deltaX = Math.abs(touch.clientX - lastTapX);
      const deltaY = Math.abs(touch.clientY - lastTapY);
      
      if (deltaX < 50 && deltaY < 50) {
        // Double tap detected
        const rect = e.currentTarget.getBoundingClientRect();
        const tapX = touch.clientX - rect.left;
        const width = rect.width;
        
        if (tapX > width / 2 && onDoubleTapRight) {
          onDoubleTapRight();
        }
      }
    }
    
    lastTapTime = currentTime;
    lastTapX = touch.clientX;
    lastTapY = touch.clientY;

    // Handle pinch start
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      // Single touch - handle swipe
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;
      
      if (deltaTime < 300) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Vertical swipe (volume control)
        if (absDeltaY > absDeltaX && absDeltaY > 30 && onSwipeVertical) {
          e.preventDefault(); // Prevent scrolling
          const volumeChange = -deltaY / 200; // Adjust sensitivity
          onSwipeVertical(volumeChange);
          touchStartY = touch.clientY; // Reset to prevent accumulation
        }
      }
    } else if (e.touches.length === 2 && onPinchZoom) {
      e.preventDefault(); // Prevent pinch zoom on page
      // Pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scale = currentDistance / initialDistance;
      if (scale > 1.2) {
        onPinchZoom(true); // Zoom in
        initialDistance = currentDistance;
      } else if (scale < 0.8) {
        onPinchZoom(false); // Zoom out
        initialDistance = currentDistance;
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
  };
};
