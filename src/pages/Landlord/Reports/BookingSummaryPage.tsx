import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CalendarCheck, DollarSign, LayoutGrid, MessageCircle } from "lucide-react";

const reports = [
  {
    title: "Booking Summary",
    description: "Overview of all bookings",
    icon: CalendarCheck,
    highlights: [
      "Total bookings",
      "Revenue",
      "Occupancy rate",
      "Upcoming check-ins",
    ],
  },
  {
    title: "Revenue Report",
    description: "Track earnings",
    icon: DollarSign,
    highlights: [
      "Total revenue",
      "Deposit collected",
      "Balance due",
      "Refunded amount",
    ],
  },
  {
    title: "Occupancy Report",
    description: "Understand room utilization",
    icon: LayoutGrid,
    highlights: [
      "Occupancy %",
      "Average Length of Stay",
      "Peak days",
    ],
  },
  {
    title: "Guest Feedback / Reviews",
    description: "Quality control",
    icon: MessageCircle,
    highlights: [
      "Average rating",
      "Review comments",
      "Top complaints",
    ],
  },
];

export default function LandlordReportsPage() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Landlord reports
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Property performance insights</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Monitor booking performance, revenue, occupancy, and guest feedback from a single landlord report dashboard.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="group">
              <CardHeader className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {report.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  size="sm"
                  variant={report.title === "Booking Summary" ? "default" : "outline"}
                  disabled={report.title !== "Booking Summary"}
                >
                  {report.title === "Booking Summary" ? "Available now" : "Coming soon"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
