const httpServer = require('http-server');

const addr = process.argv[2].split(':');
const host = addr[0];
const port = addr[1];

var server = httpServer.createServer({
    logFn: logger
});

server.listen(port, host, function() {
    console.log(`listening on http://${host}:${port}/`);
});

function logger(req, res) {
    const date = new Date();
    const url = req.url;
    const clientIP = req.connection.remoteAddress;

    console.log(
        `[${date}] CLIENT: ${clientIP} | URL: http://${host}:${port}${url}`
    );
}
