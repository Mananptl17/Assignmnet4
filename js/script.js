document.addEventListener("DOMContentLoaded", () => {

    // Get DOM elements
    const studentInfo = document.getElementById("student-info");
    const marsWeatherContainer = document.getElementById("mars-weather");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const imageGallery = document.getElementById("image-gallery");

    // NASA API key
    const apiKey = "OfzgBPXMt4Ao8IW5gKBFIePSEzUtHzhsIQV5M8oS";

    // Display student details
    studentInfo.textContent = "Manan Patel | Student ID: 200596282";

    // Fetch Mars weather
    fetchMarsWeather();

    // Get latest weather
    function fetchMarsWeather() {
        const weatherURL = `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`;

        fetch(weatherURL)
            .then(response => response.json())
            .then(data => {
                const solKeys = data.sol_keys;
                const latestSol = solKeys?.[solKeys.length - 1];
                const weather = data[latestSol];

                // Handle missing data
                if (!latestSol || !weather) {
                    marsWeatherContainer.textContent = "Weather data unavailable.";
                    return;
                }

                // Display weather info
                marsWeatherContainer.innerHTML = `
                    <p><strong>Sol:</strong> ${latestSol}</p>
                    <p><strong>Avg Temp:</strong> ${weather.AT?.av ?? "N/A"} °C</p>
                    <p><strong>Wind Speed:</strong> ${weather.HWS?.av ?? "N/A"} m/s</p>
                    <p><strong>Pressure:</strong> ${weather.PRE?.av ?? "N/A"} Pa</p>
                `;
            })
            .catch(() => {
                // Error fetching weather
                marsWeatherContainer.textContent = "Mars weather data unavailable.";
            });
    }

    // Search Mars images
    function handleImageSearch(keyword) {
        const searchURL = `https://images-api.nasa.gov/search?q=mars ${keyword}&media_type=image`;

        // Show loading message
        imageGallery.innerHTML = "<p>Loading images...</p>";

        fetch(searchURL)
            .then(response => response.json())
            .then(data => {
                const items = data.collection?.items?.slice(0, 12);

                // Clear gallery
                imageGallery.innerHTML = "";

                // No results case
                if (!items || items.length === 0) {
                    imageGallery.innerHTML = "<p>No results found for your search.</p>";
                    return;
                }

                // Display each image
                items.forEach(item => {
                    const imgSrc = item.links?.[0]?.href;
                    const title = item.data?.[0]?.title || "Untitled";
                    const desc = item.data?.[0]?.description?.slice(0, 80) || "No description";

                    if (imgSrc) {
                        imageGallery.innerHTML += `
                            <div class="image-card">
                                <img src="${imgSrc}" alt="Mars Image" />
                                <p><strong>${title}</strong></p>
                                <p>${desc}...</p>
                            </div>
                        `;
                    }
                });
            })
            .catch(error => {
                // Image fetch failed
                console.error("Image search failed:", error);
                imageGallery.innerHTML = "<p>Error loading images.</p>";
            });
    }

    // Handle button click
    searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.trim();

        // Check empty input
        if (!keyword) {
            alert("Please enter a keyword to search for Mars images.");
            return;
        }

        handleImageSearch(keyword);
    });
});
