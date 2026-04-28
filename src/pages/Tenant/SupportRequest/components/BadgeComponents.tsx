import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, CircleDot, X } from "lucide-react";
import {
  categoryConfig,
  priorityConfig,
  statusConfig,
} from "../utils/badgeUtils";

interface BadgeProps {
  value: string;
}

const iconMap = {
  CircleDot: CircleDot,
  Clock: Clock,
  CheckCircle2: CheckCircle2,
  X: X,
  AlertCircle: AlertCircle,
};

export function StatusBadge({ value }: BadgeProps) {
  const config = statusConfig[value as keyof typeof statusConfig];
  if (!config) return <Badge variant="outline">Unknown</Badge>;

  const Icon = iconMap[config.icon as keyof typeof iconMap];

  return (
    <Badge variant={config.variant} className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({ value }: BadgeProps) {
  const config = priorityConfig[value as keyof typeof priorityConfig];
  if (!config) return <Badge variant="outline">Unknown</Badge>;

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  );
}

export function CategoryBadge({ value }: BadgeProps) {
  const config = categoryConfig[value as keyof typeof categoryConfig];
  if (!config) return <Badge variant="outline">Unknown</Badge>;

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  );
}
