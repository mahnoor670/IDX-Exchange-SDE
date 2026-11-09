import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
//WEEK 7!
import Pagination from "../components/Pagination";

// WEEK 5 + 6 + 7: Main listings page
// Shows the search bar, gets matching houses from the backend,
// shows each house as a card, and the page buttons at the bottom

// WEEK 7: how many houses show on each page
const ITEMS_PER_PAGE = 20;

function ListingsPage() {

  // What the page remembers: the houses, how many there are, if it's loading, and any error
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // WEEK 6: what the user searched for. Empty means = show all houses
  const [filters, setFilters] = useState({});

  // WEEK 7: which page the user is on. Starts at page 1
  const [currentPage, setCurrentPage] = useState(1);

  // Runs when the page first opens, every time the user searches,
  // and every time the user picks a different page
  useEffect(() => {
    // WEEK 6 flash bug fix: if the user searches again, this becomes true
    // so a slow old search can't show up and cover the new one
    let ignore = false;

    setLoading(true);
    setError(null);

    // WEEK 7: figures out how many houses to skip to get to this page
    // page 1 skips 0, page 2 skips 20, page 3 skips 40
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // sends the search filters plus which page we want
    fetchProperties({ ...filters, limit: ITEMS_PER_PAGE, offset: offset })
      .then((data) => {
        if (ignore) return;
        // Save the houses and the total so the page can show them
        setProperties(data.results);
        setTotal(data.total);
      })
      .catch((err) => {
        if (ignore) return;
        // Save the error so the page can show it
        setError(err.message);
      })
      .finally(() => {
        if (ignore) return;
        // Done waiting, whether it worked or not
        setLoading(false);
      });

    // React runs this right before the next search starts
    return () => {
      ignore = true;
    };
  }, [filters, currentPage]);

  // Called by the form when Search is clicked
  // WEEK 7: also goes back to page 1, since it's a new search
  function handleSearch(newFilters) {
    setFilters({ ...newFilters });
    setCurrentPage(1);
  }

  // Called by the form when Clear is clicked, goes back to showing everything
  // WEEK 7: also goes back to page 1
  function handleClear() {
    setFilters({});
    setCurrentPage(1);
  }

  // WEEK 7: Called by Pagination when a page button is clicked
  // switches to that page and jumps back to the top of the screen
  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // Picks what to show under the form: loading, error, empty, or the grid
  function renderResults() {
    if (loading) {
      return <p className="status-message">Loading properties...</p>;
    }

    // gets shown if the backend is down or something broke
    if (error) {
      return (
        <p className="status-message error-message">
          Could not load properties: {error}
        </p>
      );
    }

    // gets shown if nothing matches the search
    if (properties.length === 0) {
      return (
        <p className="status-message">
          No properties match your search. Try changing or clearing the filters.
        </p>
      );
    }

    // WEEK 7: numbers for the "Showing 21-40 of 487" text
    // first = the number of the first house on this page
    // last = the number of the last house on this page
    const first = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const last = first + properties.length - 1;

    // WEEK 7: how many pages there are in total
    // Math.ceil rounds up, so 487 houses / 20 = 24.35, which becomes 25 pages
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // if everything works, show the count, one card per house, and the page buttons
    return (
      <>
        <p className="results-count">
          Showing {first}-{last} of {total.toLocaleString("en-US")} properties
        </p>
        <div className="listings-grid">
          {properties.map((p) => (
            <PropertyCard key={p.L_ListingID} property={p} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  // The title and form always show, only the results part changes
  return (
    <div className="listings-page">
      <h1>IDX Listings</h1>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
      {renderResults()}
    </div>
  );
}

export default ListingsPage;