import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';

import router from './router';

const app = express();

// MongoDB
mongoose.connect('mongodb://localhost:27017/mongoApis');
mongoose.set('debug', true);
// Server config
app.set('port', 8001);
app.use(compression());
app.use(cors()); // Para hacer white list 
app.use(bodyParser.json({ type: '*/*' }));
// Sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'SoyUnaClavejijij',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1800000 } // Enable if is https maxAge: 30min
}));

router(app);

const server = http.createServer(app);

server.listen(app.get('port'), () => {
    console.log('Server is up and listening at http://localhost:%s', app.get('port'));
});