// Function to update vehicle information
function updateVehicleInfo(time, date, location, altitude) {
    document.getElementById("time").innerText = "Time: " + time;
    document.getElementById("date").innerText = "Date: " + date;
    document.getElementById("location").innerText = "Location: " + location;
    document.getElementById("altitude").innerText = "Altitude: " + altitude + " meters";
  }
  
  // Function to fetch vehicle information from the backend
  function fetchVehicleInfo() {
    // Make an AJAX request to fetch vehicle information from the backend
    // Replace the URL with the actual endpoint on your backend server
    fetch("backend_endpoint_url")
      .then(response => response.json())
      .then(data => {
        // Update vehicle information with data received from the backend
        updateVehicleInfo(data.time, data.date, data.location, data.altitude);
      })
      .catch(error => {
        console.error("Error fetching vehicle information:", error);
      });
  }
  
  // Fetch vehicle information from the backend initially on page load
  fetchVehicleInfo();
  
  // Update vehicle information every second
  setInterval(fetchVehicleInfo, 1000);
  fetch('http://localhost:3000/routes/auth')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Output the response from the backend
  })
  .catch(error => {
    console.error('Error:', error);
  });
