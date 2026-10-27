import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "./PropertyFilters";

// WEEK 6: Tests for the search bar
// Uses fake onSearch and onClear so we can check the search bar sends the right info


//First test: all 6 boxes show up
test("renders all six filter inputs", () => {
  render(<PropertyFilters onSearch={jest.fn()} onClear={jest.fn()} />);

  expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("ZIP code")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Min price")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Max price")).toBeInTheDocument();

  //checks that there are exactly 2 dropdowns on the search bar
  expect(screen.getAllByRole("combobox")).toHaveLength(2);
});



// Second Test: checks that clicking search sends the right info
test("calls onSearch with the typed values when Search is clicked", () => {
  const onSearch = jest.fn();
  render(<PropertyFilters onSearch={onSearch} onClear={jest.fn()} />);

  // Type city, pick 2+ beds
  fireEvent.change(screen.getByPlaceholderText("City"), {
    target: { value: "Pasadena" },
  });
  const [bedsDropdown] = screen.getAllByRole("combobox");
  fireEvent.change(bedsDropdown, { target: { value: "2" } });

  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(onSearch).toHaveBeenCalledWith({
    city: "Pasadena",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "2",
    baths: "",
  });
});

// Third test: clicking Clear erases the boxes and tells ListingsPage to reset
test("Clear empties the form and calls onClear", () => {
  const onClear = jest.fn();
  render(<PropertyFilters onSearch={jest.fn()} onClear={onClear} />);

  const cityBox = screen.getByPlaceholderText("City");

  //Pretends to type Sacramento in it.
  fireEvent.change(cityBox, { target: { value: "Sacramento" } });
  
  //Makes sure Sacramento really shows up in the box.
  expect(cityBox.value).toBe("Sacramento");

  fireEvent.click(screen.getByRole("button", { name: "Clear" }));

  expect(cityBox.value).toBe("");
  expect(onClear).toHaveBeenCalled();
});