import { TENANT_ROUTES } from "@/constants/routes";
import type { Collection } from "@/types/collection";
import {
  Heart,
  Star,
  Check,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { collectionsApi } from "@/services/privateApi/tenantApi";
import { useState } from "react";
import { toast } from "sonner";

function CollectionBox({
  collection,
  isSelected = false,
  onDelete,
  onEdit,
}: {
  collection: Collection;
  isSelected?: boolean;
  onDelete?: () => void;
  onEdit?: (collection: Collection) => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await collectionsApi.deleteCollection(collection.collectionId.toString());
      toast.success(
        t("toast.deleteCollectionSuccess") || "Collection deleted successfully",
      );
      setIsDialogOpen(false);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error(
        t("toast.deleteCollectionFailed") || "Failed to delete collection",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      onClick={() =>
        navigate(
          TENANT_ROUTES.WISHLIST.replace(
            ":collectionId",
            collection.collectionId.toString(),
          ),
        )
      }
      className={`border-0 cursor-pointer pb-0 transition-all duration-300 hover:shadow-lg overflow-hidden group ${
        isSelected
          ? "ring-2 ring-purple-500 shadow-lg"
          : "shadow-sm hover:shadow-md"
      }`}
    >
      <CardContent className="space-y-4">
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          {!collection?.isDefault && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="w-5 h-5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit?.(collection)}>
                  {t("button.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  {t("button.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("description.deleteConfirm")}</DialogTitle>
                <DialogDescription>
                  {t("description.deleteWarning")}
                </DialogDescription>
              </DialogHeader>
              <p>{t("description.deleteConfirmation")}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeleting}
                >
                  {t("button.cancel")}
                </Button>
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {t("button.delete")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
              isSelected
                ? "bg-linear-to-br from-purple-200 to-purple-300 text-purple-700"
                : "bg-linear-to-br from-purple-100 to-purple-50 text-purple-500"
            }`}
          >
            <Heart size={24} />
          </div>

          {isSelected && (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500 text-white shadow-md">
              <Check size={16} />
            </div>
          )}

          {collection?.isDefault && !isSelected && (
            <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
              <Star size={12} className="fill-current" />
              Default
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {collection.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
            {collection.description || "No description yet"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t p-2 border-gray-100">
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-600 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

export default CollectionBox;
