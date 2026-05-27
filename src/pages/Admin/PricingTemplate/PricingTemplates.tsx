import { pricingTemplateManagementApi } from "@/services/privateApi/adminApi";
import type { PricingTemplate } from "@/types/pricingTemplate";
import { CirclePercent, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TemplateCard from "./components/TemplateCard/TemplateCard";
import TemplateDetailDialog from "./components/TemplateDetailDialog";
import { Button } from "@/components/ui/button";
import TemplateForm from "./components/TemplateForm";
import { toast } from "sonner";
import type {
  CreateTemplateFormData,
  UpdateTemplateFormData,
} from "@/schemas/pricingTemplateSchema";

function PricingTemplates() {
  const [templates, setTemplates] = useState<PricingTemplate[]>([]);
  const [template, setTemplate] = useState<PricingTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [templateForm, setTemplateForm] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pricingTemplateManagementApi.getAllTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error("Failed to fetch pricing templates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTemplate = async (data: CreateTemplateFormData) => {
    try {
      await pricingTemplateManagementApi.createTemplate(data);
      setTemplateForm(false);
      fetchTemplates();
      toast.success("Template created successfully");
    } catch (error) {
      toast.error("Failed to create template");
      console.error("Failed to create template:", error);
    }
  };

  const handleUpdateTemplate = async (data: UpdateTemplateFormData) => {
    if (!template) return;
    try {
      await pricingTemplateManagementApi.updateTemplate(
        template.templateId,
        data,
      );
      setTemplateForm(false);
      fetchTemplates();
      toast.success("Template updated successfully");
    } catch (error) {
      toast.error("Failed to update template");
      console.error("Failed to update template:", error);
    }
  };

  const handleSubmit = (
    data: CreateTemplateFormData | UpdateTemplateFormData,
  ) => {
    if (mode === "create") {
      handleCreateTemplate(data as CreateTemplateFormData);
    } else {
      handleUpdateTemplate(data as UpdateTemplateFormData);
    }
  };

  const handleSwitchStatus = async (templateId: string, active: boolean) => {
    try {
      await pricingTemplateManagementApi.switchTemplateStatus(templateId, active);
      fetchTemplates();
      toast.success("Template status updated successfully");
    } catch (error) {
      toast.error("Failed to update template status");
      console.error("Failed to update template status:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleViewDetail = (template: PricingTemplate) => {
    setTemplate(template);
    setDetailDialogOpen(true);
  };

  const triggerCreateTemplate = () => {
    setMode("create");
    setTemplateForm(true);
  };

  const triggerEditTemplate = (template: PricingTemplate) => {
    setMode("edit");
    setTemplate(template);
    setTemplateForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <CirclePercent className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pricing Templates
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and configure pricing templates
                </p>
              </div>
            </div>
            <Button
              onClick={triggerCreateTemplate}
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading ? (
          <p>Loading templates...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.templateId}
                template={template}
                onViewDetail={handleViewDetail}
                onEdit={triggerEditTemplate}
                onSwitchStatus={handleSwitchStatus}
              />
            ))}
          </div>
        )}
      </div>

      <TemplateDetailDialog
        onClose={() => setDetailDialogOpen(false)}
        open={detailDialogOpen}
        template={template}
      />

      <TemplateForm
        mode={mode}
        onClose={() => setTemplateForm(false)}
        open={templateForm}
        template={template}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default PricingTemplates;
