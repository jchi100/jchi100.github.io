// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $stateInput = document.querySelector("#state");
var $searchBtn = document.querySelector("#search");
var $addRecordBtn = document.querySelector("#addnewbtn");
var $removeRecordBtn = document.querySelector("#removebtn");
var $saveRecordBtn = document.querySelector("#savenewbtn");
var hidden = document.getElementById("savenewbtn");
var $previous1 = document.querySelector("#previous1");
var $next1 = document.querySelector("#next1");
var $previous2 = document.querySelector("#previous2");
var $next2 = document.querySelector("#next2");
var $viewall1 = document.querySelector("#viewall1");
var $viewall2 = document.querySelector("#viewall2");

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);
$addRecordBtn.addEventListener("click", handleAddRecordButtonClick);
$saveRecordBtn.addEventListener("click", handleSaveRecordButtonClick);
$removeRecordBtn.addEventListener("click", handleRemoveButtonClick);


// Set filtereData to data.js initially
var filteredData = dataSet;
var dataLength =  filteredData.length;
var recordperPage = 50;
var totalPage = (dataLength%recordperPage == 0 ? dataLength/recordperPage : parseInt(dataLength/recordperPage)+1);
var currentPage = 1;


// renderTable renders the filteredAddresses to the tbody
function renderTable_viewall() {
  $tbody.innerHTML = "";
  for (var i = 0; i < filteredData.length; i++) {
    // Get get the current address object and its fields
    var ufoinfo = filteredData[i];
    var fields = Object.keys(ufoinfo);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = ufoinfo[field];
    }
  }
}

var viewRecords = 0;

function renderTable() {
  
  $tbody.innerHTML = "";
  var endofpageRecord =49;

  if (currentPage>1 && currentPage<totalPage) {
    viewRecords = (currentPage-1)*recordperPage;
    endofpageRecord =  currentPage*recordperPage-1;
  }
  else if (currentPage==totalPage)
  {
    viewRecords = (currentPage-1)*recordperPage;
    endofpageRecord = dataLength-1;
  }
  else {
    viewRecords =0;
  };


  var tbrow = 0;
  for (var i = viewRecords; i <=endofpageRecord; i++) {
    // Get get the current address object and its fields
    var ufoinfo = filteredData[i];
    var fields = Object.keys(ufoinfo);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(tbrow);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = ufoinfo[field];
      
    };
    tbrow = tbrow +1;
  }

}

function handleSearchButtonClick() {
  // Format the user's search by removing leading and trailing whitespace, lowercase the string
  var filterState = $stateInput.value.trim().toLowerCase();
  var filterListItem = document.getElementById("searchField").value;
  console.log(filterListItem);
  switch (filterListItem)
  {
  // Set filteredInfo to an array of all addresses whose "state" matches the filter
    case 'datetime':
      filteredData = dataSet.filter(function(address) {
       var addressState = address.datetime.toLowerCase();
     return addressState === filterState;
      }); 
      break;
    case 'city':
     filteredData = dataSet.filter(function(address) {
      var addressState = address.city.toLowerCase();
        return addressState === filterState;
      });
          break;
     case 'state':
        filteredData = dataSet.filter(function(address) {
         var addressState = address.state.toLowerCase();
    // If true, add the address to the filteredData, otherwise don't add it to filteredData
         return addressState === filterState;
         });
         break;  
         case 'country':
         filteredData = dataSet.filter(function(address) {
          var addressState = address.country.toLowerCase();
            return addressState === filterState;
          });
          break;
          case 'shape':
            filteredData = dataSet.filter(function(address) {
          var addressState = address.shape.toLowerCase();
            return addressState === filterState;
          });
          break;
    };
    dataLength =  filteredData.length;
    totalPage = (dataLength%recordperPage == 0 ? dataLength/recordperPage : parseInt(dataLength/recordperPage)+1);
    
  renderTable();
}

function handleAddRecordButtonClick() {

console.log("add record");
var $row = $tbody.insertRow(0);
var field = ['datetime','city','state','country','shape','durationMinutes','comments'];
var size = ['5','10','3','3','5','5','20']
var a = '';

for (var j = 0; j < 7; j++) {
  // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
 
  var $cell = $row.insertCell(j);
  a = '<input type="text"  id="'+field[j]+'" size =' + size[j] + ' value=" " >'; 
 
 
  $cell.innerHTML=a;

};

    if (hidden.style.display == "none") {
     hidden.style.display = "inline-block";
      
    }
}

function handleRemoveButtonClick() {

  console.log("remove record");
  window.alert("Under Construction");
}


function handleSaveRecordButtonClick() {

  event.preventDefault();

  var newRecord = {
    datetime: document.querySelector("#datetime").value.trim(),
    city : document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    country:document.getElementById("country").value.trim(),
    shape :document.getElementById("shape").value.trim(),
    duration:document.getElementById("durationMinutes").value.trim(),
    comments: document.querySelector("#comments").value.trim()
  };

  filteredData.push(newRecord);
  console.log("finished");
  renderTable();
  if (hidden.style.display == "inline-block") {
    hidden.style.display = "none";
     
   }
}

$previous1.addEventListener("click", function(event) {
  if (currentPage>1){
    currentPage-=1;   
}
else
{
  currentPage = 1;
}
renderTable();
});

$next1.addEventListener("click", function(event) {
  if(currentPage==totalPage){
    currentPage=totalPage;

 }
 else
 {
    currentPage+=1;
 }
 console.log(currentPage);
 renderTable();
});

$previous2.addEventListener("click", function(event) {
  
  if (currentPage>1){
      currentPage-=1;   
  }
  else
  {
    currentPage = 1;
  }
  renderTable();
});

$next2.addEventListener("click", function(event) {

  if(currentPage==totalPage){
     currentPage=totalPage;
    console.log("last page");
  }
  else
  {
     currentPage+=1;
  }
  console.log(totalPage);
  renderTable();
});

$viewall1.addEventListener("click", function(event) {
  renderTable_viewall();
 });


 $viewall2.addEventListener("click", function(event) {
  renderTable_viewall();
 });


// Render the table for the first time on page load
renderTable();
