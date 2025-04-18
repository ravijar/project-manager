import './SideWindow.css';
import Profile from './Profile';
import ChatList from "./ChatList.jsx";
import Tabs from "../common/Tabs.jsx";
import Tab from "../common/Tab.js";

const SideWindow = ({chats, onSelectChat, user, onSignOut, loadingChats, selectedChat}) => {
    return (
        <div className="side-window">
            <Profile user={user} onSignOut={onSignOut}/>
            <Tabs>
                <Tab
                    name="Chats"
                    component={
                        <ChatList
                            chats={chats}
                            selectedChat={selectedChat}
                            onSelectChat={onSelectChat}
                            loadingChats={loadingChats}
                            user={user}
                        />
                    }
                />
            </Tabs>
        </div>
    );
};

export default SideWindow;
