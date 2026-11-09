// WEEK 7
// The page buttons under the grid: Previous, 1 2 3, Next.
// When you click one, it tells ListingsPage which page you picked.

// Function getPageNumbers
// Picks which page numbers to show, using "..." when there are too many.
// Example: on page 10 of 24, it shows 1 ... 9 10 11 ... 24
export function getPageNumbers(currentPage, totalPages) {
  // if statement that checks if there are 7 pages or less
  // if so, just list every page number
  if (totalPages <= 7) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // if statement that checks if you're near the start (page 1-4)
  // shows: 1 2 3 4 5 ... 24
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  // if statement that checks if you're near the end (last 4 pages)
  // shows: 1 ... 20 21 22 23 24
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // if none of the if statements above matched, you're in the middle
  // shows: 1 ... 9 10 11 ... 24
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

// Function Pagination
// Shows the Previous button, the page numbers, and the Next button.
// ListingsPage gives it: the page you're on, how many pages total,
// and onPageChange (what to call when a button is clicked)
function Pagination({ currentPage, totalPages, onPageChange }) {
  // if statement that checks if there's only 1 page, if so, don't show any buttons
  if (totalPages <= 1) {
    return null;
  }

  // gets the list of numbers to show from getPageNumbers
  const pages = getPageNumbers(currentPage, totalPages);

  // Function renderPage
  // Takes one item from the list and decides what it looks like:
  // dots, a blue button, or a normal button
  function renderPage(page, index) {
    // if statement that checks if this item is the "...", if it is: show it as plain text (not clickable)
    if (page === "...") {
      return (
        <span key={"dots-" + index} className="pagination-ellipsis">
          ...
        </span>
      );
    }

    // if statement that checks if this is the page you're on right now: if it is, make it a blue button
    if (page === currentPage) {
      return (
        <button
          key={page}
          className="pagination-btn pagination-btn-active"
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      );
    }

    // if neither if statement matched, it's a normal page button
    return (
      <button
        key={page}
        className="pagination-btn"
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    );
  }

  return (
    <nav className="pagination">
      {/* Previous button: goes back 1 page, grayed out on page 1 */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* goes through the list and draws each number or "..." */}
      {pages.map(renderPage)}

      {/* Next button: goes forward 1 page, grayed out on the last page */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;