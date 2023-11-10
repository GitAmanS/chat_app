const fs = require('fs');
const express = require('express');
const app = express();

let messages = [];

app.use((req, res, next) => {
    if (req.method === 'GET') {
    } else if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const message = decodeURIComponent(body);


            messages.push(message);

  
            fs.writeFile('messages.txt', messages.join('\n') + '\n', (err) => {
                if (err) throw err;
                console.log('Messages saved to messages.txt');
            });

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`
                <html>
                <head>
                    <title>Chat App</title>
                    <script>
                        // JavaScript code to update the h1 tag with the latest messages
                        document.addEventListener('DOMContentLoaded', function () {
                            const h1 = document.getElementById('messageDisplay');
                            h1.innerHTML = '${messages.map(message => message).join('')}';
                        });
                    </script>
                </head>
                <body>
                    <h1 id="messageDisplay">${messages.join('')}</h1>
                    <form action="/" method="POST">
                        <input type='text' name='inputText'>
                        <button type="submit">Send</button>
                    </form>
                </body>
                </html>
            `);
            res.end();
        });
    }
});

module.exports = app;
