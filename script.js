import { API_KEY } from "./api.js";

document.getElementById("getWeather").addEventListener("click", () => {
    let city = document.getElementById("cityName").value;
    if (city) {
        async function fetchData() {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error("Could not fetch data!");
                }

                const data = await response.json();
                console.log(data);
                if (data.cod === 200) {
                    // Get the weather icon code
                    const iconCode = data.weather[0].icon;
                    // Construct the image URL using the icon code
                    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

                    const weatherImg = `<img src="${iconUrl}" alt="Weather Icon" class="weatherImg" />`;

                    // Prepare the HTML content to display the weather information
                    const weather = `
                    <div class= "weatherDiv">
                        <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
                    </div>
                    <div class= "weatherDiv">
                        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                    </div>
                     <div class= "weatherDiv">
                        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                    </div>
                     <div class= "weatherDiv">
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    </div>`;

                    // Set the weather information to the result div
                    document.getElementById("results").innerHTML = weather;
                    document.getElementById("image").innerHTML = weatherImg;
                } else {
                    document.getElementById(
                        "results"
                    ).innerHTML = `<p>City not found.</p>`;
                }
            } catch (e) {
                console.log(e.message);
                document.getElementById(
                    "results"
                ).innerHTML = `<p>Error: ${e.message}</p>`;
            }
            document.getElementById("cityName").value = ""; // Clear the input field after fetching
        }
        fetchData();
    }
});
