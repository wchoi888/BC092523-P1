var searchBtn = document.getElementById("search-btn");
var cryptoText = document.getElementById("current-crypto");
var conversionText = document.getElementById("conversion-text");
var cryptoDiv = document.getElementById("crypto-container");
var selectField = document.getElementById("crypto");
var currencyField = document.getElementById("currency");
var currencyDiv = document.getElementById("currency-container");
var currencyText = document.getElementById("current-currency");
var cryptoUrl = "https://api.coincap.io/v2/assets";
var convertUrl = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json";

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

function loadconvertURL() {
fetch(convertUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log('Fetch Response \n Fetch Successful');
        console.log(data);

    });
}

document.addEventListener("DOMContentLoaded", (event) =>{
    loadconvertURL();
})

function pullConversion(response) {
    currencyField.innerHTML = "";
    var currencyData = response.data;

    for (var i =0; i < currencyData.length; i++) {
        var currencyOptions = document.createElement("options");
        currencyOptions.textContent=
        currencyData[i].id +
        " " +
        currency.Data[i].symbol +
        " " +
        currencyData[i].price;
        currencyOptions.value = currencyData[i].id;
        currencyFieldField.append(currencyOptions);
    }
}