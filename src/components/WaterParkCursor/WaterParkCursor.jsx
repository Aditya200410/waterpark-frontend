import React, { useState, useEffect } from 'react';
import './WaterParkCursor.css';

const WaterParkCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Create new bubble occasionally
      if (Math.random() < 0.2) {
        createBubble(e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      // Create splash bubbles on click
      createBubble(mousePosition.x, mousePosition.y);
      createBubble(mousePosition.x + 10, mousePosition.y + 10);
      createBubble(mousePosition.x - 10, mousePosition.y - 10);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const createBubble = (x, y) => {
    const newBubble = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.6 + 0.4,
      animationDuration: Math.random() * 2 + 1.5
    };

    setBubbles(prev => [...prev.slice(-5), newBubble]);

    // Remove bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id));
    }, newBubble.animationDuration * 1000);
  };

  // Don't render on mobile devices
  if (window.innerWidth <= 768) {
    return null;
  }

  return (
    <div className="water-park-cursor-container z-[99999999999]">
      {/* Main cursor */}
      <div
        className={`water-park-cursor ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          left: mousePosition.x - 15,
          top: mousePosition.y - 15,
        }}
      >
        <div className="cursor-inner">
          <div className="water-drop"></div>
          <div className="ripple"></div>
        </div>
      </div>

      {/* Floating bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="floating-bubble"
          style={{
            left: bubble.x - bubble.size / 2,
            top: bubble.y - bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
            animationDuration: `${bubble.animationDuration}s`,
          }}
        />
      ))}

      {/* Background water effect */}
      <div className="water-background-effect" />
    </div>
  );
};

export default WaterParkCursor;
