// @ts-nocheck
import React, { useRef } from 'react';
import './MessageBox.css';

interface MessageBoxProps {
    name: string;
    setName: (name: string) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ name, setName }) => {
    const inp = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (inp.current) {
            
            localStorage.setItem('name', inp.current.value);
            console.log(inp.current.value);
            inp.current.value = ''; // Clear the input field after saving
            const messageBox = document.getElementById('Message-box-container');
            if (messageBox) {
                messageBox.style.display = 'none';
            }
        }
    };

    return (
        <div id="Message-box-container">
            <div id="Message-box-background">
                <div id="Message-box">
                    <label htmlFor="nameInput">Name</label>
                    <input ref={inp} id="nameInput" type="text" placeholder='Enter your name'/>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
