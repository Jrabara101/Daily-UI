import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import SignUp from './components/SignUp';

function App() {
  const formRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'easeOut' }
    );
  }, []);

  return (
    <div className="w-full h-screen">
      <div ref={formRef} className="w-full h-full">
        <SignUp />
      </div>
    </div>
  );
}

export default App;
