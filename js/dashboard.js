// Simulated vehicle data
const vehicles = [
    { id: 1, name: "Vehicle 1", status: "online" },
    { id: 2, name: "Vehicle 2", status: "offline" },
    { id: 3, name: "Vehicle 3", status: "online" }
  ];
  
  // Function to display vehicle status in overview
  function displayVehicleStatus() {
    const vehicleList = document.getElementById("vehicle-list");
    vehicleList.innerHTML = ""; // Clear previous content
    vehicles.forEach(vehicle => {
      const statusClass = vehicle.status === "online" ? "online" : "offline";
      const listItem = document.createElement("div");
      listItem.classList.add("vehicle-item");
      listItem.innerHTML = `<strong>${vehicle.name}</strong> - <span class="${statusClass}">${vehicle.status}</span>`;
      vehicleList.appendChild(listItem);
    });
  }
  
  // Function to switch between overview and map
  function switchSection(sectionId) {
    const sections = document.querySelectorAll(".container");
    sections.forEach(section => {
      section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
  }
  
  // Event listeners for navigation links
  document.getElementById("overview-link").addEventListener("click", function(event) {
    event.preventDefault();
    switchSection("overview");
    displayVehicleStatus();
  });
  
  document.getElementById("map-link").addEventListener("click", function(event) {
    event.preventDefault();
    switchSection("map");
    // Code to initialize map can be added here
  });
  
  // Initial display on page load
  switchSection("overview");
  displayVehicleStatus();
  