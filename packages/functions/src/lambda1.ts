const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { Sha256 } = require("@aws-crypto/sha256-js");
import axios from "axios";
import { defaultProvider } from "@aws-sdk/credential-provider-node";



console.log("ENV", process.env);

const apiUrl = `${process.env.API_URL}/test2`;

const signer = new SignatureV4({
  credentials: defaultProvider(), //NOT WORKING
  // credentials: defaultProvider({profile: "default"}),
  sha256: Sha256,
  region: "eu-west-1",
  service: "execute-api",
});

async function get(apiUrl) {
  const parsedUrl = new URL(apiUrl);
  const endpoint = parsedUrl.hostname.toString();
  const path = parsedUrl.pathname.toString();
  const req = new HttpRequest({
    hostname: endpoint,
    path,
    method: "GET",
    headers: {
      host: endpoint,
      "Content-Type": "application/json",
    },
  });
  const signed = await signer.sign(req, { signingDate: new Date() });
  return axios.get(apiUrl, { headers: signed.headers });
}

export async function handler() {
  console.log("url", apiUrl);
  const {data} = await get(apiUrl);
  console.log("response", data);
  return {
    statusCode: 200,
    body: "hello world from lambda1",
  };
}