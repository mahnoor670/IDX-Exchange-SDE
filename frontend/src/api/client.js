// All requests to the Express backend go through this file.
// The "proxy" in package.json forwards /api/* to localhost:5000.

async function request(path) {
  const res = await fetch(path);

  // Any status outside 200-299 means something went wrong
  if (res.status < 200 || res.status >= 300) {
    // Your backend sends errors like { error: "Failed to fetch properties" }.
    // Try to read that message; fall back to a generic one.
    let message = "Request failed (" + res.status + ")";
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      // Response wasn't JSON, keep the generic message
    }
    throw new Error(message);
  }

  return res.json();
}

export function fetchProperties(params = {}) {
  // Only keep filters that actually have a value
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