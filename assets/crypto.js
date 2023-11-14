var searchBtn = document.getElementById("search-btn");
var cryptoText = document.getElementById("current-crypto");
var conversionText = document.getElementById("conversion-text");
var cryptoDiv = document.getElementById("crypto-container");
var selectField = document.getElementById("crypto");
var cryptoUrl = "https://api.coincap.io/v2/assets";

//dynamic html elements

var warningPopUp = " <div class='notification is-danger'><button class='delete'></button>Error: (Insert Status Code)</div>"

function loadCryptoUrl() {
  fetch(cryptoUrl, {
    method: "GET",
    headers: {},
  })
    .then(function (response) {
      if (!response.ok) {
        throw response;
      }

      return response.json();
    })
    .then(function (response) {
      processData(response);
    })
    .catch(function (errorResponse) {
      if (errorResponse.text) {
        errorResponse.text().then(function (errorMessage) {
         
        });
      } else {
      }
    });
}

function processData(response) {
  selectField.innerHTML = "";
  var cryptoData = response.data;

  for (var i = 0; i < cryptoData.length; i++) {
    var cryptoOptions = document.createElement("option");
    cryptoOptions.textContent =
      cryptoData[i].id +
      " " +
      cryptoData[i].symbol +
      ", " +
      cryptoData[i].priceUsd;
    cryptoOptions.value = cryptoData[i].id;
    selectField.append(cryptoOptions);
  }
}