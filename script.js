const http = new XMLHttpRequest();
let result = document.querySelector("#result");
let weatherInfo = document.querySelector("#weatherInfo");
let city = document.querySelector("#city");
let maxTemp = document.querySelector("#maxTemp");
let minTemp = document.querySelector("#minTemp");
let currentTemp = document.querySelector("#currentTemp");
let firstDay = document.querySelector("day1");
let weekContainer = document.querySelector("#week");
let suggestClothes = document.querySelector("#clothes");
let characterImg = document.querySelector("#character");

document.querySelector("#share").addEventListener("click", () => {
  findMyCoordinates();
});

document.querySelector("#info").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
});

function findMyCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //  console.log(position.coords.latitude, position.coords.longitude)
        const bdcApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
        getApi(bdcApi);
      },
      (err) => {
        alert(err.message);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

function getApi(bdcApi) {
  http.open("GET", bdcApi);
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      result.innerHTML = this.responseText;
    }
  };
}

// 1. API 키 설정
const apiKey = "49c686d983cf933cd7b92ed9cee54208";

// 2. Geolocation을 지원하는지 확인
if ("geolocation" in navigator) {
  console.log("위치 정보 사용 가능");

  // 3. 현재 위치 요청
  // navigator.geolocation.getCurrentPosition(성공 콜백, 실패 콜백);
  navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
} else {
  console.log("Geolocation을 지원하지 않는 브라우저입니다.");
  // 위치 정보를 사용할 수 없을 때 기본 도시(예: 서울)의 날씨를 보여줄 수 있습니다.
  // fetchWeatherByCity("Seoul");
}

// 4. 위치 정보 가져오기 성공 시
async function handleSuccess(position) {
  const lat = position.coords.latitude; // 위도
  const lon = position.coords.longitude; // 경도

  const milliseconds = Date.now();

  console.log(`Milliseconds since epoch: ${milliseconds}`);

  console.log(`현재 위치: 위도 ${lat}, 경도 ${lon}`);

  // 5. 위도/경도를 기반으로 날씨 API 호출
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`;

  const currentUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`;

  // const dailyUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${apiKey}`

  try {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`날씨 API 오류: ${errorData.message}`);
    }

    const data = await response.json();
    console.log(data);

    // const locationName  = data.city.name;
    // console.log(`----위치 ${locationName}---`)

    // const forecastList = data.list

    // 6. 결과 표시 (이전 코드와 동일)
    // const temp = data.list[0].main.temp;
    const feelsLike = data.current.feels_like;
    // const description = data.list[0].weather[0].description;
    // const cityName = data.city.name
    // const locationName = data.name; // API가 반환해 준 현 위치 이름 (예: 'Sillim-dong')

    // console.log(`--- ${locationName} 날씨 정보 ---`);
    // console.log(`현재 기온: ${temp}°C`);

    // 화면에 뿌리기
    // const weatherResult = JSON.stringify(data)
    // weatherInfo.textContent = weatherResult

    // city.textContent = `${cityName}의 날씨`
    // city.textContent = `${cityName}의 날씨`

    const dailyMin = JSON.stringify(data.daily[0].temp.min);
    minTemp.textContent = ` ${dailyMin}°C`;
    const dailyMax = JSON.stringify(data.daily[0].temp.max);
    maxTemp.textContent = `${dailyMax}°C`;
    const nowTemp = JSON.stringify(data.current.temp);
    currentTemp.textContent = ` ${nowTemp}°C`;

    for (let i = 0; i < 7; i++) {
      // console.log("Iteration number:", i);

      // const week = JSON.stringify(data.daily[i].summary)
      const weekday = JSON.stringify(data.daily[i].temp.day);
      // day1.textContent += `첫날 ${week}`

      const dayImg = document.createAttribute("img");

      const newDayDiv = document.createElement("div");
      newDayDiv.textContent = data.daily[i].temp.min + "°C";
      console.log(newDayDiv);

      weekContainer.appendChild(newDayDiv);
    }

    // suggestClothes.append('확인용')
    // 날씨 기반 의상 추천 (간단한 예시)

    // 캐릭터 이미지 모음
    const clothesImg = document.createElement("img");
    clothesImg.src = "images/winter.png";
    clothesImg.alt = "winter image";
    const clothesImg5 = document.createElement("img");
    clothesImg5.src = "images/5-9.png";
    const clothesImg9 = document.createElement("img");
    clothesImg9.src = "images/9-11.png";
    const clothesImg12 = document.createElement("img");
    clothesImg12.src = "images/12-16.png";
    const clothesImg17 = document.createElement("img");
    clothesImg17.src = "images/17-19.png";
    const clothesImg20 = document.createElement("img");
    clothesImg20.src = "images/20-22.png";
    const clothesImg23 = document.createElement("img");
    clothesImg23.src = "images/23-27.png";
    const clothesImg28 = document.createElement("img");
    clothesImg28.src = "images/28.png";

    if (feelsLike < 5) {
      suggestClothes.append(
        "-> 추천 의상: 🧣 두꺼운 코트, 패딩, 목도리, 기모제품"
      );
    } else if (feelsLike < 10) {
      characterImg.append(clothesImg5);
      suggestClothes.append(
        "-> 추천 의상: 🧥 코트, 가죽자켓, 히트텍, 니트, 레깅스"
      );
    } else if (feelsLike < 12) {
      suggestClothes.append(
        "-> 추천 의상: 👔 자켓, 트렌치코트, 야상, 니트, 청바지, 스타킹"
      );
      characterImg.append(clothesImg9);
    } else if (feelsLike < 17) {
      suggestClothes.append(
        "-> 추천 의상: 👖 자켓, 가디건, 야상, 스타킹, 청바지, 면바지"
      );
      characterImg.append(clothesImg12);
    } else if (feelsLike < 20) {
      suggestClothes.append(
        "-> 추천 의상: 👖 얇은 니트, 맨투맨, 가디건, 청바지"
      );
      characterImg.append(clothesImg17);
    } else if (feelsLike < 23) {
      suggestClothes.append(
        "-> 추천 의상: 👖 얇은 가디건, 긴팔, 면바지, 청바지"
      );
      characterImg.append(clothesImg20);
    } else if (feelsLike < 28) {
      suggestClothes.append("-> 추천 의상: 👕 반팔, 얇은 셔츠, 반바지, 면바지");
      characterImg.append(clothesImg23);
    } else {
      console.log("-> 추천 의상:  반팔, 얇은 셔츠, 반바지");
      characterImg.append(clothesImg28);
      suggestClothes.append("-> 추천 의상: 👚 민소매, 반팔, 반바지, 원피스");
    }
  } catch (error) {
    console.error("날씨 정보 조회 중 오류:", error.message);
  }
}

// 7. 위치 정보 가져오기 실패 시 (예: 사용자가 거부)
function handleError(error) {
  console.error(`위치 정보를 가져오는 데 실패했습니다: ${error.message}`);
  // (대안) 사용자에게 직접 도시를 입력받거나 기본 도시로 설정
}
