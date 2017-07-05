const DOMNodeCollection = require('./dom_node_collection.js');

const funcArray = [];
var documentIsReady = false;

function $l(selector){

  switch(typeof(selector)){
    case "string":
      var selectedNodes = document.querySelectorAll(selector);
      var selectedArray = Array.prototype.slice.call(selectedNodes);
      let collection = new DOMNodeCollection(selectedArray);
      return  collection;
    case "function":
      return registerCallback(selector);
    case "object":
      if(selector instanceof HTMLElement){
        var HTMLArray = [selector];
        let HTMLcollection = new DOMNodeCollection(HTMLArray);
        return  HTMLcollection;
      }
  }
}

window.$l = $l;

// document.addEventListener("DOMContentLoaded", () => {
//   funcArray.forEach( (fn)=> {
//     fn();
// });

registerCallback = fn => {
  if(!documentIsReady){
    funcArray.push(fn);
  } else {
    fn();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  documentIsReady = true;
  funcArray.forEach( fn => {
    fn()
  });
});



$l.extend = function(target, ...args){
// $l.extend = (target, ...args) => {
  args.forEach( (obj) => {
    for (let property in obj) {
      target[property] = obj[property];
    }
  });
  return target;
};



$l.ajax = function(options){
// $l.ajax = (options) => {
  const defaults = {
    success: () => {}, error: () => {}, url: "", method: "GET", data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  var ajaxOptions = $l.extend(defaults, options);
  ajaxOptions.method = ajaxOptions.method.toUpperCase();

  if (ajaxOptions.method === 'GET'){
    ajaxOptions.url += '?';
    ajaxOptions.url += createQuery(ajaxOptions.data);
  }
  const httpRequest = new XMLHttpRequest();
  httpRequest.open(ajaxOptions.method, ajaxOptions.url);

  httpRequest.onload = () => {
    if (httpRequest.status === 200) {
      ajaxOptions.success(httpRequest.response);
    } else {
      ajaxOptions.error(httpRequest.response);
    }
  };

  httpRequest.send(JSON.stringify(ajaxOptions.data));
}

createQuery = (data) => {
  let query = '';
  for(let property in data){
    if (data.hasOwnProperty(property)){
      query += property + '='
      query += data[property] + '&';
    }
  }
  query = query.slice(0, query.length -1);
  return query;
};
