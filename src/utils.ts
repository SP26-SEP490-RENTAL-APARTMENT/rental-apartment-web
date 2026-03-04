export const formatDate = (date?: Date) =>
  date ? date.toLocaleDateString() : "Select date";
