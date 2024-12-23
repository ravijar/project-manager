import ChatList from './components/ChatList';
import './App.css';

const App = () => {
  const chats = [
    { id: 1, name: 'John Doe', avatarSrc: 'https://i.pravatar.cc/50?img=1' },
    { id: 2, name: 'Jane Smith', avatarSrc: 'https://i.pravatar.cc/50?img=2' },
    { id: 3, name: 'Alice Johnson', avatarSrc: 'https://i.pravatar.cc/50?img=3' },
    { id: 4, name: 'Bob Brown', avatarSrc: 'https://i.pravatar.cc/50?img=4' },
    { id: 5, name: 'Charlie Davis', avatarSrc: 'https://i.pravatar.cc/50?img=5' },
    { id: 6, name: 'Emily Wilson', avatarSrc: 'https://i.pravatar.cc/50?img=6' },
    { id: 7, name: 'George Miller', avatarSrc: 'https://i.pravatar.cc/50?img=7' },
    { id: 8, name: 'Hannah Moore', avatarSrc: 'https://i.pravatar.cc/50?img=8' },
    { id: 9, name: 'Ian Taylor', avatarSrc: 'https://i.pravatar.cc/50?img=9' },
    { id: 10, name: 'Jessica Thomas', avatarSrc: 'https://i.pravatar.cc/50?img=10' },
    { id: 11, name: 'Kevin Harris', avatarSrc: 'https://i.pravatar.cc/50?img=11' },
    { id: 12, name: 'Laura Clark', avatarSrc: 'https://i.pravatar.cc/50?img=12' },
    { id: 13, name: 'Michael Lee', avatarSrc: 'https://i.pravatar.cc/50?img=13' },
    { id: 14, name: 'Natalie White', avatarSrc: 'https://i.pravatar.cc/50?img=14' },
    { id: 15, name: 'Oliver King', avatarSrc: 'https://i.pravatar.cc/50?img=15' },
    { id: 16, name: 'Penelope Adams', avatarSrc: 'https://i.pravatar.cc/50?img=16' },
    { id: 17, name: 'Quinn Baker', avatarSrc: 'https://i.pravatar.cc/50?img=17' },
    { id: 18, name: 'Rachel Carter', avatarSrc: 'https://i.pravatar.cc/50?img=18' },
    { id: 19, name: 'Samuel Scott', avatarSrc: 'https://i.pravatar.cc/50?img=19' },
    { id: 20, name: 'Taylor Young', avatarSrc: 'https://i.pravatar.cc/50?img=20' },
  ];

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <ChatList chats={chats} />
    </div>
  );
};

export default App;
