const defaultHeaders = {
  'Content-Type': 'application/json',
};

export default {
  get: (url: string) => {
    return fetch(url, {
      headers: {
        ...defaultHeaders,
      },
    }).then((res) => {
      if (res.ok) return res.json();
      throw new Error(res as any);
    });
  },
  post: (url: string, body: any) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) return res.json();
      throw new Error(res as any);
    });
  },
  delete: (url: string) => {
    return fetch(url, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) return res.ok;
      throw new Error(res as any);
    });
  },
};
