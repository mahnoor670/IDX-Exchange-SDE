import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

// WEEK 5 + 6: Main listings page
// Shows the search bar, gets matching houses from the backend,
// and shows each house as a card

function ListingsPage() {

  // What the page remembers: the houses, how many there are, if it's loading, and any error
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // WEEK 6: what the user searched for. Empty means = show all houses
  const [filters, setFilters] = useState({});

// Runs when the page first opens and every time the user searches
  useEffect(() => {
    // WEEK 6 flash bug fix: if the user searches again, this becomes true
    // so a slow old search can't show up and cover the new one
    let ignore = false;

    setLoading(true);
    setError(null);

    fetchProperties(filters)
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
  }, [filters]);

  // Called by the form when Search is clicked
  function handleSearch(newFilters) {
    setFilters({ ...newFilters });
  }

  // Called by the form when Clear is clicked, goes back to showing everything
  function handleClear() {
    setFilters({});
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

    // if everything works, show the count and one card per house
    return (
      <>
        <p className="results-count">
          Showing {properties.length} of {total.toLocaleString("en-US")} properties
        </p>
        <div className="listings-grid">
          {properties.map((p) => (
            <PropertyCard key={p.L_ListingID} property={p} />
          ))}
        </div>
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