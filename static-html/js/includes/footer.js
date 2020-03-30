const addText = (parent, childText) => {
  parent.appendChild(document.createTextNode(childText));
};

const clear = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const addChildSvgElement = (parent, childType, attributes) => {
  const child = document.createElementNS('http://www.w3.org/2000/svg', childType);
  parent.appendChild(child);
  addAttributes(child, attributes);
  return child;
};

const get = (elt, name) => {
  return elt.getAttribute(name);
};

const set = (elt, name, value) => {
  elt.setAttribute(name, value);
};

const addAttributes = (child, attributes) => {
  if (attributes) {
    Object.keys(attributes).forEach((attibute) => {
      const value = attributes[attibute];
      set(child, attibute, value);
    });
  }
};

const addChildElement = (parent, childType, attributes) => {
  // console.log('addChildElement', parent, childType, attributes);
  const child = document.createElement(childType);
  parent.appendChild(child);
  addAttributes(child, attributes);
  return child;
};

const displayErrorMessage = (message) => {
  const errorMessageElt = document.querySelector('#errorMessage');
  if ((message == undefined) || (message.length == 0)) {
    errorMessageElt.innerText = '';
  } else {
    errorMessageElt.innerText = message;
  }
};
