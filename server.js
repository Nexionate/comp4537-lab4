const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const DateUtils = require('./modules/utils');
const messages = require('./lang/en/en.json');

class AppServer {
    constructor(port) {
        this.port = port || process.env.PORT || 3000;
    }

    handleGetDate(req, res, parsedUrl) {
        const name = parsedUrl.query.name || 'Guest';
        const currentTime = DateUtils.getDate();
        const responseText = messages.greeting
            .replace('%1', name)
            .replace('%2', currentTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${responseText}</p>`);
    }

    handleWriteFile(req, res, parsedUrl) {
        const textToAppend = parsedUrl.query.text;

        if (!textToAppend) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('400 Bad Request: Missing "text" parameter.');
            return;
        }

        const filePath = path.join(__dirname, 'file.txt');
        fs.appendFile(filePath, textToAppend + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Appended "${textToAppend}" successfully.`);
        });
    }

    handleReadFile(req, res, parsedUrl) {
        const segments = parsedUrl.pathname.split('/').filter(Boolean);
        const fileName = segments[segments.length - 1];
        const filePath = path.join(__dirname, fileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 Not Found: File "${fileName}" does not exist.`);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname.includes('/getDate')) {
            this.handleGetDate(req, res, parsedUrl);
        } else if (pathname.includes('/writeFile')) {
            this.handleWriteFile(req, res, parsedUrl);
        } else if (pathname.includes('/readFile')) {
            this.handleReadFile(req, res, parsedUrl);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}

const app = new AppServer();
app.start();