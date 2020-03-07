export default {
  post: (url, body) => {
    return fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(res => {
      if (res.ok) return res.json();
      throw new Error(res);
    });
  },
};
