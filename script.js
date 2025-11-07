const geocodeRequest = new XMLHttpRequest();
const geocodeResult = document.querySelector("#geocodeResult");
const maxTemp = document.querySelector("#maxTemp");
const minTemp = document.querySelector("#minTemp");
const currentTemp = document.querySelector("#currentTemp");
const weekForecast = document.querySelector("#weekForecast");
const clothingSuggestion = document.querySelector("#clothingSuggestion");
const characterContainer = document.querySelector("#characterContainer");

// 새로운 UI 요소들
const weatherDescription = document.querySelector("#weatherDescription");
const feelsLikeTemp = document.querySelector("#feelsLikeTemp");
const currentWeatherIcon = document.querySelector("#currentWeatherIcon");
const precipitationChance = document.querySelector("#precipitationChance");
const weatherAlert = document.querySelector("#weatherAlert");
const alertMessage = document.querySelector("#alertMessage");
const hourlyForecastContainer = document.querySelector("#hourlyForecastContainer");
const changeLocationBtn = document.querySelector("#changeLocationBtn");

// 페이지 전환 관련 요소
const weatherPage = document.querySelector("#weatherPage");
const searchPage = document.querySelector("#searchPage");
const navItems = document.querySelectorAll(".nav-item");
const backBtn = document.querySelector("#backBtn");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");
const recentSearches = document.querySelector("#recentSearches");
const popularDestinations = document.querySelector("#popularDestinations");

// 로컬 스토리지에서 최근 검색 가져오기
let recentSearchesList = JSON.parse(localStorage.getItem("recentSearches") || "[]");

// 인기 도시 목록
const popularCities = [
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
];

// 위치 아이콘 및 Change 버튼 이벤트 리스너
const currentLocationIcon = document.querySelector("#currentLocationIcon");

// 📍 아이콘 클릭 시 현재 위치로 이동
if (currentLocationIcon) {
  currentLocationIcon.addEventListener("click", () => {
    findMyCoordinates();
  });
}

// Change 버튼 클릭 시 검색 페이지로 이동
changeLocationBtn.addEventListener("click", () => {
  showPage("search");
});

// 네비게이션 클릭 이벤트
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.getAttribute("data-page");
    if (page === "search") {
      showPage("search");
    } else if (page === "weather") {
      showPage("weather");
    }
    // Profile은 아직 구현하지 않음
  });
});

// 뒤로가기 버튼
if (backBtn) {
  backBtn.addEventListener("click", () => {
    showPage("weather");
  });
}

// 페이지 전환 함수
function showPage(page) {
  if (page === "weather") {
    weatherPage.style.display = "block";
    searchPage.style.display = "none";
    updateNavActive("weather");
  } else if (page === "search") {
    weatherPage.style.display = "none";
    searchPage.style.display = "block";
    updateNavActive("search");
    loadPopularDestinations();
    loadRecentSearches();
  }
}

// 네비게이션 활성 상태 업데이트
function updateNavActive(activePage) {
  navItems.forEach((item) => {
    if (item.getAttribute("data-page") === activePage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function findMyCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geocodeApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
        getGeocodeApi(geocodeApiUrl);
        handleSuccess(position);
      },
      (err) => {
        alert(`위치 정보 오류: ${err.message}`);
        geocodeResult.textContent = "위치를 찾을 수 없습니다";
      }
    );
  } else {
    alert("Geolocation을 지원하지 않는 브라우저입니다.");
    geocodeResult.textContent = "Geolocation 미지원";
  }
}

function getGeocodeApi(geocodeApiUrl) {
  geocodeRequest.open("GET", geocodeApiUrl);
  geocodeRequest.send();
  geocodeRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        const response = JSON.parse(this.responseText);
        const city = response.city || response.locality || "알 수 없는 도시";
        const country = response.countryName || "알 수 없는 국가";
        geocodeResult.textContent = `${city}, ${country}`;
      } catch (e) {
        console.error("지오코딩 응답 파싱 오류:", e);
        geocodeResult.textContent = "위치 정보를 가져올 수 없습니다";
      }
    }
  };
}

// API 키 설정
const apiKey = "49c686d983cf933cd7b92ed9cee54208";

// 페이지 로드 시 자동으로 위치 정보 가져오기
if ("geolocation" in navigator) {
  console.log("위치 정보 사용 가능");
  navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
} else {
  console.log("Geolocation을 지원하지 않는 브라우저입니다.");
}

// 위치 정보 가져오기 성공 시
async function handleSuccess(position) {
  const lat = position.coords.latitude; // 위도
  const lon = position.coords.longitude; // 경도

  console.log(`현재 위치: 위도 ${lat}, 경도 ${lon}`);

  const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`;

  try {
    const response = await fetch(weatherApiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`날씨 API 오류: ${errorData.message}`);
    }

    const weatherData = await response.json();
    console.log(weatherData);

    // 현재 날씨 정보 업데이트
    currentTemp.textContent = Math.round(weatherData.current.temp);
    weatherDescription.textContent = weatherData.current.weather[0].description;
    feelsLikeTemp.textContent = Math.round(weatherData.current.feels_like);
    maxTemp.textContent = Math.round(weatherData.daily[0].temp.max);
    minTemp.textContent = Math.round(weatherData.daily[0].temp.min);
    precipitationChance.textContent = Math.round(weatherData.daily[0].pop * 100);

    // 현재 날씨 아이콘 업데이트
    const currentIconCode = weatherData.current.weather[0].icon;
    currentWeatherIcon.src = `http://openweathermap.org/img/wn/${currentIconCode}@2x.png`;
    currentWeatherIcon.alt = weatherData.current.weather[0].description;

    // 날씨 경고 (강수 확률이 높을 때 표시)
    if (weatherData.daily[0].pop > 0.5) {
      weatherAlert.style.display = "flex";
      const rainTime = new Date(weatherData.hourly[0].dt * 1000).toLocaleTimeString("ko-KR", {
        hour: "numeric",
        hour12: false,
      });
      alertMessage.innerHTML = `오후 ${rainTime}시에 비 예상<br>우산을 준비하세요`;
    } else {
      weatherAlert.style.display = "none";
    }

    // 시간별 예보
    hourlyForecastContainer.innerHTML = "";
    for (let i = 0; i < Math.min(weatherData.hourly.length, 8); i++) {
      const hourlyData = weatherData.hourly[i];
      const time = new Date(hourlyData.dt * 1000).toLocaleTimeString("ko-KR", {
        hour: "numeric",
        hour12: false,
      });
      const temp = Math.round(hourlyData.temp);
      const iconCode = hourlyData.weather[0].icon;
      const precipitationProb = Math.round(hourlyData.pop * 100);

      const hourlyCard = document.createElement("div");
      hourlyCard.classList.add("hourly-card");
      hourlyCard.innerHTML = `
        <div class="time">${i === 0 ? "Now" : `${time}`}</div>
        <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="${hourlyData.weather[0].description}">
        <div class="temp">${temp}°</div>
        <div class="precipitation">💧 ${precipitationProb}%</div>
      `;
      hourlyForecastContainer.appendChild(hourlyCard);
    }

    // 7일 예보
    weekForecast.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      const dailyData = weatherData.daily[i];
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("daily-forecast-item");
      const dayMinTemp = Math.round(dailyData.temp.min);
      const dayMaxTemp = Math.round(dailyData.temp.max);
      const dayIconCode = dailyData.weather[0].icon;
      const dayDescription = dailyData.weather[0].description;
      const dayPrecipitationProb = Math.round(dailyData.pop * 100);

      const date = new Date(dailyData.dt * 1000);
      const options = { weekday: "short" };
      let dayName = date.toLocaleDateString("ko-KR", options);
      if (i === 0) dayName = "오늘";
      if (i === 1) dayName = "내일";

      dayDiv.innerHTML = `
        <span class="day">${dayName}</span>
        <img src="http://openweathermap.org/img/wn/${dayIconCode}.png" alt="${dayDescription}">
        <span class="precipitation">💧 ${dayPrecipitationProb}%</span>
        <span class="high-temp">${dayMaxTemp}°</span>
        <span class="low-temp">${dayMinTemp}°</span>
      `;
      weekForecast.appendChild(dayDiv);
    }

    // 캐릭터 이미지 및 의상 추천
    const feelsLike = weatherData.current.feels_like;
    characterContainer.innerHTML = "";
    clothingSuggestion.innerHTML = "";

    // 캐릭터 이미지 모음
    const winterImg = document.createElement("img");
    winterImg.src = "images/winter.png";
    winterImg.alt = "winter image";
    const temp5to9Img = document.createElement("img");
    temp5to9Img.src = "images/5-9.png";
    temp5to9Img.alt = "5-9 degrees outfit";
    const temp9to11Img = document.createElement("img");
    temp9to11Img.src = "images/9-11.png";
    temp9to11Img.alt = "9-11 degrees outfit";
    const temp12to16Img = document.createElement("img");
    temp12to16Img.src = "images/12-16.png";
    temp12to16Img.alt = "12-16 degrees outfit";
    const temp17to19Img = document.createElement("img");
    temp17to19Img.src = "images/17-19.png";
    temp17to19Img.alt = "17-19 degrees outfit";
    const temp20to22Img = document.createElement("img");
    temp20to22Img.src = "images/20-22.png";
    temp20to22Img.alt = "20-22 degrees outfit";
    const temp23to27Img = document.createElement("img");
    temp23to27Img.src = "images/23-27.png";
    temp23to27Img.alt = "23-27 degrees outfit";
    const temp28PlusImg = document.createElement("img");
    temp28PlusImg.src = "images/28.png";
    temp28PlusImg.alt = "28+ degrees outfit";

    if (feelsLike < 5) {
      characterContainer.appendChild(winterImg);
      clothingSuggestion.textContent = "-> 추천 의상: 🧣 두꺼운 코트, 패딩, 목도리, 기모제품";
    } else if (feelsLike < 10) {
      characterContainer.appendChild(temp5to9Img);
      clothingSuggestion.textContent = "-> 추천 의상: 🧥 코트, 가죽자켓, 히트텍, 니트, 레깅스";
    } else if (feelsLike < 12) {
      characterContainer.appendChild(temp9to11Img);
      clothingSuggestion.textContent = "-> 추천 의상: 👔 자켓, 트렌치코트, 야상, 니트, 청바지, 스타킹";
    } else if (feelsLike < 17) {
      characterContainer.appendChild(temp12to16Img);
      clothingSuggestion.textContent = "-> 추천 의상: 👖 자켓, 가디건, 야상, 스타킹, 청바지, 면바지";
    } else if (feelsLike < 20) {
      characterContainer.appendChild(temp17to19Img);
      clothingSuggestion.textContent = "-> 추천 의상: 👖 얇은 니트, 맨투맨, 가디건, 청바지";
    } else if (feelsLike < 23) {
      characterContainer.appendChild(temp20to22Img);
      clothingSuggestion.textContent = "-> 추천 의상: 👖 얇은 가디건, 긴팔, 면바지, 청바지";
    } else if (feelsLike < 28) {
      characterContainer.appendChild(temp23to27Img);
      clothingSuggestion.textContent = "-> 추천 의상: 👕 반팔, 얇은 셔츠, 반바지, 면바지";
    } else {
      characterContainer.appendChild(temp28PlusImg);
      clothingSuggestion.textContent = "-> 추천 의상: 👚 민소매, 반팔, 반바지, 원피스";
    }
  } catch (error) {
    console.error("날씨 정보 조회 중 오류:", error.message);
  }
}

// 위치 정보 가져오기 실패 시
function handleError(error) {
  console.error(`위치 정보를 가져오는 데 실패했습니다: ${error.message}`);
  geocodeResult.textContent = "위치 정보를 가져올 수 없습니다";
}

// 검색 기능
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
      searchCities(query);
    } else {
      if (searchResults) searchResults.innerHTML = "";
    }
  });
}

// 도시 검색 함수
async function searchCities(query) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("검색 실패");
    const cities = await response.json();
    displaySearchResults(cities);
  } catch (error) {
    console.error("도시 검색 오류:", error);
    searchResults.innerHTML = "<div style='padding: 20px; text-align: center; color: #666;'>검색 중 오류가 발생했습니다.</div>";
  }
}

// 검색 결과 표시
function displaySearchResults(cities) {
  searchResults.innerHTML = "";
  if (cities.length === 0) {
    searchResults.innerHTML = "<div style='padding: 20px; text-align: center; color: #666;'>검색 결과가 없습니다.</div>";
    return;
  }

  cities.forEach((city) => {
    const card = createLocationCard(city.name, city.country, city.lat, city.lon);
    searchResults.appendChild(card);
  });
}

// 위치 카드 생성 함수
function createLocationCard(cityName, countryName, lat, lon) {
  const card = document.createElement("div");
  card.classList.add("location-card");
  
  // 날씨 정보 가져오기
  fetchWeatherForLocation(cityName, countryName, lat, lon).then((weatherInfo) => {
    card.innerHTML = `
      <img src="https://via.placeholder.com/60x60?text=${cityName.charAt(0)}" alt="${cityName}" class="location-image" />
      <div class="location-info">
        <div class="location-name">
          <span class="location-pin">📍</span>
          ${cityName}
        </div>
        <div class="location-country">${countryName}</div>
        <div class="location-weather">
          <span class="weather-emoji">${getWeatherEmoji(weatherInfo.icon)}</span>
          ${weatherInfo.description}
        </div>
      </div>
      <div class="location-temp">${weatherInfo.temp}°C</div>
    `;
  });

  card.addEventListener("click", () => {
    selectLocation(cityName, countryName, lat, lon);
  });

  return card;
}

// 특정 위치의 날씨 정보 가져오기
async function fetchWeatherForLocation(cityName, countryName, lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`
    );
    if (!response.ok) throw new Error("날씨 정보 가져오기 실패");
    const data = await response.json();
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error("날씨 정보 가져오기 오류:", error);
    return { temp: "--", description: "알 수 없음", icon: "01d" };
  }
}

// 날씨 아이콘을 이모지로 변환
function getWeatherEmoji(iconCode) {
  const iconMap = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return iconMap[iconCode] || "☀️";
}

// 위치 선택 함수
function selectLocation(cityName, countryName, lat, lon) {
  // 최근 검색에 추가
  const searchItem = { name: cityName, country: countryName, lat, lon, timestamp: Date.now() };
  recentSearchesList = recentSearchesList.filter(
    (item) => !(item.name === cityName && item.country === countryName)
  );
  recentSearchesList.unshift(searchItem);
  if (recentSearchesList.length > 5) {
    recentSearchesList = recentSearchesList.slice(0, 5);
  }
  localStorage.setItem("recentSearches", JSON.stringify(recentSearchesList));

  // 날씨 페이지로 이동하고 해당 위치의 날씨 표시
  showPage("weather");
  handleLocationWeather(cityName, countryName, lat, lon);
}

// 특정 위치의 날씨 표시
async function handleLocationWeather(cityName, countryName, lat, lon) {
  geocodeResult.textContent = `${cityName}, ${countryName}`;
  const position = { coords: { latitude: lat, longitude: lon } };
  await handleSuccess(position);
}

// 인기 도시 목록 로드
function loadPopularDestinations() {
  popularDestinations.innerHTML = "";
  popularCities.forEach((city) => {
    const card = createLocationCard(city.name, city.country, city.lat, city.lon);
    popularDestinations.appendChild(card);
  });
}

// 최근 검색 목록 로드
function loadRecentSearches() {
  recentSearches.innerHTML = "";
  if (recentSearchesList.length === 0) {
    recentSearches.innerHTML = "<div style='padding: 10px; text-align: center; color: #999; font-size: 0.9em;'>최근 검색 기록이 없습니다.</div>";
    return;
  }

  recentSearchesList.forEach((item) => {
    const card = createLocationCard(item.name, item.country, item.lat, item.lon);
    recentSearches.appendChild(card);
  });
}
