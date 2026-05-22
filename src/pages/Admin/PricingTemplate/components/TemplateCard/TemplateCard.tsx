import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { PricingTemplate } from "@/types/pricingTemplate";
import {
  CalendarDays,
  ChevronRight,
  EllipsisVertical,
  Pen,
  Settings2,
} from "lucide-react";

interface Props {
  template: PricingTemplate;
  onViewDetail: (template: PricingTemplate) => void;
  onEdit: (template: PricingTemplate) => void;
  onSwitchStatus: (templateId: string, isActive: boolean) => void;
}

function TemplateCard({
  template,
  onViewDetail,
  onEdit,
  onSwitchStatus,
}: Props) {
  return (
    <Card className="rounded-xl py-0 border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 px-5 pt-5">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {template.description || "No description"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-white/50"
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(template)}
                className="cursor-pointer"
              >
                <Pen className="h-4 w-4 mr-2" />
                Edit Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status and Code Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge
            variant="outline"
            className="bg-white/50 border-blue-200 text-blue-700 text-xs"
          >
            {template.code}
          </Badge>
          <Badge
            className={`text-xs font-medium flex items-center ${
              template.isActive
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-200 text-gray-700 border-gray-300"
            }`}
          >
            {template.isActive ? "● Active" : "● Inactive"}
          </Badge>
          <Switch
            className="cursor-pointer"
            checked={template.isActive}
            onCheckedChange={(checked) =>
              onSwitchStatus(template.templateId, checked)
            }
          />
        </div>
      </div>

      <CardContent className="px-5 py-4 space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <CalendarDays size={14} className="text-blue-500" />
              <span>Updated</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {template.updatedAt}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Settings2 size={14} className="text-blue-500" />
              <span>Parameters</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {template.parameters.length} items
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetail(template)}
          variant="outline"
          className="w-full border-blue-500 hover:border-blue-600 rounded-lg h-10 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          View Details
          <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default TemplateCard;
