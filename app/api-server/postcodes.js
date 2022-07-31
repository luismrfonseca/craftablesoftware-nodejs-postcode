/* eslint-disable promise/no-callback-in-promise */
const R = require('ramda');
const app = require('../app');
const loggerManager = require('../managers/logger.manager');
const router = require('express').Router();
const PostCodesService = require('../services/postcodes');

router.get('/:postcodes', (req, res, next) => {
  let postcodes = req.params.postcodes;

  if (R.isEmpty(postcodes) || !R.is(String, postcodes)) {
    return res.status(500).json({ status: 500, message: 'Invalid data' });
  }
  try {
    if (!R.is(Array, JSON.parse(postcodes)) || R.length(JSON.parse(postcodes))<=0) {
      return res.status(500).json({ status: 500, message: 'Postcodes are empty' });
    }
  } catch (e) {
    return res.status(500).json({ status: 500, message: 'Invalid data' });
  }

  postcodes = JSON.parse(postcodes);

  const PostCodesPromise = R.map(codes => PostCodesService.getAllPostcodes(codes))(postcodes);

  return Promise.all(PostCodesPromise)
    .then((data) => {
      //if (R.isNil(data)) throw new NotFoundError('Article dont exists.', 'article');

      return res.json(R.reject(R.isNil)(data));
    })
    .catch(error => {
      loggerManager.getLogger().error(`[PostCodes] ${error.message || error}`);
      
      return next(new Error(error.message, 'PostCodes'));
    });
});

module.exports = router;
