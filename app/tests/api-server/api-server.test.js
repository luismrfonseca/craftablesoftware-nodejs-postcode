const rewire = require('rewire');
const app = rewire('../../app');
const supertest = require('supertest');
const should = require("should");

let request;

describe('routes', () => {

  afterAll((done) => {
    if (app.apiServer){
      app.apiServer.close();
    }
    return done();
  });

  beforeEach(async () => {
    if(!app.apiServer){
      await app.initialize(); 
    }
    request = supertest(app.apiServer);
  });

  test("It should response the GET method", async () => {
    request.get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        return Promise.resolve();
      });
  });
  
  test("PostCodes - It should response 200", async () => {
    request.get('/api/postcodes/["N76RS"]')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        
        const payload = response.body[0];
        payload.should.have.property("postcode");
        payload.should.have.property("quality");
        payload.should.have.property("eastings");
        payload.should.have.property("northings");
        payload.should.have.property("country");
        payload.should.have.property("nhs_ha");
        payload.should.have.property("longitude");
        payload.should.have.property("latitude");
        payload.should.have.property("european_electoral_region");
        payload.should.have.property("primary_care_trust");
        payload.should.have.property("region");
        payload.should.have.property("lsoa");
        payload.should.have.property("msoa");
        payload.should.have.property("incode");
        payload.should.have.property("outcode");
        payload.should.have.property("parliamentary_constituency");
        payload.should.have.property("admin_district");
        payload.should.have.property("parish");
        payload.should.have.property("admin_county");
        payload.should.have.property("admin_ward");
        payload.should.have.property("ced");
        payload.should.have.property("ccg");
        payload.should.have.property("nuts");
        payload.should.have.property("distanceMiles");
        payload.should.have.property("distanceKms");

        return Promise.resolve();
      });
  });
  
  test("PostCodes - It should response 500", async () => {
    request.get('/api/postcodes/N76RS')
      .then(response => {
        expect(response.statusCode).toBe(500);

        return Promise.resolve();
      });
  });
  
});