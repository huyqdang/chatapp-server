const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = "asdklfjalksdfjlkasdjf";

module.exports = function (app, client) {
  // create users
  app.post("/user/create", (req, res) => {
    const { name, email, password } = req.body;
    client
      .query(`select email from users where email = '${email}'`)
      .then((dbResponse) => {
        if (dbResponse.rows.length > 0) {
          return res.status(200).send({ message: "email already exists" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: "create password failed" });
          }

          client
            .query(
              `insert into users (name, email, password) values ('${name}', '${email}', '${hash}')`
            )
            .then(() => {
              res.status(200).send({ message: "user created" });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send({ message: "create user failed" });
            });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  });

  //login users
  app.post("/user/login", (req, res) => {
    const { email, password } = req.body;
    client
      .query(`select * from users where email = '${email}'`)
      .then((dbResponse) => {
        if (dbResponse.rows.length === 0) {
          return res
            .status(403)
            .send({ message: "your email or password is incorrect" });
        }
        bcrypt.compare(password, dbResponse.rows[0].password, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: "login failed" });
          }
          if (result) {
            const token = jwt.sign(
              {
                id: dbResponse.rows[0].id,
                name: dbResponse.rows[0].name,
                email: dbResponse.rows[0].email,
              },
              secret,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).send({
              message: "login successful",
              token,
              user: {
                name: dbResponse.rows[0].name,
                email: dbResponse.rows[0].email,
              },
            });
          }
          return res
            .status(403)
            .send({ message: "your email or password is incorrect" });
        });
      });
  });

  app.get("/user/info", (req, res) => {
    if (!req.query.token) {
      return res.status(403).send({ message: "missing or wrong token" });
    }
    const user = jwt.verify(req.query.token, secret);
    if (!user) {
      return res.status(403).send({ message: "missing or wrong token" });
    }
    return res.status(200).send(user);
  });
};
