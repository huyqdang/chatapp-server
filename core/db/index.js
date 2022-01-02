const { Client } = require("pg");

module.exports = {
  initDb: () => {
    const client = new Client({
      connectionString:
        "postgres://uygduylpaertje:a020d379d4748fafa5de345b5930c308edfabdf30b3af79a2884872f55e7f3e8@ec2-50-16-241-192.compute-1.amazonaws.com:5432/d79r6tpi11klp5",
      ssl: { rejectUnauthorized: false },
    });

    client
      .connect()
      .then(() => {
        console.log("connected to db");
      })
      .catch((err) => console.log(err));

    return client;
  },
};
