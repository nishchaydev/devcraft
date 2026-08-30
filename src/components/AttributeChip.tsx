import React from 'react';
import { DomainType } from '../parser/types';

interface AttributeChipProps {
  attrKey: string;
  value:   string | number | boolean;
  domain?: DomainType;
  index?:  number;
}

const DOMAIN_TEXT: Record<DomainType, string> = {
  tailor:      'text-indigo-300',
  baker:       'text-orange-300',
  tiffin:      'text-emerald-300',
  electrician: 'text-yellow-300',
};

export const AttributeChip: React.FC<AttributeChipProps> = ({
  attrKey, value, domain = 'tailor', index = 0,
}) => {
  const textClass = DOMAIN_TEXT[domain] || DOMAIN_TEXT.tailor;
  const delay     = `${index * 30}ms`;

  return (
    <span
      className={`attr-chip animate-chip-pop ${textClass}`}
      style={{ animationDelay: delay }}
    >
      <span className="text-slate-500">{attrKey}:</span>
      <strong className="font-semibold">{String(value)}</strong>
    </span>
  );
};
