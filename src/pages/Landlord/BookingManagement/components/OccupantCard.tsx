import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Occupant } from "@/types/occupant";

interface Props {
  occupant: Occupant;
}
function OccupantCard({ occupant }: Props) {
  return (
    <Card className="rounded-2xl shadow-sm border hover:shadow-md transition">
      <CardContent className="p-5 flex flex-col md:flex-row gap-5">
        
        {/* LEFT - INFO */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {occupant.fullName}
              </h3>
              <p className="text-xs text-gray-500">
                Occupant #{occupant.order}
              </p>
            </div>

            {occupant.isPrimary && (
              <Badge className="bg-blue-600">Primary</Badge>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p>
              <span className="text-gray-500">DOB</span><br />
              {new Date(occupant.dateOfBirth).toLocaleDateString()}
            </p>

            <p>
              <span className="text-gray-500">Gender</span><br />
              {occupant.sex === "male" ? "Male" : "Female"}
            </p>

            <p>
              <span className="text-gray-500">Nationality</span><br />
              {occupant.nationality}
            </p>

            <p>
              <span className="text-gray-500">Phone</span><br />
              {occupant.phone}
            </p>

            <p className="col-span-2">
              <span className="text-gray-500">Email</span><br />
              {occupant.email}
            </p>

            <p>
              <span className="text-gray-500">Passport</span><br />
              {occupant.passportId}
            </p>

            <p>
              <span className="text-gray-500">National ID</span><br />
              {occupant.nationalIdCardNumber}
            </p>
          </div>
        </div>

        {/* RIGHT - DOCUMENT */}
        <div className="w-full md:w-55 flex flex-col gap-2">
          <p className="text-sm font-medium">Document</p>

          <div
            className="border rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => window.open(occupant.proofPhotoUrl, "_blank")}
          >
            <img
              src={occupant.proofPhotoUrl}
              alt="document"
              className="w-full h-35 object-cover group-hover:scale-105 transition"
            />
          </div>

          <p className="text-xs text-gray-500 text-center">
            Click to view full
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export default OccupantCard;
