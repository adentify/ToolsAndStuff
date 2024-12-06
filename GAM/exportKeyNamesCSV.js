// GAM - Download KeyNames as a CSV
// run on the keyname page eg; https://admanager.google.com/ACCOUNTNUMBER?pli=1#inventory/custom_targeting/list
// it parses the list of keynames, creates a csv recording name","displayName","type","varCount","reportable"
// it then downloads this as a csv file
// the name of the file is based on the pagintaion index/number eg; "GAM KeyNames - 1 - 100 of 324"
// change the page number and run the script again once the page is loaded and it will download that new page with a new filename.
// data is concatenated, ie; each file ads to the next, the last downloaded file will have all KeyNames
String.prototype.addSlashes = function() { 
   //no need to do (str+'') anymore because 'this' can only be a string
   return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
} 

function getTxt(txt){
  // format text strings to ensure it doesn;t break shit
  // trim whitespace from start/end of string, add slashes for special chars to ensure it doesn't break csv
  return txt.trim().addSlashes();
}

function  dl(){
  const blob = new Blob([payloadCSV], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  // create the output filename, this is based on the pagination data
  link.download = 'GAM KeyNames - ' + document.getElementsByTagName('pagination-bar')[0].getElementsByClassName('_ngcontent-INVENTORY-24')[9].textContent + '.csv';
  link.click();
}

//document.getElementsByClassName('particle-table-row')[1].getElementsByTagName('ess-cell')[0]

var payloadJSON = payloadJSON || [];
var payloadCSV  = payloadCSV || "name, displayName, type, varCount, reportable\n";
var rows = document.getElementsByClassName('particle-table-row');

for(var i=0; i<=rows.length-1; i++){
  //console.log("PARSING: ",rows[i]);	
  var cells = rows[i].getElementsByTagName('ess-cell');
  var outputJSON = {}; 
  var outputCSV  = ""; 
  // loop through cells
  for(var n=0; n<=cells.length-1; n++){
    //console.log("PARSING: ",n);//cells[n]);	
    // if first cell
    if(n==0){
      tmpTxt = getTxt(cells[n].querySelectorAll('A')[0].text);
      outputJSON.name = tmpTxt;
      outputCSV += tmpTxt+", ";
    }
    if(n==1){
      tmpTxt = getTxt(cells[n].querySelectorAll('text-field')[0].textContent);
      outputJSON.displayName = tmpTxt;
      outputCSV += tmpTxt+", ";
    }
    if(n==2){
      tmpTxt = getTxt(cells[n].querySelectorAll('span')[0].textContent);
      outputJSON.type = tmpTxt;
      outputCSV += tmpTxt+", ";
    }
    if(n==4){
      tmpTxt = getTxt(cells[n].querySelectorAll('text-field')[0].textContent);
      outputJSON.varCount = tmpTxt;
      outputCSV += tmpTxt+", ";
    }
    if(n==5){
      tmpTxt = getTxt(cells[n].querySelectorAll('span')[0].textContent);
      outputJSON.reportable = tmpTxt;
      outputCSV += tmpTxt+"\n";
    }
  }
  payloadJSON.push(outputJSON);
  payloadCSV += outputCSV;
}

// download the data... see notes, this conctenates the current page data
dl();

