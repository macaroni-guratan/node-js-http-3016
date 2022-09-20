'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' + 
          '<h1>アンケート一覧</h1><ul>' +
          '<li><a href="/enquetes/yaki-shabu">焼き肉・しゃぶしゃぶ</a></li>' +
          '<li><a href="/enquetes/rice-bread">ごはん・パン</a></li>' +
          '<li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>' +
          '</ul></body></html>');
        }else if (req.url === '/enquetes/yaki-shabu'){
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '寿司',
            secondItem: 'ピザ'
          }));
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            console.info(`[${now}] ${body}`);
            res.write(`<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
