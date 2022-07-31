const parseDatabaseError = (logger, error) => {
  if (error.sql || error.sqlMessage || error.sqlState) {
    logger.error(error);

    return new Error('Something went wrong with the DB');
  }

  return error;
};

module.exports = parseDatabaseError;
