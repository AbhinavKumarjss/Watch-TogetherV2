// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import './Hero.css'
import MessageBox from '../../Components/MessageBox/MessageBox';


const generateRandomId = (length = 5) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function Hero() {
  const [roomId, setRoomId] = useState('');
  const randomRoomId = generateRandomId();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  function handleCreateBtnClick() {
    
    if (localStorage.getItem('name')==null || localStorage.getItem('name')?.length == 0) {
      const messageBox = document.getElementById('Message-box-container');
      if (messageBox) {
        messageBox.style.display = 'block';
      }
    }
    else{      
      navigate(`/room/${randomRoomId}?name=${localStorage.getItem('name')}&admin=true`);
  }}

  function handleJoinBtnClick() {
   
    if (roomId.length === 0) {
      alert('Please enter a valid room id');
    }
    else if (localStorage.getItem('name')==null || localStorage.getItem('name')?.length == 0) {
      const messageBox = document.getElementById('Message-box-container');
      if (messageBox) {
        messageBox.style.display = 'block';
      }
    }
    else{
      navigate(`/room/${roomId}?name=${localStorage.getItem('name')}`);
  }}
  return (
    <div>
      <div id='hero-container'>
        <MessageBox name={name} setName={setName} />
        <video id='hero-landing-video' src="/assets/LandingVideo.mp4" loop autoPlay muted></video>
        <div>
          <h5>WATCH WITH FRIENDS</h5>
          <br />
          <h1>A new way to watch TV together</h1>
          <br />
          <h5>FEATURES</h5>
          <br />
          <h4>Watch movies using a download link in realtime</h4>
          <br />
          <h4>Stream youtube videos flawlessly</h4>
          <br />
          <h4>Better UI experience</h4>
          <br />
          <div id='hero-room-container'>

            <button id='hero-watchtogether-btn' onClick={() => { handleCreateBtnClick() }}>Create Party</button>

            <h5>OR</h5>
            <div id='hero-joinroom-container'>
              <input type="text" onChange={(e) => { setRoomId(e.target.value); console.log(roomId) }} />
              <button id='hero-watchtogether-btn' onClick={() => { handleJoinBtnClick() }}>Join Party</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
