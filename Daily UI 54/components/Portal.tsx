
import React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export const Portal: React.FC<PortalProps> = ({ children }) => {
  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;
  return createPortal(children, portalRoot);
};
