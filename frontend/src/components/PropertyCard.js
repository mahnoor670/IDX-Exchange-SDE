import { useState } from "react";
import { getFirstPhoto } from "../utils/photos";


// WEEK 5
// Makes one house card for the listings page.
// Shows the photo, price, address, city, and beds/baths/sqft,
// and skips anything that's missing so nothing breaks.


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


// One house card that shows the photo, price, address, city, and stats
function PropertyCard({ property }) {

// Remembers if the photo link failed to load
  const [photoBroken, setPhotoBroken] = useState(false);

  //grabs first photo
  const photo = getFirstPhoto(property.L_Photos);

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
    <div className="property-card">
      {photo && !photoBroken ? (
        <img
          className="property-card-photo"
          src={photo}
          alt={property.L_Address}
          onError={() => setPhotoBroken(true)}
        />
      ) : (
        <div className="property-card-photo property-card-no-photo">
          No photo
        </div>
      )}

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