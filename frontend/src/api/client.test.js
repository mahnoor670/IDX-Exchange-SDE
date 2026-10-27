import { fetchProperties } from "./client";

// WEEK 6: Tests for fetchProperties
// Uses a fake backend so we can choose what it sends back
// This way the tests work even when the real backend isn't running


beforeEach(() => {
  // Before every test, swap the real fetch for a fake one
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

// First test: when the backend works, we get the data back
test("fetchProperties returns the data when the request works", async () => {
  const fakeData = {
    total: 1,
    limit: 20,
    offset: 0,
    results: [{ L_ListingID: "123", L_City: "San Diego" }],
  };

  global.fetch.mockResolvedValue({
    status: 200,
    json: async () => fakeData,
  });

  const data = await fetchProperties();

  expect(data).toEqual(fakeData);
  expect(global.fetch).toHaveBeenCalledWith("/api/properties");
});

// Second test: when the backend sends an error, we throw its message
test("fetchProperties throws the backend's error message on a 400", async () => {
  global.fetch.mockResolvedValue({
    status: 400,
    json: async () => ({ error: "minPrice must be a number" }),
  });

  await expect(fetchProperties({ minPrice: "abc" })).rejects.toThrow(
    "minPrice must be a number"
  );
});


// Third test: empty boxes get left out of the search
// City and zipcode are empty, so only beds=3 should end up in the URL
test("fetchProperties skips empty filters", async () => {
  global.fetch.mockResolvedValue({
    status: 200,
    json: async () => ({ total: 0, limit: 20, offset: 0, results: [] }),
  });

  await fetchProperties({ city: "", zipcode: null, beds: 3 });

  expect(global.fetch).toHaveBeenCalledWith("/api/properties?beds=3");
});