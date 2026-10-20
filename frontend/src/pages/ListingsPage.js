import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";

//WEEK 5
// The main listings page.
// Asks the backend for houses, then shows them as a grid of cards.

function ListingsPage() {

  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // When the page opens, ask the backend for the houses
  useEffect(() => {
    fetchProperties()
      .then((data) => {
        // Save the houses and the total so the page can show them
        setProperties(data.results);
        setTotal(data.total);
      })
      .catch((err) => {
        // Save the error so the page can show it
        setError(err.message);
      })
      .finally(() => {
        // Done waiting, whether it worked or not
        setLoading(false);
      });
  }, []);

  // Show this while waiting for the houses
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

  // gets shown if the backend sent back zero houses
  if (properties.length === 0) {
    return <p className="status-message">No properties found.</p>;
  }

   // if everything works,, show the title, the count, and one card per house
  return (
    <div className="listings-page">
      <h1>IDX Listings</h1>
      <p className="results-count">
        Showing {properties.length} of {total.toLocaleString("en-US")} properties
      </p>

      <div className="listings-grid">
        {properties.map((p) => (
          <PropertyCard key={p.L_ListingID} property={p} />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;