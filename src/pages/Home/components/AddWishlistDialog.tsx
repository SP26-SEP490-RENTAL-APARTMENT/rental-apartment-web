import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CollectionBox from "@/pages/Tenant/Collections/components/CollectionBox";
import type { Collection } from "@/types/collection";
import { useState } from "react";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection[];
  onSelectCollection: (collectionId: string) => void;
  isLoading?: boolean;
}
function AddWishlistDialog({
  isOpen,
  onClose,
  collection,
  onSelectCollection,
  // isLoading = false,
}: Props) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    onSelectCollection(collectionId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to collection</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collection.map((c) => (
            <div
              key={c.collectionId}
              onClick={() => handleSelectCollection(c.collectionId)}
              className="cursor-pointer opacity-100 hover:opacity-80 transition-opacity"
            >
              <CollectionBox
                collection={c}
                isSelected={selectedCollectionId === c.collectionId}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddWishlistDialog;
