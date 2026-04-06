import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import type { Package, PackageItem } from "@/types/package";
import { Badge, Plus, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  packageItemManagementApi,
  packageManagementApi,
} from "@/services/privateApi/adminApi";
import { toast } from "sonner";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[] | null;
  onAddSuccess?: (packageId: string) => void;
}

function PackageDialog({ isOpen, onClose, packages, onAddSuccess }: Props) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [availableItems, setAvailableItems] = useState<PackageItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    if (isFormOpen && selectedPackageId) {
      fetchAvailableItems();
    }
  }, [isFormOpen, selectedPackageId]);

  const fetchAvailableItems = async () => {
    setItemsLoading(true);
    try {
      const response = await packageItemManagementApi.getAllPackageItems({
        page: 1,
        pageSize: 100,
        search: "",
        sortBy: "itemName",
        sortOrder: "asc",
      });
      setAvailableItems(response.data.items);
    } catch (error) {
      console.error("Error fetching package items:", error);
      toast.error("Failed to fetch package items");
    } finally {
      setItemsLoading(false);
    }
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleAddItems = async () => {
    if (!selectedPackageId || selectedItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    setLoading(true);
    try {
      await packageManagementApi.addPackageItemToPackage(
        selectedPackageId,
        selectedItems,
      );
      toast.success("Package items added successfully");
      setSelectedItems([]);
      setIsFormOpen(false);
      onClose();
      onAddSuccess?.(selectedPackageId);
    } catch (error) {
      console.error("Error adding package items:", error);
      toast.error("Failed to add package items");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Package list</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!packages || packages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No packages available
            </p>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.packageId}
                className="border rounded-xl p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-base">{pkg.name}</h3>
                  <Badge className={pkg.isActive ? "default" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>

                {/* Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p>
                    <span className="font-medium">Price:</span>{" "}
                    {formatPrice(pkg.price, pkg.currency)}
                  </p>

                  <p>
                    <span className="font-medium">Max bookings:</span>{" "}
                    {pkg.maxBookings ?? "Unlimited"}
                  </p>

                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(pkg.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">
                      Items ({pkg.items.length})
                    </p>
                    <Dialog
                      open={isFormOpen && selectedPackageId === pkg.packageId}
                      onOpenChange={(open) => {
                        setIsFormOpen(open);
                        if (open) {
                          setSelectedPackageId(pkg.packageId);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add Package Items</DialogTitle>
                          <DialogDescription>
                            Select items to add to "{pkg.name}"
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Selected Items Display */}
                          {selectedItems.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">
                                Selected Items:
                              </p>
                              <div className="space-y-2">
                                {selectedItems.map((itemId) => {
                                  const item = availableItems.find(
                                    (i) => i.packageItemId === itemId,
                                  );
                                  return (
                                    <div
                                      key={itemId}
                                      className="text-sm px-3 py-2 bg-primary/10 rounded-lg flex justify-between items-center"
                                    >
                                      <span>{item?.itemName}</span>
                                      <button
                                        onClick={() => handleToggleItem(itemId)}
                                        className="text-xs text-destructive hover:text-destructive/80"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Available Items List */}
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Available Items:
                            </p>
                            {itemsLoading ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="animate-spin" size={20} />
                              </div>
                            ) : availableItems.length > 0 ? (
                              <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                                {availableItems.map((item) => (
                                  <div
                                    key={item.packageItemId}
                                    className="flex items-start gap-3"
                                  >
                                    <input
                                      type="checkbox"
                                      id={item.packageItemId}
                                      checked={selectedItems.includes(
                                        item.packageItemId,
                                      )}
                                      onChange={() =>
                                        handleToggleItem(item.packageItemId)
                                      }
                                      className="mt-1 cursor-pointer"
                                    />
                                    <label
                                      htmlFor={item.packageItemId}
                                      className="cursor-pointer text-sm flex-1"
                                    >
                                      <p className="font-medium">
                                        {item.itemName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.itemDescription}
                                      </p>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No items available
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsFormOpen(false);
                              setSelectedItems([]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleAddItems}
                            disabled={loading || selectedItems.length === 0}
                          >
                            {loading && (
                              <Loader2
                                className="mr-2 animate-spin"
                                size={16}
                              />
                            )}
                            Add Items
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {pkg.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No items</p>
                  ) : (
                    pkg.items
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((item) => (
                        <div
                          key={item.packageItemId}
                          className="border rounded-md p-2 text-sm"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{item.itemName}</span>
                            <span className="text-xs text-muted-foreground">
                              x{item.quantity}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.itemDescription}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PackageDialog;
