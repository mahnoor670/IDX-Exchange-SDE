// WEEK 8: the map on the detail page
// Shows a Google Map of where the house is, plus a "Get Directions" link.
// It only shows up if the house has both a latitude and longitude.

// gets the key from frontend/.env
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


// returns true if a value is a real number we can use on a map
function isRealNumber(value) {
  if (value === null || value === undefined || value === "") {
    return false;
  }
  return !isNaN(Number(value));
}


// FUNCTION: PropertyMap
// The detail page gives it the house's latitude, longitude, and address
function PropertyMap({ latitude, longitude, address }) {
  // if statement that checks if the latitude or longitude is missing
  // if so, don't show a map at all
  if (!isRealNumber(latitude) || !isRealNumber(longitude)) {
    return null;
  }

  // if statement that checks if the API key is missing from .env
  // if so, show a message instead of a broken map
  if (!API_KEY) {
    return <p className="status-message">Map unavailable (missing API key)</p>;
  }

  // the spot on the map, like "34.05,-118.24"
  const spot = latitude + "," + longitude;

  // the link Google gives us to put a map on our page
  const mapLink =
    "https://www.google.com/maps/embed/v1/place?key=" +
    API_KEY +
    "&q=" +
    spot +
    "&zoom=15";

  // the link that opens Google Maps directions to the house
  const directionsLink =
    "https://www.google.com/maps/dir/?api=1&destination=" + spot;

  return (
    <div className="property-map">
      {/* iframe = a little window that shows another website (Google Maps) inside our page */}
      <iframe
        className="property-map-frame"
        title={"Map of " + address}
        src={mapLink}
        loading="lazy"
        allowFullScreen
      />

      {/* target="_blank" opens it in a new tab */}
      <a
        className="property-map-directions"
        href={directionsLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Directions
      </a>
    </div>
  );
}

export default PropertyMap;