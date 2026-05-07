export const sortByList = [
  { label: "Full Name", value: "fullName" },
  { label: "Email", value: "email" },
  { label: "Role", value: "role" },
];

export const roleList = [
  { label: "Admin", value: "admin" },
  { label: "Tenant", value: "tenant" },
  { label: "Landlord", value: "landlord" },
  { label: "Staff", value: "staff" },
];

export const inspectionStatusList = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in_progress" },
  { label: "Passed", value: "passed" },
];

export const inspectionSortByList = [
  { label: "Apartment name", value: "apartmentName" },
  { label: "Status", value: "status" },
];

export const listingSortByList = [
  { label: "Created At", value: "createdAt" },
  { label: "Title", value: "title" },
  { label: "Price / night", value: "basePricePerNight" },
];

export const nearbySortByList = [
  { label: "Name", value: "nameEn" },
  { label: "Address", value: "address" },
];

export const nearbyTypeList = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Museum", value: "museum" },
  { label: "Park", value: "park" },
  { label: "Landmark", value: "landmark" },
  { label: "Shopping", value: "shopping" },
  { label: "Transport", value: "transport" },
];

export const subscriptionPlanSortByList = [
  { label: "Name", value: "name" },
  { label: "Monthly Price", value: "priceMonthly" },
  { label: "Annual Price", value: "priceAnnual" },
  { label: "Max Apartments", value: "maxApartments" },
];

export const apartmentSortByList = [
  { label: "Created At", value: "createdAt" },
  { label: "Title", value: "title" },
  { label: "Price / night", value: "basePricePerNight" },
];

export const apartmentStatusList = [
  { label: "Posted", value: "posted" },
  { label: "Pending", value: "pending_review" },
  { label: "Draft", value: "draft" },
];

export const bookingSortByList = [
  { label: "Created At", value: "createdAt" },
  { label: "Nights", value: "nights" },
  { label: "Total Price", value: "totalPrice" },
];

export const paymentSortByList = [
  { label: "Paid At", value: "paidAt" },
  { label: "Amount", value: "amount" },
  { label: "Status", value: "status" },
];

export const paymentStatusList = [
  { label: "Pending", value: "pending" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
];

export const paymentMethodList = [
  { label: "Momo", value: "momo_wallet" },
  { label: "Stripe", value: "stripe" },
];

export const paymentPurposeList = [
  { label: "Full", value: "booking_full_payment" },
  { label: "Deposit", value: "booking_deposit" },
];

export const supportTicketSortByList = [
  { label: "Created At", value: "createdAt" },
  { label: "Priority", value: "priority" },
  { label: "Status", value: "status" },
];

export const supportStatusList = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "escalated", label: "Escalated" },
];

export const supportPriorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const supportCategoryOptions = [
  { value: "booking_issue", label: "Booking Issue" },
  { value: "payment_problem", label: "Payment Problem" },
  { value: "listing_problem", label: "Listing Problem" },
  {
    value: "account_verification",
    label: "Account Verification",
  },
  { value: "cancellation", label: "Cancellation" },
  { value: "dispute", label: "Dispute" },
  { value: "property_quality", label: "Property Quality" },
  { value: "other", label: "Other" },
];
