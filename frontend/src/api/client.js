//WEEK 5 

// Sends a get request to the backend and returns the JSON data.
// If the backend responds with an error status (400, 404, 500, etc.),
// it throws an Error with the backend's message so the page can show it.
async function request(path) {
  const res = await fetch(path);

  // Any status outside 200-299 means something went wrong
  if (res.status < 200 || res.status >= 300) {
    let message = "Request failed (" + res.status + ")";
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
    }
    throw new Error(message);
  }

  return res.json();
}



// Gets a page of properties from get /api/properties.
// Takes an optional filters object like { city: "Irvine", beds: 3 },
// removes any empty filters, and adds the rest to the URL.
// Returns { total, limit, offset, results }.
export function fetchProperties(params = {}) {
  const cleaned = {};
  for (const key in params) {
    const value = params[key];
    if (value !== "" && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  }

  const query = new URLSearchParams(cleaned).toString();

  if (query) {
    return request("/api/properties?" + query);
  }
  return request("/api/properties");
}




export function fetchPropertyDetail(id) {
  return request("/api/properties/" + encodeURIComponent(id));
}

export function fetchOpenHouses(id) {
  return request("/api/properties/" + encodeURIComponent(id) + "/openhouses");
}