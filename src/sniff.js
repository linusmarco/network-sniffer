const httpServer = require('http-server');
const ip = require('ip');

const arg = process.argv[2];
const addr = arg ? arg.split(':') : [];
const host = addr[0] || ip.address();
const port = addr[1] || 8080;

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
