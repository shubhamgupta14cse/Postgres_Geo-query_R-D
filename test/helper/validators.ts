//Contains functions to validate the api details

exports.dataTypeValidator = function (truck) {
  truck.should.have.property('id').which.is.a.String();
  truck.should.have.property('license_no').which.is.a.String();
  truck.should.have.property('lat').which.is.a.Number();
  truck.should.have.property('lng').which.is.a.Number();
  truck.should.have.property('max_weight').which.is.a.Number();
  truck.should.have.property('curr_weight').which.is.a.Number();
  truck.should.have.property('max_pallets').which.is.a.Number()
  truck.should.have.property('curr_pallets').which.is.a.Number();
};
exports.dataValidator = function (res, license_no, lat, lng, max_weight, curr_weight, max_pallets, curr_pallets) {
  const truck = res.body
  truck.license_no.should.equal(license_no)
  truck.lat.should.equal(lat);
  truck.lng.should.equal(lng);
  truck.max_weight.should.equal(max_weight);
  truck.curr_weight.should.equal(curr_weight);
  truck.max_pallets.should.equal(max_pallets);
  truck.curr_pallets.should.equal(curr_pallets);
};
