import './App.css'
import Chat from './components/Chat'
import { useState } from 'react'
import SearchBar from './components/SearchBar'

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h1>Search Example</h1>
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        <p>Search Term: {searchTerm}</p>
      </div>
      <div style={{width: '400px'}}>
        <Chat
          height={40}
          avatarSrc="https://i.pravatar.cc/150"
          name="John Doe"
        />
        <Chat
          height={40}
          avatarSrc=""
          name="Jane Smith"
        />
      </div>
    </>
  )
}

export default App
