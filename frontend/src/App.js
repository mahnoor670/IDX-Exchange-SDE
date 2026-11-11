import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

// WEEK 8: the app now has 2 pages
// "/" is the grid of houses
// "/property/12345" is the page for one house (12345 is the listing ID)
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;