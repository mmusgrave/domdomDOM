/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(array) {
    this.HTMLelements = array;
    // return this;
  }

  html(string){
    if (string){
      this.HTMLelements.map( (el) => {
        el.innerHTML = string;
      });
    } else {
      return this.HTMLelements[0].innerHTML;
    }
  }

  empty(){
    this.HTMLelements.map( (el) => {
      el.innerHTML = "";
    });
  }

  append(item){
    if (item instanceof HTMLElement) {
      this.HTMLelements.map( (el) => {
        el.innerHTML += item.outerHTML;
      });
    } else if (item instanceof DOMNodeCollection){
      item.HTMLelements.map( (newItem) => {
        this.HTMLelements.map( (appendee) => {
          appendee.innerHTML += newItem.outerHTML;
        });
      });
    } else {
      this.HTMLelements.map( (el) => {
        el.innerHTML += item;
      });
    }
  }

  attr(attribute, value){
    if (arguments.length > 1) {
      for (let i = 0; i < this.HTMLelements.length; i++) {
        this.HTMLelements[i].setAttribute(attribute, value);
      }
    } else {
      for (let i = 0; i < this.HTMLelements.length; i++) {
        let attrValue = this.HTMLelements[i].getAttribute(attribute);
        if (attrValue) {
          return this.HTMLelements[i];
        }
      }
    }
    return this;
  }

  addClass(className){
    this.HTMLelements.forEach((el) =>{
      let classString = el.getAttribute("class");
      if (classString){
        classString += " " + className;
      } else {
        classString = className;
      }
      el.setAttribute("class", classString);
    });
    return this;
  }

  removeClass(className){
    if (className) {
      console.log("classname not null");
      this.HTMLelements.forEach( (el) => {
        let classArray = el.getAttribute("class");
        if (classArray) {
          classArray = classArray.split(" ");
          let result = [];
          classArray.forEach( (classVal) => {
            if (classVal !== className){
              result.push(classVal);
            }
          });
          el.setAttribute("class", result.join(" "));
        }
      });
    } else {
      this.HTMLelements.forEach( (el) =>{
        el.removeAttribute('class');
      });
    }
  }

  children(){
    let result = [];
    let elChildren = [];
    this.HTMLelements.forEach( (el) => {
      elChildren = el.children;
      elChildren = Array.prototype.slice.call(elChildren);
      result = result.concat(elChildren);
    });
    return new DOMNodeCollection(result);
  }

  parent(){
    let result = [];
    this.HTMLelements.forEach( (el) => {
      result.push(el.parentElement);
    });
    return new DOMNodeCollection(result);
  }

  find(selector){
    let foundNodes = [];
    let queryResult = [];
    this.HTMLelements.forEach( (el) => {
      queryResult = Array.prototype.slice.call(el.querySelectorAll(selector));
      foundNodes = foundNodes.concat(queryResult);
    });
    return new DOMNodeCollection(foundNodes);
  }


  remove(){
    this.HTMLelements.forEach( (el) => {
      el.remove();
    });
  }
  
  on(type, callback){
    this.HTMLelements.forEach( (el) => {
      el.callback = callback;
      el.addEventListener(type, callback);
    });
  }

  off(type){
    this.HTMLelements.forEach( (el) => {
      el.removeEventListener(type, el.callback);
    });
  }


}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);