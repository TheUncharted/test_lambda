

export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: {
    // allowCredentials: true,
    allowHeaders: ["content-type", "authorization", "x-amz-security-token", "x-amz-date", "x-amz-content-sha256"],
    allowMethods: ["*"],
    allowOrigins: ["*"],
  
  },
});

api.route("GET /test", {
  handler: "./packages/functions/src/lambda1.handler",
  environment: {
    API_URL: api.url,
  },
});

api.route("GET /test2", {
  handler: "./packages/functions/src/lambda2.handler",
  environment: {
    API_URL: api.url,
  },
  },
  { auth: { iam: true } }
);

export const outputs = {
  apiUrl: api.url,
};
