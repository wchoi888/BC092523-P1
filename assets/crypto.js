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
  var cryptoMax = Math.round(cryptoData[index].maxSupply);

  cryptoText.textContent = "";
  currentCryptoContainer.textContent = "";
  $('.conversion-title').remove();

  var currentCryptoEl = "<h1 style='font-weight:bolder; font-size:22px;'>"+cryptoName+ " ("+cryptoSymbol+") #"+cryptoRank+"</h1><p>Price: $"+cryptoUsd+"</p><p>Market Cap: $"+cryptoMktCapUsd+"</p><p id='supplyP'>Supply: "+cryptoSupply.toLocaleString()+"</p>";
  var supplyBar = '<div class ="progress-container"><p style="font-weight:bolder; ">Supply Bar</p><progress class="progress is-primary" value="'+cryptoSupply+'" max="'+cryptoMax+'"></progress></div>';
  currentCryptoContainer.innerHTML = currentCryptoEl;
  
  if (cryptoMax == 0 || cryptoSupply == cryptoMax || cryptoMax == null) {
   
  } else {
  $(currentCryptoContainer).append(supplyBar);
  $('#supplyP').remove();
  var progressBar = document.querySelector('.progress-container');

  progressBar.addEventListener('mouseenter', function () {
    // Show a modal when hovering over the progress bar
    var modalHTML = '<div id="popup-container"><p>Supply: '+cryptoSupply.toLocaleString()+'</p><p>Max Supply: '+cryptoMax.toLocaleString()+'</p></div>';
    $(".progress-container").append( modalHTML);
  });

  progressBar.addEventListener('mouseleave', function ()  {
    // Remove the modal when mouse leaves the progress bar
    var modal = document.querySelector('#popup-container');
    if (modal) {
      modal.remove();
    }
  });
  }


  //Conversion Display
 
  var convertedTitleEL ='<h2 class="conversion-title" style= "font-style:italic; margin-bottom:8px;">Cryptocurrency Conversion against 4 Major Fiat Currencies</h2>';
  $('.conversion-container').prepend(convertedTitleEL);

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

    var conversionTile = "<div class='fiatCard column'> <h3 style = 'font-weight:bolder; text-align:center; font-size:50px;'>"+fiatName+" </h3> <p> Price: "+fiatSign+conversionPrice+"</p> <p>Market Cap: "+fiatSign+conversionMarketCap+"</p> </div>";
    
    $(cryptoText).append(conversionTile);
    }

  addToLocal(crypto);
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

function loadFiatCurrencies(crypto) {
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
  cryptoData = response.data;
  for (var i = 0; i < cryptoData.length; i++) {
    var optionValue = cryptoData[i].id + ", " + cryptoData[i].symbol;

    var cryptoOptions = document.createElement("option");
    cryptoOptions.textContent = optionValue;

    selectField.append(cryptoOptions);
  }
 
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
  var crypto = selectField.value;
  loadFiatCurrencies(crypto);
}

selectField.addEventListener("change", function () {
  var selectedCrypto = selectField.value;
  loadFiatCurrencies(selectedCrypto)
});
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

//fetchs local storage buttons when page loads
$( document ).ready(function() {
  var local = Object.keys(localStorage);
   for (var i = 0; i < local.length; i++) {
    var key = localStorage.getItem(local[i]);
    //ADD IF STATEMENT?
      $('.storedCrypto-container').append(key);
    
   }
}); 

//adds the searched crypto to local storage to access it again
var addToLocal = function (storedCrypto) {
  if (matchCrypto(storedCrypto)) {
  } else {
    localStorage.setItem(storedCrypto, '<button class="button is-primary is-light is-small">'+storedCrypto+'</button>');
    $('.storedCrypto-container').append('<button class="button is-primary is-light is-small">'+storedCrypto+'</button>');
  }
}

//checks if the searched crypto matches any existing cryptos in local storage before posting
var matchCrypto = function(storedCrypto) {
  var divArray = $('.button');
  var cryptoFound = false;

  divArray.each(function() {
    var divText = $(this).text(); 
    if (divText.toLowerCase() === storedCrypto.toLowerCase()) {
      cryptoFound = true;
      return false 
    } 
});

  return cryptoFound;
}

  //Local Storage button click event
  $('.storedCrypto-container').on('click','button',function () {
    var crypto = $(this).text();
    loadFiatCurrencies(crypto);
  })

  //Clear Storage button click event
  $('#clear-btn').click(function() {
    localStorage.clear()
    $('.storedCrypto-container').html("");
  })

