const fs = require('fs'), http = require('http');

const requestListener = function (req, res) {
    fs.readFile(__dirname + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }

const server = http.createServer(requestListener);
server.listen(8080, () => {
    console.log(`listening at port 8080`)
});