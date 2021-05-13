const supertest = require('supertest')
const { Server } = require('../../src/server.ts')

exports.sendGETRequest = async (baseUrl, apiEndPoint, queryParam) => {
  try {
    let res = await supertest(baseUrl).get(apiEndPoint).retry(2)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .query(queryParam);
    return res;
  } catch (err) {
    console.log('Error in sending GET Request: ', err);
  }
};
exports.sendPUTRequest = async (baseUrl, apiEndPoint, requestBody) => {
  try {
    let res = await supertest(baseUrl).put(apiEndPoint).retry(2)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(requestBody);
    return res;
  } catch (err) {
    console.log('Error in sending PUT Request: ', err);
  }
};

exports.buildQueryParam = (lat?, lng?, cargo_weight?, cargo_pallets?) => {
  return {
    lat,
    lng,
    cargo_weight,
    cargo_pallets
  }
};

exports.buildRequestBody = (license_no?, lat?, lng?, max_weight?, curr_weight?, max_pallets?, curr_pallets?) => {
  return {
    license_no,
    lat,
    lng,
    max_weight,
    curr_weight,
    max_pallets,
    curr_pallets
  }
};
