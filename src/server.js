const express = require("express");

const TupperwareController = require("./controllers/tupperware-controller");
const proxyMiddleware = require("./middlewares/proxy-middleware");
const savePedidosMiddleware = require("./middlewares/save-pedidos-middleware");

const app = express();

const frontName = 'tupper-app';

app.use(`/${frontName}/`, express.static(__dirname + '/../public'));
app.use(`/${frontName}/*`, express.static(__dirname + '/../public/index.html'));

app.get('/records/tupperware', TupperwareController.findAll);

app.use(savePedidosMiddleware("db.json"));
app.use(proxyMiddleware("http://pedidos.tupperware.com.br"));

app.listen(process.env.PORT || 3000);