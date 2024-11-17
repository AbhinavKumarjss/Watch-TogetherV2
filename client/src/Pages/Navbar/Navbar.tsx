import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
const generateRandomId = (length = 5) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export default function Navbar() {
  const randomRoomId = generateRandomId();
  return (
    <div id='navbar'>
        <div id="watchtogether-logo-navbar">
            {/* <img src="/assets/VideoPlayer.png" alt="" /> */}
            Watch Together
        </div>
        <Link to={`/room/${randomRoomId}?admin=true`}> <button id='hero-watchtogether-btn'>Create Party</button></Link>
             
    </div>
  )
}
