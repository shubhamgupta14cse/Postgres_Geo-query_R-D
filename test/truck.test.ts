//Contains the test-cases
const should = require('should')

const apiEndPointHelper = require('./helper/api_endpoints.ts')
const testData = require('./helper/test_data.ts')
const validator = require('./helper/validators.ts')
const apiHelper = require('./helper/api_helper.ts')

let baseUrl = apiEndPointHelper.baseUrl;
let apiEndPoint = apiEndPointHelper.truckApiEndPoint;
let truckId = 73905;

describe('Quicargo Geo-Query R&D Trucks Api Suite', function () {
    describe('SEARCH TRUCK GET Endpoint', function () {
      const lat = testData.lat
      const lng = testData.lng
      const cargo_weight = testData.cargo_weight
      const cargo_pallets = testData.cargo_pallets


      it('Should Get validation Error', async function () {
        const missingQueryParams = apiHelper.buildQueryParam(lat, lng)
        const res = await apiHelper.sendGETRequest(baseUrl, apiEndPoint, missingQueryParams);
        console.log(res.body);
        res.status.should.equal(400);
        res.body.message.should.equal('Validation errors')
        res.body.errors.should.be.Array().and.not.be.empty()
      });
      it('Should Get Empty Truck data', async function () {
        const queryParams = apiHelper.buildQueryParam(lat, lng, 10000, cargo_pallets)
        const res = await apiHelper.sendGETRequest(baseUrl, apiEndPoint, queryParams);
        res.status.should.equal(200);
        res.body.should.be.Array().and.empty();
      });
      it('Should Get Trucks', async function () {
        const queryParams = apiHelper.buildQueryParam(lat, lng, cargo_weight, cargo_pallets)
        const res = await apiHelper.sendGETRequest(baseUrl, apiEndPoint, queryParams);
        res.status.should.equal(200);
        res.body.should.be.Array().and.not.be.empty();
        validator.dataTypeValidator(res.body[0]);
      });

    });
    describe('SEARCH TRUCK PUT Endpoint', function () {
      const lat = testData.lat
      const lng = testData.lng
      const license_no = testData.license_no
      const max_weight = testData.max_weight
      const curr_weight = testData.curr_weight
      const max_pallets = testData.max_pallets
      const curr_pallets = testData.curr_pallets


      it('Should Get validation Error', async function () {
        const invalidTruckId = truckId + 'abck'
        const res = await apiHelper.sendPUTRequest(baseUrl, apiEndPoint + invalidTruckId);
        console.log(res.body);
        res.status.should.equal(400);
        res.body.message.should.equal('Validation errors')
        res.body.errors.should.be.Array().and.not.be.empty()
      });
      it('Should Get Validation error curr_weight cannot be more than max_weight', async function () {
        const requestBody = apiHelper.buildRequestBody(license_no, lat, lng, 100, 120, max_pallets, curr_pallets )
        const res = await apiHelper.sendPUTRequest(baseUrl, apiEndPoint + truckId, requestBody);
        console.log(res.body);
        res.status.should.equal(400);
        res.body.message.should.equal('Validation error: curr_weight cannot be more than max_weight')
      });
      it('Should Get Validation error curr_pallets cannot be more than max_pallets', async function () {
        const requestBody = apiHelper.buildRequestBody(license_no, lat, lng, max_weight, curr_weight, 10, 20 )
        const res = await apiHelper.sendPUTRequest(baseUrl, apiEndPoint + truckId, requestBody);
        console.log(res.body);
        res.status.should.equal(400);
        res.body.message.should.equal('Validation error: curr_pallets cannot be more than max_pallets')
      });
      it('Should Update Truck', async function () {
        const requestBody = apiHelper.buildRequestBody(license_no, lat, lng, max_weight, curr_weight, max_pallets, curr_pallets )
        const res = await apiHelper.sendPUTRequest(baseUrl, apiEndPoint + truckId, requestBody);
        console.log(res.body);
        res.status.should.equal(200);
        validator.dataTypeValidator(res.body);
        validator.dataValidator(res, license_no, lat, lng, max_weight, curr_weight, max_pallets, curr_pallets);
      });

    });
});

function getQueryParam(lat?, lng?, cargo_weight?, cargo_pallets?) {
  return {
    lat,
    lng,
    cargo_weight,
    cargo_pallets
  }
};

function getRequestBody(license_no?, lat?, lng?, max_weight?, curr_weight?, max_pallets?, curr_pallets?) {
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
