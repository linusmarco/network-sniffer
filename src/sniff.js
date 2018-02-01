const httpServer = require('http-server');
const ip = require('ip');
const fs = require('fs');

const arg = process.argv[2];
const addr = arg ? arg.split(':') : [];
const host = addr[0] || ip.address();
const port = addr[1] || 8080;
const now = new Date();

const logFiles = [`./logs/${now.toISOString()}.log`, './logs/current.log'];

class Log {
    constructor(files, toConsole) {
        this.files = files;
        this.toConsole = toConsole || true;
        this.streams = this.files.map(f => {
            return fs.createWriteStream(f);
        });

        this.log = this.log.bind(this);
        this.logReq = this.logReq.bind(this);
    }

    log(msg) {
        if (this.toConsole) {
            console.log(msg);
        }

        this.streams.forEach(s => {
            s.write(msg + '\n');
        });
    }

    logReq(req, res) {
        const date = new Date();
        const url = req.url;
        const urlBase = url.split('?')[0];
        const clientIP = req.connection.remoteAddress;

        for (let i = 0; i < this.files.length; ++i) {
            const isLogReq = this.files[i].substr(-urlBase.length) === urlBase;
            const isMe = clientIP === host;
            if (isLogReq && isMe) return;
        }

        this.log(
            `[${date}] CLIENT: ${clientIP} | URL: http://${host}:${port}${url}`
        );
    }
}

let log = new Log(logFiles);
let server = httpServer.createServer({ logFn: log.logReq });

server.listen(port, host, function() {
    log.log(`listening on http://${host}:${port}/`);
});
