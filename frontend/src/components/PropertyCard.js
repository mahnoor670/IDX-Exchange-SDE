import { useState } from "react";
import { getFirstPhoto } from "../utils/photos";

// True if a value is actually there (not null, undefined, or empty)
function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

// Turns 1250000 into "$1,250,000". Null or 0 shows "Price N/A".
function formatPrice(price) {
  const num = Number(price);
  if (!hasValue(price) || isNaN(num) || num <= 0) {
    return "Price N/A";
  }
  return "$" + num.toLocaleString("en-US");
}

// Returns "1 bed" or "3 beds" depending on the number
function pluralize(count, word) {
  if (count === 1) {
    return count + " " + word;
  }
  return count + " " + word + "s";
}

function PropertyCard({ property }) {
  const [photoBroken, setPhotoBroken] = useState(false);
  const photo = getFirstPhoto(property.L_Photos);

  // Build "Irvine, CA" from whatever parts exist
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

  // Only show stats that exist, so we never print "null beds"
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