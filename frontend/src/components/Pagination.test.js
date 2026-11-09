import { render, screen, fireEvent } from "@testing-library/react";
import Pagination, { getPageNumbers } from "./Pagination";

// WEEK 7: tests for the page buttons

// TEST: only 1 page means no buttons show up
test("shows nothing when there is only 1 page", () => {
  const { container } = render(
    <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
  );
  expect(container).toBeEmptyDOMElement();
});

// TEST: Previous is grayed out on page 1
test("Previous is disabled on page 1", () => {
  render(<Pagination currentPage={1} totalPages={10} onPageChange={jest.fn()} />);
  expect(screen.getByText("Previous")).toBeDisabled();
  expect(screen.getByText("Next")).not.toBeDisabled();
});

// TEST: Next is grayed out on the last page
test("Next is disabled on the last page", () => {
  render(<Pagination currentPage={10} totalPages={10} onPageChange={jest.fn()} />);
  expect(screen.getByText("Next")).toBeDisabled();
  expect(screen.getByText("Previous")).not.toBeDisabled();
});

// TEST: clicking a page number tells ListingsPage that number
test("clicking a page number calls onPageChange with that page", () => {
  // fake function so we can check what it got called with
  const onPageChange = jest.fn();
  render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

  fireEvent.click(screen.getByText("3"));
  expect(onPageChange).toHaveBeenCalledWith(3);
});

// TEST: Next and Previous go forward and back by 1
test("Next and Previous change the page by 1", () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

  fireEvent.click(screen.getByText("Next"));
  expect(onPageChange).toHaveBeenCalledWith(6);

  fireEvent.click(screen.getByText("Previous"));
  expect(onPageChange).toHaveBeenCalledWith(4);
});

// TEST: the page you're on gets the blue style
test("the current page has the active style", () => {
  render(<Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />);
  expect(screen.getByText("3")).toHaveClass("pagination-btn-active");
});

// TEST: lots of pages, in the middle, shows two "..."
test("shows the dots on both sides when in the middle", () => {
  render(<Pagination currentPage={10} totalPages={24} onPageChange={jest.fn()} />);
  expect(screen.getAllByText("...")).toHaveLength(2);
});

// TEST: checks the numbers for each case
test("getPageNumbers picks the right numbers", () => {
  // few pages: shows all of them
  expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);

  // near the start
  expect(getPageNumbers(2, 24)).toEqual([1, 2, 3, 4, 5, "...", 24]);

  // in the middle
  expect(getPageNumbers(10, 24)).toEqual([1, "...", 9, 10, 11, "...", 24]);

  // near the end
  expect(getPageNumbers(22, 24)).toEqual([1, "...", 20, 21, 22, 23, 24]);
});

// TEST: DEBUG CHALLENGE
// the bug was the last page showing up twice when you're near the end
// this checks that the last page only shows up once
test("last page number only shows up once near the end", () => {
  const pages = getPageNumbers(22, 24);
  const timesLastPageShows = pages.filter((p) => p === 24).length;
  expect(timesLastPageShows).toBe(1);
});