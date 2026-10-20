// Makes sure L_Photos is always a clean list of photo links, even when the data is empty or broken.

export function getPhotos(photodata) {
  //if photo box is empty then return an empty list
  if (photodata === null || photodata === undefined || photodata === "") {
    return [];
  }

  let list = photodata;

  // If photodata is text, try to turn it into a real list
  if (typeof photodata === "string") {
    try {
      list = JSON.parse(photodata);
    } catch {
      return [];
    }
  }

  // If it still isn't a list, give up safely
  if (!Array.isArray(list)) {
    return [];
  }

 // Go through each item in the list and only keep the ones that are actual photo links (text that isn't blank). Skip anything else.
  const photos = [];
  for (const item of list) {
    if (typeof item === "string" && item.trim() !== "") {
      photos.push(item);
    }
  }

  return photos;
}

// Shortcut for the listing cards, gets just the first photo (used on the cards)
export function getFirstPhoto(raw) {
  const photos = getPhotos(raw);
  if (photos.length > 0) {
    return photos[0];
  }
  return null;
}