import './App.css'
import Chat from './components/Chat'

function App() {

  return (
    <>
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
