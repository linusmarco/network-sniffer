const httpServer = require('http-server');
const minimist = require('minimist');
const ip = require('ip');
const fs = require('fs');

const args = minimist(process.argv, {
    string: ['h', 'p'],
    boolean: true
});

const host = args.h || ip.address();
const port = args.p || 8080;
const now = new Date();

if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

let logFiles = ['./logs/current.log'];
if (args.save) {
    const strDate = now.toISOString().replace(/:/g, '-');
    console.log(strDate);
    logFiles.unshift(`./logs/${strDate}.log`);
}

class Log {
    constructor(files, toConsole) {
        this.files = files;
        this.toConsole = toConsole === true;
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

let log = new Log(logFiles, !args.noprint);
let server = httpServer.createServer({ logFn: log.logReq });

server.listen(port, host, function() {
    log.log(`listening on http://${host}:${port}/`);
});
