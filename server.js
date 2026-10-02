// server.js
const http = require('http');
const url = require('url');
const { getDate } = require('./modules/utils');
const messages = require('./lang/en/en.json');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);


    if (parsedUrl.pathname.includes('/getDate')) {

        const name = parsedUrl.query.name || 'Guest';
        const currentTime = getDate();

        const responseText = messages.greeting
            .replace('%1', name)
            .replace('%2', currentTime);


        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${responseText}</p>`);
    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});