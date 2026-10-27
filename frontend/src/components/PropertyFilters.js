import { useState } from "react";

// WEEK 6: Search bar above the listings
// Saves what the user types, then sends it to ListingsPage when they click search

// What the form looks like when it's empty
const EMPTY_FILTERS = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

function PropertyFilters({ onSearch, onClear }) {
  
    // One object holds all 6 boxes
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Runs every time the user types a letter or picks a dropdown option, Uses the input's name to know which value to update.
  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  // Runs when search is clicked
  function handleSubmit(e) {
    e.preventDefault(); // stops the page from refreshing
    onSearch(filters); // send what the user typed to ListingsPage so it can do the search
  }

  // Runs when clear is clicked
  function handleClear() {
    setFilters(EMPTY_FILTERS);
    onClear();
  }

  //What shows up on screen which is 4 text/number boxes, 2 dropdowns, and 2 buttons
  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <input
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
      />
      <input
        name="zipcode"
        placeholder="ZIP code"
        value={filters.zipcode}
        onChange={handleChange}
      />
      <input
        name="minPrice"
        type="number"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        name="maxPrice"
        type="number"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Any beds</option>
        <option value="1">1+ beds</option>
        <option value="2">2+ beds</option>
        <option value="3">3+ beds</option>
        <option value="4">4+ beds</option>
        <option value="5">5+ beds</option>
      </select>
      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Any baths</option>
        <option value="1">1+ baths</option>
        <option value="2">2+ baths</option>
        <option value="3">3+ baths</option>
        <option value="4">4+ baths</option>
      </select>
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
}

export default PropertyFilters;