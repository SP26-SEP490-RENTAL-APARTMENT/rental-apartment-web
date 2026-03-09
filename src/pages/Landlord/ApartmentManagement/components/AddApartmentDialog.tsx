import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleDollarSign, House, MapPin } from "lucide-react";
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
          <div className="grid gap-2">
            <Label htmlFor="apartmentName">Name</Label>
            <InputGroup>
              <InputGroupInput
                name="apartmentName"
                id="apartmentName"
                placeholder="Apartment name"
                required
              />
              <InputGroupAddon>
                <House />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <InputGroup>
              <InputGroupInput
                name="location"
                id="location"
                placeholder="Location"
                required
              />
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price per night</Label>
            <InputGroup>
              <InputGroupInput
                name="price"
                id="price"
                type="number"
                placeholder="100"
                required
              />
              <InputGroupAddon>
                <CircleDollarSign />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Apartment description..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Apartment image</Label>
            <Input
              name="apartmentImage"
              id="apartmentImage"
              type="file"
              accept="image/png, image/jpeg"
              placeholder="Upload apartment image"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">Save Apartment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddApartmentDialog;
