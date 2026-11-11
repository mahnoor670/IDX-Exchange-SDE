import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";


// WEEK 5 + 8
// Makes one house card for the listings page.
// Shows the photo, price, address, city, and beds/baths/sqft,
// and skips anything that's missing so nothing breaks.
// WEEK 8: clicking the card opens that house's own page,
// and the photo part has arrows to flip through all the photos.


// returns true if a value is actually there (not null, undefined, or empty)
function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}


// Makes the price look nice with a $ and commas., if there's no real price, shows "Price not listed" instead.
function formatPrice(price) {
  const num = Number(price);
  if (!hasValue(price) || isNaN(num) || num <= 0) {
    return "Price not listed ";
  }
  return "$" + num.toLocaleString("en-US");
}


// Adds an "s" to the word if the number isn't 1 (so "1 bed" but "4 beds")
function pluralize(count, word) {
  if (count === 1) {
    return count + " " + word;
  }
  return count + " " + word + "s";
}


// One house card that shows the photos, price, address, city, and stats
function PropertyCard({ property }) {

  // WEEK 8: lets this card send you to a different page
  const navigate = useNavigate();

  // WEEK 8: when the card is clicked, go to this house's page
  function handleClick() {
    navigate("/property/" + property.L_ListingID);
  }

  // Builds the city and state line, skipping anything missing
  let location = "";
  if (hasValue(property.L_City)) {
    location = property.L_City;
  }
  if (hasValue(property.L_State)) {
    if (location !== "") {
      location = location + ", ";
    }
    location = location + property.L_State;
  }

  //Builds the beds, baths, and sqft line, never prints "null beds" or missing info
  const stats = [];
  if (hasValue(property.L_Keyword2)) {
    stats.push(pluralize(Number(property.L_Keyword2), "bed"));
  }
  if (hasValue(property.LM_Dec_3)) {
    stats.push(pluralize(Number(property.LM_Dec_3), "bath"));
  }
  if (hasValue(property.LM_Int2_3)) {
    stats.push(Number(property.LM_Int2_3).toLocaleString("en-US") + " sqft");
  }

  return (
    <div className="property-card" onClick={handleClick}>
      {/* WEEK 8: photos with arrows */}
      <PropertyImageCarousel photos={property.L_Photos} address={property.L_Address} />

      <div className="property-card-info">
        <p className="property-card-price">{formatPrice(property.L_SystemPrice)}</p>
        <p className="property-card-address">{property.L_Address}</p>
        {location !== "" && <p className="property-card-location">{location}</p>}
        {stats.length > 0 && (
          <p className="property-card-stats">{stats.join(" | ")}</p>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;