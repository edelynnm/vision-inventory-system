const fetch = (param, callback, mimeType, body = null) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const body = JSON.parse(xhr.responseText);
        callback(body);
      } else {
        console.error(xhr.statusText);
      }
    }
  };

  xhr.open(param.method, param.url, true);
  if (["POST", "PUT", "PATCH"].includes(param.method)) {
    xhr.setRequestHeader("Content-Type", mimeType);
  }
  xhr.send(JSON.stringify(body));
};

const GET = (url) => (callback) => {
  const param = { method: "GET", url };
  return fetch(param, callback);
};

const POST = (url, mimeType, body) => (callback) => {
  const param = { method: "POST", url };
  return fetch(param, callback, mimeType, body);
};

const ajax = {
  GET,
  POST
}

export default ajax;