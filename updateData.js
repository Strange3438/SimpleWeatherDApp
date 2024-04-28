document.addEventListener("DOMContentLoaded", function () {
  const APIKey = "9282dd7ea7d7ae91662219a69fe6fabf";
  const weatherData = document.getElementById("WeatherInfo");
  const submitButton = document.getElementById("submitButton");

  function capitalize(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  submitButton.addEventListener("click", async () => {
    const cityName = document.getElementById("city").value;
    if (!cityName) {
      weatherData.innerHTML = "<p>Enter the city name!!</p>";
      weatherData.style.display = "block";
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.enable();

      const contractAddress = "0x73511669fd4de447fed18bb79bafeac93ab7f31f";
      const contractABI = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "cityName",
              type: "string",
            },
          ],
          name: "CitySet",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
          ],
          name: "setCityName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "cityName",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider.getSigner()
      );

      const setCityTransaction = await contract.setCityName(cityName);
      await setCityTransaction.wait();

      const weatherContent = await fetchWeatherData(cityName);
      weatherData.innerHTML = weatherContent;
    } catch (error) {
      console.error("Error:", error);
      weatherData.innerHTML = "<p>Error fetching the Weather Data!!</p><p>Please enter a valid city name or try connecting with a valid Ethereum account with sufficient balance...</p>";
      weatherData.style.display = "block";
    }
  });

  async function fetchWeatherData(cityName) {
    const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=metric`;

    try {
      const response = await fetch(APIUrl);
      const data = await response.json();

      const { name, main, weather } = data;
      const temperature = main.temp;
      const description = capitalize(weather[0].description);

      weatherData.style.display = "block";

      return `
            <p><b>City : </b> ${name}</p>
            <p><b>Temperature : </b> ${temperature}°C</p>
            <p><b>Weather : </b> ${description}</p>
            `;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data.");
    }
  }
});
