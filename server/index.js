import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const server = http.Server(app);
const router = express.Router();

const rooms = {
}

app.use(cors());
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const generateRandomId = (length = 5) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

io.on('connection', (socket) => {

    const _id = socket.id;
    let url = '';

    socket.on('join-room', ({ roomId, name }) => {
        socket.join(roomId);
        console.log(`${name} has joined the room ${roomId}`);
        socket.to(roomId).emit('receive-message', {
            name: name,
            message: ' has joined the room',
            socketId: '-1',
        });
    });

    socket.on('send_play', (roomId, data) => {
        socket.to(roomId).emit('receive_play', data);
    });
    socket.on('send-message', (roomId, message) => {
        socket.to(roomId).emit('receive-message', message);
    });
    socket.on('send-time', (roomId, time) => {
        socket.to(roomId).emit('receive-time', time);
    });
    socket.on('get-url', (roomId) => {
        socket.to(roomId).emit('get-url-from-admin');
    });
    socket.on('send-url', (roomId, url) => {
        socket.to(roomId).emit('receive-url', url);
    });

    socket.on('seek', (roomId, data) => {
        socket.to(roomId).emit('seek', data);
    });
    socket.on('leave-room',(roomId,name)=>{
        socket.to(roomId).emit('receive-message', {
            name: name,
            message: ' has left the room',
            socketId: '-1',
        });
    })
    socket.on('disconnect', () => {
        console.log('user disconnected',socket.id);
       
    });
});

router.get('/room/', async (req, res) => {
    const roomId = generateRandomId();
    rooms[roomId] = { "Admin": req.id }; // Track room creation
    res.redirect(`/room/${roomId}`);

});
router.get('/room/:roomId', async (req, res) => {
    let { roomId } = req.params;

    if (!roomId) {
        res.redirect(`/room/`);
    } else if (rooms[roomId]) {
        res.json({ roomId, success: true, message: 'Room can be joined' });
    } else {
        res.status(404).json({ roomId, success: true, message: 'Room is created' });
        rooms[roomId] = {}; // Track room creation
    }
});

// Mount the router
app.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Server listening on: ${process.env.PORT}`);
});



app.get('/online/video-url/', async (req, res) => {
    const { videourl } = req.query;
    const fileUrl = videourl;
    if (!fileUrl) {
        return res.status(400).send('No video URL provided');
    }

    try {
        const metadataResponse = await fetch(fileUrl, { method: 'HEAD' });

        if (!metadataResponse.ok) {
            return res.status(metadataResponse.status).send('Video not found');
        }

        const fileSize = parseInt(metadataResponse.headers.get('content-length'), 10);
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize || end >= fileSize) {
                return res.status(416).send('Requested range not satisfiable');
            }

            const chunkSize = end - start + 1;
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            };

            res.writeHead(206, head);

            const rangeResponse = await fetch(fileUrl, {
                headers: { 'Range': `bytes=${start}-${end}` },
            });
            rangeResponse.body.pipe(res);
        }
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});