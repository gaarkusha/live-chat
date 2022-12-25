import React, { useRef, useState} from 'react';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }

    const onKeyPressHandler = (e) => {
        if (e.charCode === 13) {
            connect();
        }
    }

    const onKeyPressSendHandler = (e) => {
        if (e.charCode === 13) {
            sendMessage();
        }
    }

    if (!connected) {
        return (
            <div className='form-wrapper'>
                <div className="register-form">
                    <div className='form'>
                        <label className='field-item'>
                            <input
                                className='reg-input'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                type="text"
                                required
                                onKeyPress={onKeyPressHandler}/>
                            <span className='reg-span'>Enter your name</span>
                            <div className='line'></div>
                        </label>
                        <button className='btn-enter' onClick={connect}>Enter</button>
                    </div>
                 </div>
            </div> 
        )
    }


    return (
        <div className="send-wrapper">
            <div className='logo'><h3>LIVE</h3><h2>CHAT</h2></div>
            <div className='mesqr-wrapper'>
                <div className='scan'>
                    <div className='qrcode'></div>
                    <h3>QR Code scaning...</h3>
                    <div className='border'></div>
                </div>
                <div className='messages-wrapper'>
                <div className='send-form'>
                    <div className="messages">
                        {messages.map(mess =>
                            <div key={mess.id}>
                                {mess.event === 'connection'
                                    ? <p className="connection_message">
                                        User {mess.username} is connected
                                    </p>
                                    : <p className="message">
                                        {mess.username}: {mess.message}
                                    </p>
                                }
                            </div>
                        )}
                    </div>
                    <div className='back'></div>
                </div>
                <div className="form-message">
                    <input 
                        className='send-input' 
                        value={value} 
                        onChange={e => setValue(e.target.value)} 
                        type="text" 
                        placeholder='Write something...'
                        onKeyPress={onKeyPressSendHandler}/>
                    <button className='btn-send' onClick={sendMessage}>SEND</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default WebSock;
