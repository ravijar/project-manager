import './SideWindow.css';
import Profile from './Profile';
import ChatList from "./ChatList.jsx";
import Tabs from "../common/Tabs.jsx";
import Tab from "../common/Tab.js";
import AssignmentList from "./AssignmentList.jsx";

const SideWindow = (
    {
        chats,
        loadingChats,
        selectedChat,
        onSelectChat,
        assignmentChats,
        user,
        onSignOut,
    }
) => {
    return (
        <div className="side-window">
            <Profile user={user} onSignOut={onSignOut}/>
            <Tabs currentRole={user.role}>
                <Tab
                    name="Workspace"
                    component={
                        <AssignmentList
                            assignmentChats={assignmentChats}
                            loading={loadingChats}
                            selectedAssignmentChat={selectedChat}
                            onSelectAssignmentChat={onSelectChat}
                            user={user}
                        />
                    }
                />
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
