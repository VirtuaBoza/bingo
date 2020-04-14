const defaultHeaders = {
  'Content-Type': 'application/json',
};

export default {
  get: (url) => {
    return fetch(url, {
      headers: {
        ...defaultHeaders,
      },
    }).then((res) => {
      if (res.ok) return res.json();
      throw new Error(res);
    });
  },
  post: (url, body) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) return res.json();
      throw new Error(res);
    });
  },
  delete: (url) => {
    console.log(url);
    return fetch(url, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) return res.ok;
      throw new Error(res);
    });
  },
};
