const fetch = (param, callback, setHeader = () => null, body = null) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        callback(jsonData);
      } else {
        console.error(xhr.statusText);
      }
    }
  };

  xhr.open(param.method, param.url, true);
  setHeader(xhr);
  xhr.send(JSON.stringify(body));
};


const setHeader = (httpHeader) => (xhr) => {
  xhr.setRequestHeader(httpHeader.header, httpHeader.type);
}

// TEMPLATE Methods
const postMethods = ({url, httpHeader, body, callback}, method) => {
  const param = { method, url };
  return fetch(param, callback, setHeader(httpHeader), body);
};

// HTTP METHODS

const GET = ({url, callback}) => {
  const param = { method: "GET", url };
  return fetch(param, callback);
};

const POST = ({url, httpHeader, body, callback}) => {
  return postMethods({url, httpHeader, body, callback}, "POST")
};

const ajax = {
  GET,
  POST
}

export default ajax;