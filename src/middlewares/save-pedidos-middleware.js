const fs = require('fs');
const cheerio = require('cheerio');

async function getBodyString(req, res) {
  const chunks = await getResponseChunks(res);
  const body = Buffer.concat(chunks).toString('utf8');

  if (body) {
    return body;
  }

  return null;
}

async function getResponseChunks(res) {
  return new Promise(resolve => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];

    res.write = function (chunk) {
      chunks.push(chunk);
      oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
      if (chunk) {
        chunks.push(chunk);
      }

      oldEnd.apply(res, arguments);
      resolve(chunks);
    };
  });
}

function parseHtmlToModel(html) {
  const $ = cheerio.load(html);
  const tbodyArray = [];

  $('#ctl00_ContentPlaceHolder1_panProdutosD table tbody')
    .each((i, e) => {
      if ($(e).children().length > 2) {
        tbodyArray.push($(e))
      }
    });

  const extractInfo = tbodyArray.map((tbody) => {
    let texts = [];

    tbody.find('span').each((i, span) => {
      texts.push($(span).html());
    });

    return {
      img: tbody.find('img').attr('src'),
      texts,
    }
  });

  return extractInfo;
}

function writeFileJson(file, data) {
  const json = JSON.stringify(data, null, '\t');

  fs.writeFile(file, json, function (err) {
    if (err) {
      throw err
    }
  });
}

module.exports = function parsePedidos(file) {
  return async (req, res, next) => {
    next();

    try {
      if (req.method === "POST" && req.originalUrl === "/cav/Pedidos.aspx") {
        const html = await getBodyString(req, res);

        if (html && html.includes('2504|updatePanel|ctl00_msgMaster_updMsgBox|')) {
          const model = parseHtmlToModel(html);
          setTimeout(() => {
            writeFileJson(file, model);
          }, 1000);

        }
      }
    } catch (err) {
      console.log('ERRO AQUI --- \n', err);
    }
  }
}