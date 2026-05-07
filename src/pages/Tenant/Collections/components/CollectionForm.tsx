import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { collectionsApi } from "@/services/privateApi/tenantApi";
import { toast } from "sonner";
import type { Collection } from "@/types/collection";

interface CollectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection?: Collection | null;
  onSuccess?: () => void;
}

function CollectionForm({
  open,
  onOpenChange,
  collection = null,
  onSuccess,
}: CollectionFormProps) {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Reset form when dialog opens/closes or collection changes
  useEffect(() => {
    if (open) {
      if (collection) {
        setFormData({
          name: collection.name,
          description: collection.description || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
        });
      }
    }
  }, [open, collection]);

  const isEditing = !!collection;
  const isFormValid = formData.name.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Collection name is required");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        // Update collection
        await collectionsApi.updateCollection(
          collection.collectionId.toString(),
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
          },
        );
        toast.success("Collection updated successfully");
      } else {
        // Create collection
        await collectionsApi.createCollection({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        toast.success(
          t("toast.createCollectionSuccess") ||
            "Collection created successfully",
        );
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting collection:", error);
      toast.error(
        isEditing
          ? "Failed to update collection"
          : "Failed to create collection",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Create"} Collection</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your collection details"
              : "Create a new collection to organize your favorites"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Collection Name
            </label>
            <Input
              id="name"
              placeholder="My Collection"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isLoading}
              maxLength={100}
              className="focus-visible:ring-purple-500"
            />
            <p className="text-xs text-gray-500">{formData.name.length}/100</p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your collection..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
              rows={4}
              maxLength={500}
              className="focus-visible:ring-purple-500 resize-none"
            />
            <p className="text-xs text-gray-500">
              {formData.description.length}/500
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CollectionForm;
