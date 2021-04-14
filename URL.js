// packages
const axios = require('axios');


const URL = function(key = "", baseURL, dataIndex, text, value){
  if (!key.length) {
  	this.key = "";
  }else {
  	this.key = "&apikey="+key;
  }
  this.baseURL = baseURL;
  this.url;
  this.dataIndex = dataIndex;
  this.text = text;

  this.value = value;
  this.numOfResults = 10;
}


URL.prototype.compileURL = function(query){
  if (!query) return "";

  if (this.key === ""){
  	let compiledUrl = this.baseURL+query
    this.url = compiledUrl;
  }else{
    this.url = this.baseURL+query+this.key;
  }
};


URL.prototype.getAPI = function(query, getResults, updateDropdownCB){
  axios
    .get(this.url)
    .then(response => {

      let resData = response.data
      let objKey = Object.keys(resData)[this.dataIndex]
      const rows = response.data[objKey];

      const APIresults = rows.map(item => ({
        text: item[this.text],
        value: item[this.value]
      }))

      let data = APIresults;
      let results = getResults(query, data);
      results = results.slice(0, this.numOfResults); 
      updateDropdownCB(results);
    })
    .catch(error => {
     console.log(error);
    });
}

export default URL;
