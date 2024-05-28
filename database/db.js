const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/xe`
};

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let clientOpts = {};
if (process.platform === 'win32') {
  clientOpts = { libDir: 'C:\\Users\\Samue\\Downloads\\instantclient_21_13' };
} else if (process.platform === 'darwin' && process.arch === 'x64') {
  clientOpts = { libDir: 'C:\\Users\\Samue\\Downloads\\instantclient_21_13' };
}

// enable node-oracledb Thick mode
oracledb.initOracleClient(clientOpts);

module.exports = {
    dbConfig,
    oracledb
} ;