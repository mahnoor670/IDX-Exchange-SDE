import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPropertyDetail, fetchOpenHouses } from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap"; // MAP

// WEEK 8: the page for one house
// Gets the house's info and open houses from the backend and shows them.
// If the ID is fake, it shows an error instead of crashing.


// returns true if a value is actually there (not null, undefined, or empty)
function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

// Makes the price look nice with a $ and commas
function formatPrice(price) {
  const num = Number(price);
  if (!hasValue(price) || isNaN(num) || num <= 0) {
    return "Price not listed";
  }
  return "$" + num.toLocaleString("en-US");
}

// Turns a date like 2026-11-15 into "Sunday, November 15, 2026"
function formatDate(value) {
  if (!hasValue(value)) {
    return "Date not listed";
  }
  // only keep the year-month-day part
  const parts = String(value).slice(0, 10).split("-");
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(date)) {
    return String(value);
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Turns a time like 13:00:00 into "1:00 PM"
function formatTime(value) {
  if (!hasValue(value)) {
    return "";
  }
  const parts = String(value).split(":");
  const hour = Number(parts[0]);
  const minute = parts[1];

  // if statement that checks if the time isn't in the 13:00 style
  // if so, just show it the way it came
  if (isNaN(hour) || minute === undefined) {
    return String(value);
  }

  let amPm = "AM";
  if (hour >= 12) {
    amPm = "PM";
  }
  let hour12 = hour % 12;
  if (hour12 === 0) {
    hour12 = 12;
  }
  return hour12 + ":" + minute + " " + amPm;
}

// DEBUG CHALLENGE: the remarks are hidden inside all_data,
// which is a big chunk of JSON text. This unpacks it and grabs the remarks.
function getRemarks(openHouse) {
  let allData = openHouse.all_data;

  // if statement that checks if all_data is still text
  // if so, turn it into an object we can read from
  if (typeof allData === "string") {
    try {
      allData = JSON.parse(allData);
    } catch {
      // the text was broken, so there are no remarks to show
      return "";
    }
  }

  // if statement that checks if there's anything inside all_data
  if (!allData || !hasValue(allData.OpenHouseRemarks)) {
    return "";
  }
  return allData.OpenHouseRemarks;
}


function PropertyDetailPage() {
  // grabs the ID from the link, like the 12345 in /property/12345
  const { id } = useParams();

  // What the page remembers: the house, its open houses, if it's loading, and any error
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs when the page opens, and again if the ID in the link changes
  useEffect(() => {
    // same flash bug fix as ListingsPage
    let ignore = false;

    setLoading(true);
    setError(null);

    // gets the house and its open houses at the same time
    Promise.all([fetchPropertyDetail(id), fetchOpenHouses(id)])
      .then((results) => {
        if (ignore) return;
        setProperty(results[0]);
        setOpenHouses(results[1]);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  // if statement that checks if it's still loading
  if (loading) {
    return (
      <div className="detail-page">
        <p className="status-message">Loading property...</p>
      </div>
    );
  }

  // if statement that checks if something went wrong (like a fake ID)
  if (error) {
    return (
      <div className="detail-page">
        <Link to="/" className="detail-back">Back to listings</Link>
        <p className="status-message error-message">
          Could not load this property: {error}
        </p>
      </div>
    );
  }

  // Builds the city, state, zip line, skipping anything missing
  const locationParts = [];
  if (hasValue(property.L_City)) locationParts.push(property.L_City);
  if (hasValue(property.L_State)) locationParts.push(property.L_State);
  let location = locationParts.join(", ");
  if (hasValue(property.L_Zip)) {
    location = location + " " + property.L_Zip;
  }

  // Builds the 4 stat boxes, skipping anything missing
  const stats = [];
  if (hasValue(property.L_Keyword2)) {
    stats.push({ label: "Beds", value: property.L_Keyword2 });
  }
  if (hasValue(property.LM_Dec_3)) {
    stats.push({ label: "Baths", value: property.LM_Dec_3 });
  }
  if (hasValue(property.LM_Int2_3)) {
    stats.push({ label: "Sqft", value: Number(property.LM_Int2_3).toLocaleString("en-US") });
  }
  if (hasValue(property.YearBuilt)) {
    stats.push({ label: "Year Built", value: property.YearBuilt });
  }

  // Builds the "Property Details" list, skipping anything missing
  const details = [];
  details.push({ label: "Listing ID", value: property.L_ListingID });
  if (hasValue(property.LotSizeAcres)) {
    details.push({ label: "Lot Size", value: property.LotSizeAcres + " acres" });
  }
  if (hasValue(property.L_Zip)) {
    details.push({ label: "ZIP Code", value: property.L_Zip });
  }

  // Picks what to show for open houses: a message or the list
  function renderOpenHouses() {
    // if statement that checks if there are no open houses
    if (openHouses.length === 0) {
      return <p>No open houses scheduled</p>;
    }

    return (
      <ul className="open-house-list">
        {openHouses.map((oh, index) => {
          const remarks = getRemarks(oh);
          return (
            <li key={index} className="open-house-item">
              <p className="open-house-date">{formatDate(oh.OpenHouseDate)}</p>
              <p className="open-house-time">
                {formatTime(oh.OH_StartTime)} - {formatTime(oh.OH_EndTime)}
              </p>
              {remarks !== "" && <p className="open-house-remarks">{remarks}</p>}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/" className="detail-back">Back to listings</Link>

      {/* the photos */}
      <PropertyImageGallery photos={property.L_Photos} address={property.L_Address} />

      {/* price and address */}
      <h1 className="detail-price">{formatPrice(property.L_SystemPrice)}</h1>
      <p className="detail-address">{property.L_Address}</p>
      {location !== "" && <p className="detail-location">{location}</p>}

      {/* beds, baths, sqft, year built */}
      <div className="detail-stats">
        {stats.map((s) => (
          <div key={s.label} className="detail-stat">
            <p className="detail-stat-value">{s.value}</p>
            <p className="detail-stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* description */}
      {hasValue(property.L_Remarks) && (
        <section className="detail-section">
          <h2>Description</h2>
          <p>{property.L_Remarks}</p>
        </section>
      )}

      {/* extra details */}
      <section className="detail-section">
        <h2>Property Details</h2>
        <ul className="detail-list">
          {details.map((d) => (
            <li key={d.label}>
              <strong>{d.label}:</strong> {d.value}
            </li>
          ))}
        </ul>
      </section>

      {/* MAP: where the house is */}
      <section className="detail-section">
        <h2>Location</h2>
        <PropertyMap
          latitude={property.LMD_MP_Latitude}
          longitude={property.LMD_MP_Longitude}
          address={property.L_Address}
        />
      </section>

      {/* open houses */}
      <section className="detail-section">
        <h2>Open Houses</h2>
        {renderOpenHouses()}
      </section>
    </div>
  );
}

export default PropertyDetailPage;