const loggerManager = require('./logger.manager');
require('dotenv').config();

const getConfigurationFromFile = (configuration = {}) => {
  return Promise.resolve(Object.assign(configuration, require('../../config/config.json')));
};

const getConfigurationFromDb = (configuration = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Object.assign(configuration, require('../../config/config_from_database.json')));
    }, 2000);
  });
};

module.exports = {
  getConfiguration: async () => {
    loggerManager.getLogger().debug('[ConfigurationManager] getConfiguration');

    return await getConfigurationFromFile()
      .then(getConfigurationFromDb)
      .then(config => {
        if (process.env.NODE_ENV === 'development') {
          // In order to work without https
          config.session = config.session || {};
          config.session.cookie = config.session.cookie || {};
          config.session.cookie.secure = false;
        }

        config.aeroport.latitude = process.env.AEROPORT_LATITUDE || config.aeroport.latitude;
        config.aeroport.longitude = process.env.AEROPORT_LONGITUDE || config.aeroport.longitude;

        config.authtication = {
          secrectKey: process.env.SECRECTKEY,
        };

        return config;
      });
  },
};
