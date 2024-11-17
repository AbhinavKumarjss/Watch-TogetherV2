import React, { useEffect, useRef, useState } from 'react'
import { Player, ControlBar, PlayToggle, ProgressControl, BigPlayButton, VolumeMenuButton, ForwardControl, ReplayControl, CurrentTimeDisplay, TimeDivider, DurationDisplay } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
import './Videoplayer.css'
export default function Videoplayer({ socket, videoUrl, isAdmin, roomId }) {
    const playerRef = useRef(null);
    const [changedByServer, setChangedByServer] = useState(false);



    useEffect(() => {
        console.log(isAdmin)
        if (isAdmin)
            socket.emit('send-url', roomId, videoUrl);
    }, [videoUrl]);

    useEffect(() => {
        console.log('useEffect',videoUrl)
        if(isAdmin)
        socket.on('get-url-from-admin',()=>{
            console.log('url sent by admin',videoUrl)
            console.log('videoUrl',videoUrl)
            socket.emit('send-url', roomId, videoUrl);
        })
        if (!isAdmin) {

            socket.on('receive_play', handlePlay);
            socket.on('receive-time', handleReceiveTime);
        }
        else{
       
        }
    }, [socket,videoUrl]);

    const sendPlay = () => {
        if (!isAdmin) return;
        socket.emit('send_play', roomId, true);
    };

    const sendPause = () => {
        if (!isAdmin) return;
        socket.emit('send_play', roomId, false);
    };
    const handlePlay = (data) => {
        const player = playerRef.current;
      
        console.log("This is player- " , player)
        if (player) {
            console.log("yup " , player)
            if (data) player.play();
            else player.pause();
        } else {
            console.error('Player instance is not available');
        }
    };


    const handleReceiveTime = (data) => {

        const player = playerRef.current;
        if (player) {
            const currentTime = player.getState().player.currentTime;
            if (Math.abs(data - currentTime) > 0.5) {
                player.seek(data + 0.25);
            }
        } else {
            console.error('Player instance is not available');
        }
    }

    const send_time = () => {
        if (!isAdmin) return;
        if (playerRef.current) {
            const time = playerRef.current.getState().player.currentTime;
            socket.emit('send-time', roomId, time);
            sendPlay();
        }
    }

    return (
        <div id='Video-Player-Container'>
            <Player
                id='Video-Player'
             
                onPlay={sendPlay}
                onPause={sendPause}
                onSeeking={send_time}
                onTimeUpdate={send_time}
                ref={playerRef}
                autoPlay
                playsInline
                fluid={false}
                src={`${import.meta.env.VITE_APP_SERVER_URL}/online/video-url/?videourl=${videoUrl}`}>
                <BigPlayButton position='center' />
                <ControlBar autoHide={true}>
                    
                    <PlayToggle />
                    <VolumeMenuButton />
                    <ForwardControl seconds={10} />
                    <ReplayControl seconds={10} />
                    <CurrentTimeDisplay />
                    <TimeDivider />
                    <DurationDisplay />
                </ControlBar>
            </Player>
        </div>
    )
}
