// Initialize map (Pretoria view)
const map = L.map('map').setView([-25.755, 28.230], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Load places from localStorage or start with demo
let places = JSON.parse(localStorage.getItem("empower_places")) || [
  {name:"East Entrance Library", lat:-25.7545, lng:28.2295, attrs:["Wheelchair","Ramp"], review:"Wide ramps, easy access.", rating:5},
  {name:"Main Square Crossing", lat:-25.7560, lng:28.2310, attrs:["Audio"], review:"Has audio signals but no tactile paving.", rating:4},
  {name:"Transit Hub Lift", lat:-25.7572, lng:28.2281, attrs:["Wheelchair","Braille"], review:"Reliable lift with braille buttons.", rating:5}
];

let markers = [];

// Render markers on the map
function renderMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const fWheel = document.getElementById("filter-wheelchair").checked;
  const fAudio = document.getElementById("filter-audio").checked;
  const fBraille = document.getElementById("filter-braille").checked;
  const fRamp = document.getElementById("filter-ramp").checked;

  places.forEach(p => {
    const show =
      (!fWheel || p.attrs.includes("Wheelchair")) &&
      (!fAudio || p.attrs.includes("Audio")) &&
      (!fBraille || p.attrs.includes("Braille")) &&
      (!fRamp || p.attrs.includes("Ramp"));

    if (show) {
      const marker = L.marker([p.lat, p.lng]).addTo(map)
        .bindPopup(`<strong>${p.name}</strong><br>
          Features: ${p.attrs.join(", ")}<br>
          Rating: ${"★".repeat(p.rating)}<br>
          Review: ${p.review || "No review"}`);
      markers.push(marker);
    }
  });
}

// Initial render
renderMarkers();

// Filter listeners
document.querySelectorAll("#controls input").forEach(cb => {
  cb.addEventListener("change", renderMarkers);
});

// Add place form
document.getElementById("addPlaceForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("placeName").value;
  const lat = parseFloat(document.getElementById("placeLat").value);
  const lng = parseFloat(document.getElementById("placeLng").value);
  const review = document.getElementById("placeReview").value;
  const rating = parseInt(document.getElementById("placeRating").value);
  const attrs = Array.from(document.querySelectorAll("#addPlaceForm input[type=checkbox]:checked"))
    .map(cb => cb.value);

  places.push({name, lat, lng, attrs, review, rating});
  localStorage.setItem("empower_places", JSON.stringify(places));
  renderMarkers();
  e.target.reset();
  alert("Place added!");
});
