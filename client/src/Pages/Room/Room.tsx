// @ts-nocheck
import React, { useEffect, useState } from "react";
import Chat from "../../Components/Chat/Chat";
import YoutubePlayer from "../../Components/Player/YoutubePlayer";
import './Room.css';
import io, { Socket } from 'socket.io-client';
import VideoContainerMenu from "../../Components/VideoContainerMenu/VideoContainerMenu";
import { Color } from '../../Components/Chat/ChatColor.ts';
import { useParams } from "react-router-dom";
import Videoplayer from "../../Components/Player/Videoplayer.tsx";
import Peer from "peerjs";

const socket = io(`${import.meta.env.VITE_APP_SERVER_URL}`);
let canJoin = true;

export default function Room() {
    const query = new URLSearchParams(window.location.search);
    const { roomId } = useParams();
    const isAdmin = query.get('admin') || false;
    const name = query.get('name') || 'Anonymous';

    const [videoUrl, setVideoUrl] = useState('');
    useEffect(() => {
        socket.emit('join-room', { roomId, name });
        if (!isAdmin)
            socket.emit('get-url', roomId);
    }, []);

    useEffect(() => {
        socket.on('receive-url', (url) => {
            setVideoUrl(url);
            console.log('recieved url', url);
        }
        );
    }, [socket, roomId, name]);

    return (
        <div id='Room-container'>
            <div id='Video-container'>
                <VideoContainerMenu isAdmin={isAdmin} roomId={roomId} setvideoUrl={setVideoUrl} />
                <Videoplayer roomId={roomId} isAdmin={isAdmin} socket={socket} videoUrl={videoUrl} />
            </div>
            <Chat roomId={roomId} Socket={socket} />
        </div>
    );
}
