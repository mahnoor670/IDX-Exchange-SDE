import { useState } from "react";
import { getAllPhotos } from "./PropertyImageGallery";

// WEEK 8: the photo part of each house card
// Shows one photo at a time with arrows to flip through them
// and a counter like "3 / 12" in the corner.


// FUNCTION: PropertyImageCarousel
// The card gives it the house's photos and address
function PropertyImageCarousel({ photos, address }) {
  // turns the L_Photos text into a real list of links (same as the gallery)
  const photoList = getAllPhotos(photos);

  // which photo is showing right now (0 = the first photo)
  const [current, setCurrent] = useState(0);

  // remembers which photos failed to load
  const [broken, setBroken] = useState({});

  // if statement that checks if this house has no photos
  // if so, show the gray "No photo" box
  if (photoList.length === 0) {
    return (
      <div className="property-card-photo property-card-no-photo">
        No photo
      </div>
    );
  }

  // goes to the next photo, loops back to the first one at the end
  function showNext(event) {
    // stops the click here so it doesn't also open the house's page
    event.stopPropagation();
    setCurrent((current + 1) % photoList.length);
  }

  // goes to the photo before, loops to the last one at the start
  function showPrev(event) {
    // stops the click here so it doesn't also open the house's page
    event.stopPropagation();
    setCurrent((current - 1 + photoList.length) % photoList.length);
  }

  // if a photo link is broken, remember it so we stop trying to show it
  function markBroken() {
    setBroken({ ...broken, [current]: true });
  }

  // if statement that checks if the photo showing right now is broken
  // if so, show a gray box, if not, show the photo
  let photoPart = (
    <img
      className="property-card-photo"
      src={photoList[current]}
      alt={address + " photo " + (current + 1)}
      onError={markBroken}
    />
  );
  if (broken[current]) {
    photoPart = (
      <div className="property-card-photo property-card-no-photo">
        Photo unavailable
      </div>
    );
  }

  // if statement that checks if there's only 1 photo
  // if so, no arrows or counter, just the photo
  if (photoList.length === 1) {
    return <div className="carousel">{photoPart}</div>;
  }

  return (
    <div className="carousel">
      {photoPart}

      {/* left arrow */}
      <button className="carousel-btn carousel-prev" onClick={showPrev}>
        &lt;
      </button>

      {/* right arrow */}
      <button className="carousel-btn carousel-next" onClick={showNext}>
        &gt;
      </button>

      {/* counter in the corner, like 3 / 12 */}
      <span className="carousel-counter">
        {current + 1} / {photoList.length}
      </span>
    </div>
  );
}

export default PropertyImageCarousel;