import './SideWindow.css';
import Profile from './profile-section/Profile.jsx';
import ChatList from "./tab-section/chat/ChatList.jsx";
import Tabs from "../common/tab-section/Tabs.jsx";
import Tab from "../common/tab-section/Tab.js";
import AssignmentList from "./tab-section/workspace/AssignmentList.jsx";
import AllAssignments from "./tab-section/all-assignments/AllAssignments.jsx";

const SideWindow = (
    {
        chats,
        loadingChats,
        selectedChat,
        onSelectChat,
        assignmentChats,
        user,
        onSignOut,
        onTabChange,
    }
) => {
    return (
        <div className="side-window">
            <Profile user={user} onSignOut={onSignOut}/>
            <Tabs currentRole={user.role} onTabChange={onTabChange}>
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
                <Tab
                    name="All Assignments"
                    component={
                        <AllAssignments
                            user={user}
                        />
                    }
                />
            </Tabs>
        </div>
    );
};

export default SideWindow;
