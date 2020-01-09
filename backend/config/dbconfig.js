const { Client } = require('pg');
const connectionString = `postgres://${process.env.DBUSERROLE}:${process.env.DBUSERPASSWORD}@localhost:5432/newsapi`;
const client = new Client({
    connectionString: connectionString
});
client.connect();
exports.client = client;