import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function AddApartmentDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add New Apartment</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
            <DialogTitle>Add New Apartment</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input placeholder="Apartment name" required />
          </div>

          <div>
            <Label>Location</Label>
            <Input placeholder="Location" required />
          </div>

          <div>
            <Label>Price per night</Label>
            <Input type="number" placeholder="100" required />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea placeholder="Apartment description..." />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save Apartment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddApartmentDialog;
