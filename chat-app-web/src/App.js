import { useEffect, useRef, useState } from 'react';
import './App.css';

// interface Message {
//     sender: 'me' | 'them',
//     msg: string
// }

const ChatWindow = () => {
  const [messageLog, setMessageLog] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    console.log('Connecting socket');
    const socket = new WebSocket('ws://localhost:8080/chat');

    // Connection opened
    socket.addEventListener('open', (event) => {
      // socket.send("Connection established")
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      // console.log("Message from server ", event.data)
      const messageEntry = {
        sender: 'them',
        msg: event.data,
      };
      setMessageLog((prevState) => prevState.concat(messageEntry));
    });

    // Check for errors
    socket.addEventListener('error', (event) => {
      console.error('WebSocket error: ', event);
    });

    socketRef.current = socket;

    return () => {
      console.log('Unmounting - disconnecting socket');
      socket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault(); // prevent the form submit from re-rendering the page
    const messageEntry = {
      sender: 'me',
      msg: messageToSend,
    };
    socketRef.current.send(messageToSend); // TODO - async???? error handling???
    setMessageLog((prevState) => prevState.concat(messageEntry));
    setMessageToSend('');
  };

  return (
    <div style={{ margin: 30 }}>
      <div>Chat Window</div>
      <div style={{ margin: 20 }}>
        {messageLog.map((messageEntry) => (
          <div style={{ padding: 10, background: messageEntry.sender === 'me' ? 'lightgray' : 'lightgreen' }}>{messageEntry.msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <span>
          <input
            type="text"
            placeholder="Your message here"
            value={messageToSend}
            onChange={(event) => setMessageToSend(event.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send
          </button>
        </span>
      </form>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ChatWindow />
      <hr />
      <ChatWindow />
      <hr />
      <ChatWindow />
    </div>
  );
}

export default App;
