const fs = require("fs");

module.exports = {
  findAll(req, res) {
    try {
      const data = fs.readFileSync("db.json");

      res.send(JSON.parse(data));
    } catch (err) {
      console.log(err);

      res.status(500).send({
        error: "Deu ruim :(",
      });
    }
  }
};