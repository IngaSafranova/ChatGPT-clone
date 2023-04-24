
import { useEffect, useState } from 'react';
import './index.css';




function App() {

//hook up data from the server 
  const [messages, setMessages] = useState(null);

  //hook up value from the input
  const [input, setInput] = useState('');

  //save previous messages
  const [previousMessages, setPreviousMessages] = useState([]);

  //set title of the chat
  const [title, setTitle] = useState(null);


//create new chat by clearing the title and previous messages and input
const createNewChat = () => {
  setTitle(null);
  setMessages(null);
  setInput('');
}

const handleClick = (uniqueTitle) => {
  setTitle(uniqueTitle);
}


const getMessages = async() => {

  const options = {
    method: 'POST',
    body:JSON.stringify( {
      message: input,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {

    //fetching from the localhost:8001/completions
   const response =  await fetch ('http://localhost:8000/completions', options)
const data = await response.json();

setMessages(data.choices[0].message);


  } catch(error){
    console.log(error);
  }
}
console.log(messages);

//useEffect will run everytime the messages changes
useEffect(() => {
  //if there are no previous title but there are messages and the messages are not empty set title to the value of the input
  if (! title && messages && input) {
    setTitle(input);
  }
  //if there are previous messages and the messages are not empty set previous messages to the value of the messages
  if (title && messages && input) {
    setPreviousMessages(previousMessages => [...previousMessages, 
      {
        title: title,
        role: 'user',
        content: input,
      },
    {
      title: title,
      role: messages.role,
      content: messages.content,
    }]);
  }
}, [messages, title, ]);

console.log(previousMessages);

//filter the previous messages by the title to have only the messages with the same title
const currentChat = previousMessages.filter((message) => message.title === title);

//map through the previous messages and return the unique titles
const uniqueTitles= Array.from(new Set( previousMessages.map((message) => message.title)));
console.log(uniqueTitles);

  return (
    <div className="App">
      <section className="side-bar">

      {/* + icon from https://www.merriam-webster.com/dictionary/plus%20sign */}
        <button onClick={createNewChat} >+ New Chat</button>
        <ul className="history">
         { uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Inga</p>
        </nav>
      </section>
      <section className="main">

      {/* if there is no title show h1 if there is title show title */}
       {!title && <h1>Inga GPT Clone</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage,index) => <li key={index}>
        <p className='role'>{chatMessage.role}</p>
        <p className='message'>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
          <input className='input' value={input} onChange={(e) => setInput(e.target.value) } />
          <div id='submit' onClick={getMessages}>➢</div>
          </div>
          <p className='info'>Chat GPT March Version.Free Research Preview. </p>
        </div>
      </section>
    </div>
  );
}

export default App;
