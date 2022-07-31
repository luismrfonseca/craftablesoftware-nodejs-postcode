const R = require('ramda');
const app = require('../app');
const axios = require('axios');
const GeoPoint = require('geopoint');

const getAllPostcodes = (postCodes) => {
  return new Promise((resolve, reject) => {
    if (R.length(postCodes) < 0 || R.length(postCodes) > 10 ) resolve();

    axios.get(`http://api.postcodes.io/postcodes/${postCodes}`)
      .then(data => {
        const postCodeData = data.data.result
        const airport = new GeoPoint(51.4700223, -0.4542955);

        const address = new GeoPoint(postCodeData.latitude, postCodeData.longitude);

        postCodeData.distanceMiles = address.distanceTo(airport);
        postCodeData.distanceKms = address.distanceTo(airport, true);
        resolve(postCodeData);
      })
      .catch(err => resolve());
  });
};

module.exports = {
  getAllPostcodes,
};
  