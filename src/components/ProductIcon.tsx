import React from 'react';
import { Zap, Sparkles, Pen, Waves, Smile, Droplet, Footprints, LucideIcon } from 'lucide-react';

interface ProductIconProps {
  name: string;
  className?: string;
}

export default function ProductIcon({ name, className = "w-6 h-6" }: ProductIconProps) {
  switch (name) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Pen':
      return <Pen className={className} />;
    case 'Waves':
      return <Waves className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    case 'Droplet':
      return <Droplet className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
