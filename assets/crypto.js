//DOM elements
var searchBtn = document.getElementById("search-btn");
var cryptoText = document.getElementById("tile-container");
var selectField = document.getElementById("crypto");
var searchField = document.getElementById("searchCrypto");
var currentCryptoContainer = document.querySelector(".currentCrypto-container");

//API urls
var cryptoUrl = "https://api.coincap.io/v2/assets";
var currenciesUrl = "https://open.er-api.com/v6/latest/USD";


//Declares a variable cryptoData to store cryptocurrency data fetched from the CoinCap API.
var cryptoData; 

var previousSearches = JSON.parse(localStorage.getItem("cryptoSearches")) || [];

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

  var index = cryptoData.findIndex(function (item) {
    return item.id === cryptoId;
  });
  
  //Main display
  var cryptoName = cryptoData[index].name;
  var cryptoUsd = parseFloat(cryptoData[index].priceUsd).toLocaleString(undefined, {
    minimumFractionDigits: 2,maximumFractionDigits: 2,
  });
  var cryptoSupply = Math.round(cryptoData[index].supply);
  var cryptoMktCapUsd = parseFloat(cryptoData[index].marketCapUsd).toLocaleString(undefined, {
    minimumFractionDigits: 2,maximumFractionDigits: 2,
  });
  var cryptoRank = cryptoData[index].rank;

  cryptoText.textContent = "";
  currentCryptoContainer.textContent = "";

  var currentCryptoEl = "<h1>"+cryptoName+ " ("+cryptoSymbol+") #"+cryptoRank+"</h1><p>Price: $"+cryptoUsd+"</p><p>Supply: "+cryptoSupply.toLocaleString()+"</p><p>Market Cap: $"+cryptoMktCapUsd.toLocaleString()+"</p>";
  var marketCapBar = '<progress class="progress is-primary" value="'+cryptoMktCapUsd+'" max="1300000000000"></progress>';
  currentCryptoContainer.innerHTML = currentCryptoEl;


  //Conversion Display
  var conversions = ["EUR","JPY","GBP","INR"];
  var conversionNames = ["Euro","Yen","Pound","Rupee"];
  var conversionSigns = ["&euro;","&yen","&pound","&#8377;"];
  

  for(var i = 0; i < conversions.length; i++) {
    var fiatSymbol = conversions[i];
    var conversionPrice = parseFloat(cryptoCurrenciesData[fiatSymbol] * cryptoData[index].priceUsd).toLocaleString(undefined, {
      minimumFractionDigits: 2,maximumFractionDigits: 2,
    });
    var conversionMarketCap = parseFloat(cryptoCurrenciesData[fiatSymbol] * cryptoData[index].marketCapUsd).toLocaleString(undefined, {
      minimumFractionDigits: 2,maximumFractionDigits: 2,
    });
    
    var fiatSign = conversionSigns[i];
    var fiatName = conversionNames[i];

    var conversionTile = "<div class='fiatCard column'> <h3>"+fiatName+" </h3> <p> Price: "+fiatSign+conversionPrice+"</p> <p>Market Cap: "+fiatSign+conversionMarketCap+"</p> </div>";
    
    $(cryptoText).append(conversionTile);
    }

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
      }
    });
}

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
        });
      }
    });
}

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

function searchCurrencies() {
  var searchValue = searchField.value.trim();

  

  if (searchValue === "") {
      displayWarning("Search field is empty");
      return;
    }

  var index = cryptoData.findIndex(function (item) {
    return item.id === searchField.value.toLowerCase();
  });

  if (index < 0) {
    index = cryptoData.findIndex(function (item) {
      return item.symbol === searchField.value.toUpperCase();
    });
  }
  if (index < 0) {
    displayWarning("Cryptocurrency not found: " + searchValue);
    return;
  }
  selectField.value = cryptoData[index].id + ", " + cryptoData[index].symbol;
  loadFiatCurrencies();
}

selectField.addEventListener("change", loadFiatCurrencies);
searchBtn.addEventListener("click", searchCurrencies);
searchField.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    searchCurrencies();
  }
});

//displays error message
function displayWarning(message) {

  var warningPopUp =
  " <div class='notification is-danger'><button class='delete'></button>"+message+"</div>";

  $('body').append(warningPopUp);

  $('.delete').click(function () {
    $('.notification').remove();
  })
  

}

