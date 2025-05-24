//! app.js

// Load environment variables
import env from './config/dotenv.js';

// Load the Express app with all middlewares and routes
import app from './config/express.js';

import http from 'http';
// Socket.io will be connected here later
// import { initSocket } from './config/socket.js';

// Create and start the HTTP server
const server = http.createServer(app);
server.listen(env.PORT, () => {
	console.log(`🚀 Server running at http://${env.HOST}:${env.PORT}`);
});
