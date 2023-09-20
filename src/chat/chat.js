import { createServer, get } from 'http'
import { Server } from "socket.io"
import redis from "redis"
import Redis from 'ioredis'
const redisClientChat = new Redis(6379, "chatredis")
const redisClientGame = redis.createClient({
    socket: {
        host: 'gameredis',
        port: '6379'
    }
});
await redisClientGame.connect()


const sever = createServer()
const io = new Server(sever, {
    path: "/chat/",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
})
sever.listen(8080, () => {
    console.log('8080')
})
io.use(function (socket, next) {
    var handshakeData = socket.request;
    console.log("middleware:", handshakeData._query['code']);
    next();
});

io.sockets.on("connection", async (socket) => {
    const chat = await redisClientChat.lrange("chat", -50, -1);
    io.sockets.to(socket.id).emit("chatInit", {
        chat:chat
    });
    socket.on("msgGlobal", async (arg) => {
        io.emit("msgGlobal", arg)
        redisClientChat.rpush("chat", stringify(arg))
        const data = await redisClientChat.lrange("chat", 0, -1);
        console.log(data.length);
        if (data.length > 10000) {
            await redisClientChat.lpop("chat");
        }
    })
    console.log(`connnect ${socket.id}`)
})



function stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // reset the cache
    return str;
}

