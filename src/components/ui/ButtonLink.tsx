import React from 'react';
import { Link } from 'react-router-dom';

type ButtonLinkProps = {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
};

export default function ButtonLink({ to, children, variant = 'primary', className = '', onClick }: ButtonLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`zy-button ${variant === 'primary' ? 'zy-button-primary' : 'zy-button-secondary'} ${className}`}
    >
      {children}
    </Link>
  );
}
