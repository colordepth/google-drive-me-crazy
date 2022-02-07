const http = require('http');
const app = require('./server/server.js');

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
	console.log(`HTTP server running on ${PORT}`);
});
