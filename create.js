import { KJUR } from "jsrsasign";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  try {
    console.log(event.requestContext.identity.cognitoIdentityId);
    const signature = generateInstantToken(process.env.SDK_KEY, process.env.SDK_SECRET, data.topic, data.password);

    return {
      statusCode: 200,
      body: JSON.stringify(signature),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}

function generateInstantToken(sdkKey, sdkSecret, topic, password = "") {
  let signature = "";
  // try {
  const iat = Math.round(new Date().getTime() / 1000);
  const exp = iat + 60 * 60 * 2;

  // Header
  const oHeader = { alg: "HS256", typ: "JWT" };
  // Payload
  const oPayload = {
    app_key: sdkKey,
    iat,
    exp,
    tpc: topic,
    pwd: password,
  };
  // Sign JWT
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  return signature;
}