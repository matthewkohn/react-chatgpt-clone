import { useEffect, useState } from 'react';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setInputValue("");
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setInputValue("");
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: inputValue
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  }
  // console.log(previousChats)

  useEffect(() => {
    if (!currentTitle && inputValue && message) {
      setCurrentTitle(inputValue);
    }
    if (currentTitle && inputValue && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "user",
            content: inputValue
          }, 
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter((previousChat) => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={ createNewChat }>+ New Chat</button>
        <ul className="history">
          { uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={ () => handleClick(uniqueTitle) }>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Matt Kohn</p>
        </nav>
      </section>
      <section className="main">
        { !currentTitle && <h1>MattKohnGPT</h1> }
        <ul className="feed">
          { currentChat?.map((chatMessage, index) => <li key={index} >
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={ inputValue } onChange={ (e) => setInputValue(e.target.value) } />
            <div id="submit" onClick={ getMessages }>➢</div>
          </div>
          <p className="info">
            ChatGPT Mar 23 Version. Free Research Preview. 
            ChatGPT may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </section>
    </div>
  )
}


export default App
