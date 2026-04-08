function getPages(page: number, totalPages: number) {
  const pages: (number | "...")[] = [];

  const delta = 1; // số trang xung quanh current

  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  // Trang đầu
  pages.push(1);

  // ...
  if (left > 2) {
    pages.push("...");
  }

  // Pages giữa
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  // ...
  if (right < totalPages - 1) {
    pages.push("...");
  }

  // Trang cuối
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default getPages;