import { Handler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const hasuraProxy: Handler = createProxyMiddleware({
  target: process.env.HASURA_URL,
  changeOrigin: true,
  ws: true,
  pathRewrite: { '^/graphql': '/v1/graphql' },
  onProxyReq: function (proxyReq, req, res) {
    proxyReq.setHeader(
      'x-hasura-admin-secret',
      process.env.HASURA_GRAPHQL_ADMIN_SECRET
    );
  },
  onProxyReqWs: function (proxyReq, req, socket, opts, head) {
    proxyReq.setHeader(
      'x-hasura-admin-secret',
      process.env.HASURA_GRAPHQL_ADMIN_SECRET
    );
  },
  onError: function (err, req, res) {
    console.log('error', err);
  },
});

export default hasuraProxy;
