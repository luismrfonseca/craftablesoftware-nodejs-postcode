const R = require('ramda');
const { version } = require('../../package-lock.json');
const loggerManager = require('../managers/logger.manager');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const NotFoundError = require('../errors/notFoundError');
const parseDatabaseError = require('../helpers/parseDatabaseError');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const corsOptions = {
  origin: true,
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  allowedHeaders:
    'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const apiServer = express();
let logger;
let server;

apiServer.initialize = async (configuration) => {
  logger = loggerManager.getLogger();
  logger.debug('[ApiServer] Initialize');

  apiServer.use(fileUpload());
  // Middleware
  // apiServer.use(express.json());
  apiServer.use(
    express.urlencoded({
      limit: '100mb',
      extended: true,
      parameterLimit: 1000000,
    }),
  );
  apiServer.use(loggerManager.logApiServerRequests);
  // parse application/x-www-form-urlencoded
  apiServer.use(bodyParser.json());
  apiServer.use(cors(corsOptions));

  apiServer.use(express.static(path.join(__dirname, '../../public')));

  // Endpoints
  apiServer.get('/', (req, res, next) => {
    res.send({ status: 200, message: 'Express is working' });
  });

  apiServer.use('/api/postcodes', require('./postcodes'));

  apiServer.use(function (req, res, next) {
    next();
  });

  // No Endpoint found
  apiServer.use(function (req, res, next) {
    next({ status: 404, message: 'Content not found' });
  });

  // catch 404 and forward to error handler
  apiServer.use((req, res, next) =>
    next(new NotFoundError('Endpoint not found')),
  );

  apiServer.use((err, req, res, next) =>
    next(parseDatabaseError(loggerManager.getLogger(), err)),
  );

  // error handler
  apiServer.use((err, req, res, next) => {
    const {
      status = 500,
      message = 'Something went wrong',
      i18nToken: i18n_key = undefined,
    } = err;

    if (status < 400) {
      loggerManager.getLogger().info(R.toString(`${err.message}`));
    } else if (status >= 400 && status < 500) {
      if (status === 404) {
        loggerManager.getLogger().warn(R.toString(err.message));
      } else {
        loggerManager
          .getLogger()
          .warn(R.toString(`${err.message} - ${err.stack}`));
      }
    } else {
      loggerManager
        .getLogger()
        .error(R.toString(`${err.message} - ${err.stack}`));
    }

    return res.status(status).json({ status, message, i18n_key });
  });

  // start listening
  const port =
    process.env.PORT ||
    (configuration.server && configuration.server.port) ||
    '3000';
  const host =
    process.env.HOST ||
    (configuration.server && configuration.server.host) ||
    'localhost';

  server = apiServer.listen(port, host);

  server.on('listening', () => {
    let message = '[ApiServer] Start listening\n';
    message += '  ********************************************\n';
    message += `  * Node Express rmt-luis-fonseca-01 v${version}\n`;
    message += `  * API Server listening on ${port}\n`;
    message += '  * Ctrl-C to shutdown API Server\n';
    message += '  *';
    logger.info(message);
  });
};

apiServer.close = () => {
  server.close();
}

module.exports = apiServer;
