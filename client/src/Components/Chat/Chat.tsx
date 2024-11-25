import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useNavigate } from 'react-router-dom';

interface Message {
  name: string;
  message: string;
  socketId: string;
}

export default function Chat({ roomId, Socket }) {
  
  const voiceRef = React.useRef(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();
  const [MessageList, SetMessageList] = useState<Message[]>([

  ]);

  const [newMessage, setNewMessage] = useState('');
  const query = new URLSearchParams(window.location.search);

  const name = query.get('name') || 'Anonymous';
  const ref = React.useRef(null);

  // Handle new incoming messages via Socket
  useEffect(() => {
    if (Socket) {

      Socket.on('receive-message', (newMessage: Message) => {
        SetMessageList(prevMessages => [...prevMessages, newMessage]);
        if(ref.current)
          ref.current.scrollTop = ref.current.scrollHeight; // Scroll to the bottom of the chat
      }
    );


      // Cleanup the listener on component unmount
      return () => {
        Socket.off('message');
      };
    }
  }, [Socket]);


  const voiceHandler = () => {
    voiceRef.current = !voiceRef.current;

    if (voiceRef.current) {
      document.getElementById('Voice-btn')?.classList.add('active-voice');
    }
    else{
    
      document.getElementById('Voice-btn')?.classList.remove('active-voice');
    }
  };
  // Handle message sending
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        name: name, // Replace with dynamic name if needed
        message: newMessage,
        socketId: Socket.id
      };
      Socket.emit('send-message', roomId, message); // Emit the message to the server
      console.log("emitted message", message)
      SetMessageList(prevMessages => [...prevMessages, message]);
      setNewMessage(''); // Clear the input
      if(ref.current)
      ref.current.scrollTop = ref.current.scrollHeight; // Scroll to the bottom of the chat
    }
  };

  return (

      <div id='Chat-container'>
        <div id='Chat-navbar'>
          <label htmlFor="Name">{name}</label>
          <div>
            {/* <img id='Voice-btn'src="/assets/voice.png" alt="Voice" onClick={voiceHandler} /> */}
            <img id='exit-btn' src="/assets/exit.png" alt="Screen" onClick={()=>
              {
                console.log('disconnecting');
                console.log('roomId',roomId);
                console.log('name',name);
                Socket.emit('leave-room',roomId,name);
                navigate('/');
              }
            }/>
          </div>
        </div>

        <div ref={ref} id='message-box'>
          {MessageList.map((message, index) => (
            <div key={index} className={`message ${message.socketId === Socket.id ? 'you' : message.socketId === "-1" ? 'system' : 'other'}`}>
              <label>{message.name}</label>
              <p>{message.message}</p>
            </div>
          ))}
        </div>

        <div id='Chat-input-container'>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type Something...'
            onKeyDown={(e)=>{
              if(e.key === 'Enter'){
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} >Send</button>
        </div>
      </div>
  
  );
}
