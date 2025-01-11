const API_KEY = "591599ac72b65ff2b515180cf5672865";

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
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

                    const weatherImg = `<img src="${iconUrl}" alt="Weather Icon" class="weatherImg" />`;

                    // Prepare the HTML content to display the weather information
                    const weather = `
                    <div class="weatherDiv">
                        <p><strong>Location:</strong> ${data.name}, ${
                        data.sys.country
                    }</p>
                    </div>
                    <div class="weatherDiv">
                        <p><strong>Temperature:</strong> ${Math.round(
                            data.main.temp - 273.15
                        )}°C</p>
                    </div>
                    <div class="weatherDiv">
                        <p><strong>Weather:</strong> ${
                            data.weather[0].description
                        }</p>
                    </div>
                    <div class="weatherDiv">
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

                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
                fetch(forecastUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        displayHourlyForecast(data.list);
                    })
                    .catch((error) => {
                        console.error(
                            "Error fetching hourly forecast data:",
                            error
                        );
                    });

                function displayHourlyForecast(hourlyData) {
                    const hourlyForeCastDiv =
                        document.getElementById("hourly-forecast");

                    hourlyForeCastDiv.innerHTML = "";

                    const currentTime = new Date();
                    const currentHour = currentTime.getHours();

                    let closestIndex = 0;
                    for (let i = 0; i < hourlyData.length; i++) {
                        const forecastTime = new Date(hourlyData[i].dt * 1000);
                        const forecastHour = forecastTime.getHours();

                        if (forecastHour >= currentHour) {
                            closestIndex = i;
                            break;
                        }
                    }

                    const next24Hours = hourlyData.slice(
                        closestIndex,
                        closestIndex + 8
                    );

                    next24Hours.forEach((item) => {
                        const dateTime = new Date(item.dt * 1000);
                        const hour = dateTime.getHours();
                        const temperature = Math.round(item.main.temp);
                        const iconCode = item.weather[0].icon;
                        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

                        const hourlyItemHtml = `
                                <div class="hourly-item">
                                    <span>${hour}:00</span>
                                    <img src="${iconUrl}" alt="Hourly Weather Icon" />
                                    <span>${temperature}°C</span>
                                </div>`;

                        hourlyForeCastDiv.innerHTML += hourlyItemHtml;
                    });
                }
            } catch (e) {
                console.log(e.message);
                document.getElementById(
                    "results"
                ).innerHTML = `<p>Error: ${e.message}</p>`;
            }
            document.getElementById("cityName").value = "";
        }
        fetchData();
    } else {
        alert("Please enter a city");
        return;
    }
});
