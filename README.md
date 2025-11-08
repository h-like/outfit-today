# 👗 Outfit Today

🌞 온도 기반 의상 추천 웹 애플리케이션
- [배포 링크](https://h-like.github.io/outfit-today/)
<img alt="Image" src="https://github.com/user-attachments/assets/50409751-1dd7-4522-a9f3-688839b2d1a2" width="300"/>
<img alt="Image" src="https://github.com/user-attachments/assets/04288645-0a0f-43c9-8a65-71fbb0a5cdfe" width="300"/>

- **(좌)** 메인 페이지에서 현재 날씨 정보를 확인할 수 있으며, 스크롤 시 해당 지역의 일주일 예보가 표시됩니다.
- **(우)** 위치 검색을 통해 원하는 지역의 날씨를 확인할 수 있습니다. (인기 도시는 하드코딩되어 있습니다.)

# 🌟 주요 기능
- 전 세계 지역의 실시간 날씨 확인
- 기온에 따른 옷차림 추천 (월드크리닝 데이터 기반)
- 일주일간의 날씨 예보 조회

## 🌤️ 날씨 기반 의상 추천
- 실시간 날씨 데이터 기반 의상 추천
<img alt="Image" src="https://github.com/user-attachments/assets/953b2a6b-0955-4934-b5d7-bc0864d94c71" />

## 🛠️ 기술 스택 Stacks
- **HTML, CSS, JavaScript**
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
- **Data Storage**: localStorage (브라우저 로컬 저장소)
- **Weather API**: OpenWeatherMap API

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone (https://github.com/h-like/geolocation)
```

### 2. 날씨 API 키 (OpenWeatherMap) 
`script.js` 파일을 열고, 아래 부분에 **본인의 API 키**를 입력하세요.

```js
// script.js
const apiKey = "여기에_본인의_API_KEY를_입력하세요";
```

### 3. 개발 서버 실행
```
Open with Live Server
```


## 📱 사용 방법
1. **📍 버튼**: 현재 위치의 날씨와 의상 추천 정보를 확인합니다.
2. **🔍Change 버튼**: 검색을 통해 원하는 지역의 날씨를 확인합니다.

<img alt="Image" src="https://github.com/user-attachments/assets/153c929c-2993-4707-8120-1aaffb9c7685" />

- 검색창에 도시명을 입력합니다.

<img alt="Image" src="https://github.com/user-attachments/assets/4e07c7f6-aa3c-4bbd-ae6a-13de82c7dcf2" />
<img alt="Image" src="https://github.com/user-attachments/assets/76bc8f4e-587a-471d-b98f-c9deb83da976" />

- 원하는 도시를 클릭하면, 해당 지역의 오늘 날씨와 일주일 예보를 볼 수 있습니다.


### 데이터 💾
1. **최근 검색 내역**: localStorage에 저장
2. **위치 설정 관리**: [chrome](https://support.google.com/chrome/answer/142065?hl=ko&co=GENIE.Platform)


## 🌐 [배포](https://h-like.github.io/outfit-today/) 


## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 감사의 말

- [OpenWeatherMap](https://openweathermap.org/) - 날씨 데이터 제공


## 📞 문의

프로젝트에 대한 문의나 제안이 있으시면 이슈를 생성해 주세요.
