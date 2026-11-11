import { useState, useEffect, useRef } from "react";

// WEEK 8: the photo section on the detail page
// Shows one big photo, a row of small photos under it,
// and opens a full screen view (lightbox) when you click the big photo.


// FUNCTION: getAllPhotos
// L_Photos comes from the database as text that looks like a list.
// This turns it into a real list of photo links.
// If something's wrong with it, we just get an empty list so nothing breaks.
export function getAllPhotos(rawPhotos) {
  // if statement that checks if there are no photos at all
  if (!rawPhotos) {
    return [];
  }

  let photos = rawPhotos;

  // if statement that checks if the photos are still text
  // if so, turn the text into a real list
  if (typeof photos === "string") {
    try {
      photos = JSON.parse(photos);
    } catch {
      return [];
    }
  }

  // if statement that checks if we still don't have a list
  if (!Array.isArray(photos)) {
    return [];
  }

  // only keep real links, skip anything empty
  return photos.filter((p) => typeof p === "string" && p !== "");
}


// FUNCTION: PropertyImageGallery
// The detail page gives it the house's photos and address
function PropertyImageGallery({ photos, address }) {
  const photoList = getAllPhotos(photos);

  // which photo is the big one right now (0 = the first photo)
  const [selected, setSelected] = useState(0);

  // if the full screen view is open or not
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // a way to grab the lightbox box so we can put the keyboard focus on it
  const lightboxRef = useRef(null);

  // DEBUG CHALLENGE: when the lightbox opens, put the keyboard focus on it.
  // A div can only hear key presses (like Escape) if it has focus.
  useEffect(() => {
    if (lightboxOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [lightboxOpen]);

  // if statement that checks if this house has no photos
  // if so, show a gray box instead
  if (photoList.length === 0) {
    return <div className="gallery-empty">No photos available</div>;
  }

  // goes to the next photo, and loops back to the first one at the end
  function showNext() {
    setSelected((selected + 1) % photoList.length);
  }

  // goes to the photo before, and loops to the last one at the start
  function showPrev() {
    setSelected((selected - 1 + photoList.length) % photoList.length);
  }

  // runs when a key is pressed while the lightbox is open
  function handleKeyDown(event) {
    // if statement that checks if Escape was pressed, closes the lightbox
    if (event.key === "Escape") {
      setLightboxOpen(false);
    }
    // if statement that checks if the right arrow key was pressed
    if (event.key === "ArrowRight") {
      showNext();
    }
    // if statement that checks if the left arrow key was pressed
    if (event.key === "ArrowLeft") {
      showPrev();
    }
  }

  // makes one small photo in the row
  function renderThumbnail(photo, index) {
    // the small photo that matches the big one gets a blue border
    let className = "gallery-thumb";
    if (index === selected) {
      className = "gallery-thumb gallery-thumb-active";
    }

    return (
      <img
        key={index}
        className={className}
        src={photo}
        alt={address + " photo " + (index + 1)}
        onClick={() => setSelected(index)}
      />
    );
  }

  // makes the full screen view, but only when it's open
  let lightbox = null;
  if (lightboxOpen) {
    lightbox = (
      // DEBUG CHALLENGE FIX: tabIndex lets this div get focus,
      // which is what lets it hear the Escape key
      <div
        className="lightbox"
        ref={lightboxRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={() => setLightboxOpen(false)}
      >
        {/* stopPropagation means clicking these won't also close the lightbox */}
        <button
          className="lightbox-btn lightbox-prev"
          onClick={(event) => {
            event.stopPropagation();
            showPrev();
          }}
        >
          &lt;
        </button>

        <img
          className="lightbox-photo"
          src={photoList[selected]}
          alt={address + " photo " + (selected + 1)}
          onClick={(event) => event.stopPropagation()}
        />

        <button
          className="lightbox-btn lightbox-next"
          onClick={(event) => {
            event.stopPropagation();
            showNext();
          }}
        >
          &gt;
        </button>

        <p className="lightbox-counter">
          {selected + 1} / {photoList.length}
        </p>
      </div>
    );
  }

  return (
    <div className="gallery">
      {/* the big photo, click it to open full screen */}
      <img
        className="gallery-main"
        src={photoList[selected]}
        alt={address + " photo " + (selected + 1)}
        onClick={() => setLightboxOpen(true)}
      />

      {/* the row of small photos */}
      <div className="gallery-strip">
        {photoList.map(renderThumbnail)}
      </div>

      {lightbox}
    </div>
  );
}

export default PropertyImageGallery;