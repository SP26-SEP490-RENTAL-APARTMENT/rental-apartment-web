import { useTranslation } from "react-i18next";

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

export const ApartmentSortByList = () => {
  const { t } = useTranslation("filter");
  return [
    { label: t("option.createdAt"), value: "createdAt" },
    { label: t("option.title"), value: "title" },
    { label: t("option.pricePerNight"), value: "basePricePerNight" },
  ];
};

export const ApartmentStatusList = () => {
  const { t } = useTranslation("status");
  return [
    { label: t("apartment.posted"), value: "posted" },
    { label: t("apartment.pending"), value: "pending_review" },
    { label: t("apartment.draft"), value: "draft" },
  ];
};

export const BookingSortByList = () => {
  const { t } = useTranslation("filter");
  return [
    { label: t("option.createdAt"), value: "createdAt" },
    { label: t("option.nights"), value: "nights" },
    { label: t("option.totalPrice"), value: "totalPrice" },
  ];
};

export const PaymentSortByList = () => {
  const { t } = useTranslation("filter");
  return [
    { label: t("option.paidAt"), value: "paidAt" },
    { label: t("option.amount"), value: "amount" },
    { label: t("option.status"), value: "status" },
  ];
};

export const PaymentStatusList = () => {
  const { t } = useTranslation("status");
  return [
    { label: t("payment.pending"), value: "pending" },
    { label: t("payment.success"), value: "success" },
    { label: t("payment.failed"), value: "failed" },
  ];
};

export const paymentMethodList = [
  { label: "Momo", value: "momo_wallet" },
  { label: "Stripe", value: "stripe" },
];

export const PaymentPurposeList = () => {
  const { t } = useTranslation("status");
  return [
    { label: t("payment.full"), value: "booking_full_payment" },
    { label: t("payment.deposit"), value: "booking_deposit" },
  ];
};

export const SupportTicketSortByList = () => {
  const { t } = useTranslation("filter");
  return [
    { label: t("option.createdAt"), value: "createdAt" },
    { label: t("option.priority"), value: "priority" },
    { label: t("option.status"), value: "status" },
  ];
};

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

export const occupySortByList = [
  { label: "Created At", value: "createdAt" },
  { label: "Total Price", value: "totalPrice" },
]
