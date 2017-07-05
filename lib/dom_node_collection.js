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
