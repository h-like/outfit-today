const http = new XMLHttpRequest()
let result = document.querySelector("#result")

document.querySelector("#share").addEventListener("click", () => {
  findMyCoordinates()
})

function findMyCoordinates() {

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
      //  console.log(position.coords.latitude, position.coords.longitude)
      const bdcApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
      getApi(bdcApi)

    },
    (err) => { 
      alert(err.message)
    })
  } else {
    alert("Geolocation is not supported by your browser")
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