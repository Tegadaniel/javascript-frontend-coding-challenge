
import URL from './URL'

const Autocomplete = function(rootEl, options = {}){
  this.numOfResults = 10;
  this.rootEl = rootEl;
  options = Object.assign({ data: [] }, options);
  Object.assign(this, { options });
  this.init();
  this.url = new URL ("", "https://api.github.com/search/users?q=", 2, "login", "id");
  console.log(this.url);
};


Autocomplete.prototype.onQueryChange = function(query){

  if (!this.options.data.length){    
    this.url.compileURL(query);
    this.url.getAPI(query, this.getResults.bind(this), this.updateDropdown.bind(this))

  }else{
    let results = this.getResults(query, this.options.data);
    results = results.slice(0, this.numOfResults);
    this.updateDropdown(results);
  }
};

Autocomplete.prototype.getResults = function(query, data){
  if (!query) return [];
  let results = data.filter((item) => {
    return item.text.toLowerCase().includes(query.toLowerCase());
  });
  return results;
}


Autocomplete.prototype.updateDropdown = function(results){
  this.listEl.innerHTML = '';
  this.listEl.appendChild(this.createResultsEl(results));
}

Autocomplete.prototype.createResultsEl = function(results){
  const fragment = document.createDocumentFragment();
  results.forEach((result) => {
    const el = document.createElement('li');
    Object.assign(el, {
      className: 'result',
      textContent: result.text,
    });
    el.setAttribute('data-number', results.indexOf(result));
    el.addEventListener('click', (event) => {
      const { onSelect } = this.options;
      console.log(onSelect);
      this.el = this.createQueryInputEl().value;
      console.log(this.createQueryInputEl().value)
      if (typeof onSelect === 'function') onSelect(result.value);
    });
    fragment.appendChild(el);
  });
  return fragment;
  
}

Autocomplete.prototype.createQueryInputEl = function(){
  const inputEl = document.createElement('input');
  Object.assign(inputEl, {
    type: 'search',
    name: 'query',
    autocomplete: 'off',
  });
  inputEl.addEventListener('input', event =>
    this.onQueryChange(event.target.value));
  return inputEl;
}

Autocomplete.prototype.init = function(){
  this.inputEl = this.createQueryInputEl();
  this.rootEl.appendChild(this.inputEl)
  this.listEl = document.createElement('ul');
  Object.assign(this.listEl, { className: 'results' });
  this.rootEl.appendChild(this.listEl);
}

export default Autocomplete;