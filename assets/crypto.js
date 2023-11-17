var searchBtn = document.getElementById("search-btn");
var cryptoText = document.getElementById("tile-container");
var selectField = document.getElementById("crypto");
var searchField = document.getElementById("searchCrypto");
var cryptoUrl = "https://api.coincap.io/v2/assets";
var currenciesUrl = "https://open.er-api.com/v6/latest/USD";
var cryptoData; //Declares a variable cryptoData to store cryptocurrency data fetched from the CoinCap API.
var previousSearches = JSON.parse(localStorage.getItem("cryptoSearches")) || [];
var currentCryptoContainer = document.querySelector(".currentCrypto-container");


//DYNAMIC HTML ELEMENTS
//Insert status code and append main element
var warningPopUp =
  " <div class='notification is-danger'><button class='delete'></button>Error: (Insert Status Code)</div>";
//Insert conversion api data and append the conversion-text container
var conversionTile =
  "<div class='tile'><h3>(Insert Global Curerncy Name)</h3><p>Price: (Insert Converted Price)</p><p>Market Cap: (Insert Converted Market Cap)</p></div>";

//Defines a function displayCrypto that takes an fiat currencies API response and a selected cryptocurrency as parameters. This function is responsible for converting and displaying details of the selected cryptocurrency.

function displayCrypto(response, crypto) {
  var cryptoCurrenciesData = response.rates;
  var cryptoValues = crypto.split(", ");
  var cryptoId = cryptoValues[0];
  var cryptoSymbol = cryptoValues[1];
  //this line of code is searching for the index of an element in the cryptoData array where the id property matches the value of cryptoId. The result is stored in the variable index.
  var index = cryptoData.findIndex(function (item) {
    return item.id === cryptoId;
  });
  var cryptoRank = cryptoData[index].rank;
  var cryptoUsd = cryptoData[index].priceUsd;
  var cryptoSupply = cryptoData[index].supply;
  var cryptoMktCapUsd = cryptoData[index].marketCapUsd;
  cryptoText.textContent = "";
  currentCryptoContainer.textContent = "";
  var currenciesDiv = document.createElement("h3");
  currenciesDiv.className = "is-size-6"
  currenciesDiv.textContent =
    cryptoId + " " + "(" + cryptoSymbol + ")" + " " + "#" + cryptoRank;
  currentCryptoContainer.append(currenciesDiv);
  var usdDiv = document.createElement("p");
  usdDiv.innerHTML = "$" + cryptoUsd;
  usdDiv.className = "is-size-6"
  currentCryptoContainer.append(usdDiv);
  var supplyDiv = document.createElement("p");
  supplyDiv.innerHTML = "supply: " + cryptoSupply;
  supplyDiv.className = "is-size-6"
  currentCryptoContainer.append(supplyDiv);
  var marketCapDiv = document.createElement("p");
  marketCapDiv.className = "is-size-6"
  marketCapDiv.innerHTML = "marketcap: " + cryptoMktCapUsd;
  currentCryptoContainer.append(marketCapDiv);
  var eurContainer = document.createElement("div");
  cryptoText.append(eurContainer);
  var eurTitle = document.createElement("h3");
  eurTitle.textContent = "Euro";
  eurTitle.className = "has-text-success"
  eurContainer.append(eurTitle);
  var eurDiv = document.createElement("p");
  eurDiv.innerHTML = "Price: &euro;" + cryptoCurrenciesData.EUR * cryptoUsd;
  eurDiv.className = "has-text-link"	
  eurContainer.append(eurDiv);
  var eurmktCapDiv = document.createElement("p");
  eurmktCapDiv.className = "has-text-info"
  eurmktCapDiv.innerHTML =
    "MarketCap: &euro;" + cryptoCurrenciesData.EUR * cryptoMktCapUsd;
  eurContainer.append(eurmktCapDiv);

  var yenContainer = document.createElement("div");
  cryptoText.append(yenContainer);
  var yenTitle = document.createElement("h3");
  yenTitle.textContent = "Yen";
  yenTitle.className = "has-text-success"
  yenContainer.append(yenTitle);
  var yenDiv = document.createElement("p");

  yenDiv.innerHTML = "Price: &yen" + cryptoCurrenciesData.JPY * cryptoUsd;
  yenDiv.className = "has-text-link"	
  yenContainer.append(yenDiv);
  var yenmktCapDiv = document.createElement("p");
  yenmktCapDiv.className = "has-text-info"
  yenmktCapDiv.innerHTML =
    "MarketCap: &yen" + cryptoCurrenciesData.JPY * cryptoMktCapUsd;
  yenContainer.append(yenmktCapDiv);

  var gbpContainer = document.createElement("div");
  cryptoText.append(gbpContainer);
  var gbpTitle = document.createElement("h3");
  gbpTitle.textContent = "Pound";
  gbpTitle.className = "has-text-success"
  gbpContainer.append(gbpTitle);
  var gbpDiv = document.createElement("p");
  gbpDiv.innerHTML = "Price: &pound" + cryptoCurrenciesData.GBP * cryptoUsd;
  gbpDiv.className = "has-text-link"
  gbpContainer.append(gbpDiv);
  var gbpmktCapDiv = document.createElement("p");
  gbpmktCapDiv.className = "has-text-info"
  gbpmktCapDiv.innerHTML =
    "MarketCap: &pound" + cryptoCurrenciesData.GBP * cryptoMktCapUsd;
  gbpContainer.append(gbpmktCapDiv);

  var inrContainer = document.createElement("div");
  cryptoText.append(inrContainer);
  var inrTitle = document.createElement("h3");
  inrTitle.textContent = "Rupee";
  inrTitle.className = "has-text-success"
  inrContainer.append(inrTitle);
  var inrDiv = document.createElement("p");
  inrDiv.innerHTML = "Price: &#8377;" + cryptoCurrenciesData.INR * cryptoUsd;
  inrDiv.className = "has-text-link"	
  inrContainer.append(inrDiv);
  var inrmktCapDiv = document.createElement("p");
  inrmktCapDiv.className = "has-text-info"
  inrmktCapDiv.innerHTML =
    "MarketCap: &#8377;" + cryptoCurrenciesData.INR * cryptoMktCapUsd;
  inrContainer.append(inrmktCapDiv);

  saveSearch(crypto);
}
function saveSearch(searchTerm) {
  previousSearches.push(searchTerm);
  localStorage.setItem("cryptoSearches", JSON.stringify(previousSearches));
  displayPreviousSearches();
}

function displayPreviousSearches() {
  previousSearchesContainer.innerHTML = "";
  var ul = document.createElement("ul");
  previousSearches.forEach(function (searchTerm) {
    var li = document.createElement("li");
    li.textContent = searchTerm;
    ul.appendChild(li);
  });
  previousSearchesContainer.appendChild(ul);
}

//Defines a function loadCryptoUrl responsible for fetching cryptocurrency data from the CoinCap API.

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
          // Handle error message if needed
        });
      }
    });
}

//Defines a function loadFiatCurrencies responsible for fetching fiat currency data from the ExchangeRate-API and calling the displayCrypto function.

function loadFiatCurrencies() {
  var crypto = selectField.value;
  fetch(currenciesUrl, {
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
      displayCrypto(response, crypto);
    })
    .catch(function (errorResponse) {
      if (errorResponse.text) {
        errorResponse.text().then(function (errorMessage) {
          // Handle error message if needed
        });
      }
    });
}

function searchCurrencies() {
  var searchValue = searchField.value.trim();
  if (searchValue === "") {
    console.error("Search field is empty");
    return;
  }
  var index = cryptoData.findIndex(function (item) {
    return item.id === searchValue;
  });

  if (index < 0) {
    index = cryptoData.findIndex(function (item) {
      return item.symbol === searchValue;
    });
  }

  if (index < 0) {
    console.error("Cryptocurrency not found:", searchValue);
    return;
  }
  selectField.value = cryptoData[index].id + ", " + cryptoData[index].symbol;
  loadFiatCurrencies();
}
//Defines a function for processing the fetched cryptocurrency data and populating the dropdown menu with options.

function processData(response) {
  // selectField.innerHTML = "";
  cryptoData = response.data;

  for (var i = 0; i < cryptoData.length; i++) {
    var optionValue = cryptoData[i].id + ", " + cryptoData[i].symbol;

    var cryptoOptions = document.createElement("option");
    cryptoOptions.textContent = optionValue;

    selectField.append(cryptoOptions);
  }
  loadFiatCurrencies();
}
//Defines a function that searches for a cryptocurrency based on the input in the search field.
function searchCurrencies() {
  var searchValue = searchField.value.trim();

  if (searchValue === "") {
      console.error("Search field is empty");
      return;
    }

  var index = cryptoData.findIndex(function (item) {
    return item.id === searchField.value;
  });

  if (index < 0) {
    index = cryptoData.findIndex(function (item) {
      return item.symbol === searchField.value;
    });
  }
  if (index < 0) {
    console.error("Cryptocurrency not found:", searchValue);
    return;
  }
  selectField.value = cryptoData[index].id + ", " + cryptoData[index].symbol;
  loadFiatCurrencies();
}
//Listens for a change in the selected value of the dropdown menu and triggers the loadFiatCurrencies function.
selectField.addEventListener("change", loadFiatCurrencies);
//Listens for a click on the search button and triggers the searchCurrencies function.
searchBtn.addEventListener("click", searchCurrencies);
searchField.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    searchCurrencies();
  }
});




