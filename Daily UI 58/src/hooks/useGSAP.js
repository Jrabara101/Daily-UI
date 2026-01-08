import { useEffect, useRef } from 'react';

export const useGSAP = (callback, deps = {}) => {
  const { scope, dependencies = [], revertOnUpdate = true } = deps;
  const ctxRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;

    // Load GSAP dynamically if not available
    if (typeof window !== 'undefined' && !window.gsap) {
      import('gsap').then(({ gsap }) => {
        window.gsap = gsap;
        executeCallback();
      });
      return;
    }

    executeCallback();

    function executeCallback() {
      if (!isMountedRef.current) return;

      if (revertOnUpdate && ctxRef.current) {
        ctxRef.current.revert();
      }

      const ctx = callback();
      
      if (ctx && typeof ctx.revert === 'function') {
        ctxRef.current = ctx;
      }
    }
  }, dependencies);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, []);
};
