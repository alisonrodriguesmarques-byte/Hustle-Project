import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { randomBytes } from "node:crypto";

const app=express();
const httpServer=createServer(app);
const allowed=process.env.CLIENT_ORIGIN||"http://localhost:5173";
app.use(cors({origin:allowed}));
app.use(express.json({limit:"20kb"}));
const io=new Server(httpServer,{cors:{origin:allowed,methods:["GET","POST"]}});
const rooms=new Map();
app.get("/api/health",(_req,res)=>res.json({ok:true,service:"hustle-arena-server"}));
app.get("/api/rooms",(_req,res)=>res.json([...rooms.values()].map(r=>({code:r.code,players:r.players.length,createdAt:r.createdAt}))));
function roomCode(){let code;do{code=randomBytes(3).toString("hex").toUpperCase()}while(rooms.has(code));return code;}
io.on("connection",socket=>{
  socket.on("room:create",({name="Player"}={})=>{
    const code=roomCode(),room={code,createdAt:Date.now(),players:[{id:socket.id,name:String(name).slice(0,20)}]};
    rooms.set(code,room);socket.join(code);socket.data.room=code;
    socket.emit("room:created",{code,players:1});io.emit("rooms:update");
  });
  socket.on("room:join",({code,name="Player"}={})=>{
    const key=String(code||"").toUpperCase(),room=rooms.get(key);
    if(!room){socket.emit("room:error",{message:"Sala não encontrada."});return;}
    if(room.players.length>=2){socket.emit("room:error",{message:"Essa sala já está cheia."});return;}
    if(room.players.some(p=>p.id===socket.id))return;
    room.players.push({id:socket.id,name:String(name).slice(0,20)});socket.join(key);socket.data.room=key;
    io.to(key).emit("room:joined",{code:key,players:room.players.length,names:room.players.map(p=>p.name)});io.emit("rooms:update");
  });
  socket.on("chat:send",({code,message}={})=>{
    const key=String(code||socket.data.room||"").toUpperCase(),room=rooms.get(key);
    if(!room||!room.players.some(p=>p.id===socket.id)||typeof message!=="string")return;
    const clean=message.trim().slice(0,250);if(!clean)return;
    const player=room.players.find(p=>p.id===socket.id);
    io.to(key).emit("chat:message",{name:player.name,message:clean,at:Date.now()});
  });
  socket.on("match:decision",({code,turn,action}={})=>{
    const room=rooms.get(String(code||"").toUpperCase());
    if(!room||!room.players.some(p=>p.id===socket.id)||!Number.isInteger(turn)||turn<1||typeof action!=="object")return;
    // Relay only validated, bounded decisions; authoritative combat is not yet implemented.
    io.to(room.code).emit("match:decision",{player:socket.id,turn,action:JSON.stringify(action).slice(0,1000)});
  });
  socket.on("disconnect",()=>{
    const code=socket.data.room,room=rooms.get(code);if(!room)return;
    room.players=room.players.filter(p=>p.id!==socket.id);
    if(!room.players.length)rooms.delete(code);
    else io.to(code).emit("room:joined",{code,players:room.players.length,names:room.players.map(p=>p.name)});
    io.emit("rooms:update");
  });
});
const port=Number(process.env.PORT)||3001;
httpServer.listen(port,"0.0.0.0",()=>console.log(`Hustle//Arena server running on http://localhost:${port}`));