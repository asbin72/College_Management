import React, { useState, useEffect, useRef } from 'react';

export const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    let start = 0;
    const endNum = parseInt(end.toString().replace(/,/g, ''), 10);
    if (isNaN(endNum)) {
      setCount(end);
      return;
    }

    const totalSteps = 50;
    const increment = endNum / totalSteps;
    const stepTime = duration / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= endNum) {
        setCount(endNum);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span ref={countRef} className="font-num tracking-tight" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};
