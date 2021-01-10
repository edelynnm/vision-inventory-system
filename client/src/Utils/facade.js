const fetch = (param, headers, authToken = false, callback, body = null) => {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.error(`${xhr.status}: ${xhr.statusText}`);
    } else {
      const jsonData = JSON.parse(xhr.responseText);
      callback(jsonData);
    }
  };

  xhr.onerror = function () {
    alert("Request Failed");
  };

  xhr.open(param.method, param.url, true);
  if (authToken) {
    xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
  }

  if (headers !== undefined) {
    for (const [header, value] of Object.entries(headers)) {
      xhr.setRequestHeader(header, value);
    }
  }
  
  xhr.send(body);
};

// HTTP METHODS

const GET = ({ url, headers, authToken, callback }) => {
  return fetch({ method: "GET", url }, headers, authToken, callback);
};

const DELETE = ({ url, headers, authToken, callback }) => {
  return fetch({ method: "DELETE", url }, headers, authToken, callback);
};

const POST = ({ url, headers, authToken, callback, body }) => {
  return fetch({ method: "POST", url }, headers, authToken, callback, JSON.stringify(body));
};

const PATCH = ({ url, headers, authToken, callback, body }) => {
  return fetch({ method: "PATCH", url }, headers, authToken, callback, JSON.stringify(body));
};

const ajax = {
  GET,
  POST,
  PATCH,
  DELETE
};

export default ajax;