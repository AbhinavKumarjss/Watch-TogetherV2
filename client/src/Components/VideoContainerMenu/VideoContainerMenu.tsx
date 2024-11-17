import React from 'react'
import './VideoContainerMenu.css'
export default function VideoContainerMenu({isAdmin, roomId , setvideoUrl}) {


  return (
    <div id='Video-container-menu'>

      <div id="watchtogether-logo-navbar">
        {/* <img src="/assets/VideoPlayer.png" alt="" /> */}
        Watch Together
      </div>
      <div id='Video-container-input-container'>

        {isAdmin && <input type="text" placeholder='Download Link of a Video . . ' onChange={async (e)=>{
        setvideoUrl(e.target.value);

      }
        }/>}
        
      </div>



      <label htmlFor="" id='room-info'><div>
        ROOM ID
      </div>
        <div style={{ color: "tomato" }}>
          {roomId}
        </div>
      </label>

    </div>
  )
}
