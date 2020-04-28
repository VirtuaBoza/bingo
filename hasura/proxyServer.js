require('dotenv').config();
const proxy = require('express-http-proxy');
const app = require('express')();

app.use(
  proxy(process.env.HASURA_URL, {
    proxyReqPathResolver(req) {
      return new Promise(function (resolve, reject) {
        const parts = req.url.split('?');
        const queryString = parts[1];
        const updatedPath = parts[0] + '/v1/graphql';
        const resolvedPathValue =
          updatedPath + (queryString ? '?' + queryString : '');
        resolve(resolvedPathValue);
      });
    },
    proxyReqOptDecorator(opts) {
      return new Promise((resolve) => {
        opts.headers = {
          ...opts.headers,
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        };
        resolve(opts);
      });
    },
  })
);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
