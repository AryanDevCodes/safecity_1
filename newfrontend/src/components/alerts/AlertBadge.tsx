import React from 'react';
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

interface AlertBadgeProps {
  type: 'emergency' | 'warning' | 'info';
  className?: string;
}

const AlertBadge = ({ type, className }: AlertBadgeProps) => {
  const baseStyles = "rounded-full px-2 py-1 text-xs font-medium";
  
  const typeStyles = {
    emergency: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <Badge className={cn(baseStyles, typeStyles[type], className)}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

export default AlertBadge;
