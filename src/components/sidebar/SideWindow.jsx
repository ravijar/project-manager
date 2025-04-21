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
        assignments,
        loadingAssignments,
        selectedAssignment,
        onSelectAssignment,
        assignmentStatus,
        setAssignmentStatus,
        user,
        onSignOut,
    }
) => {
    return (
        <div className="side-window">
            <Profile user={user} onSignOut={onSignOut}/>
            <Tabs currentRole={user.role}>
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
                    roles={["admin"]}
                />
                <Tab
                    name="Workspace"
                    component={
                        <AssignmentList
                            assignments={assignments}
                            loading={loadingAssignments}
                            selectedAssignmentId={selectedAssignment}
                            onSelectAssignment={onSelectAssignment}
                            selectedStatus={assignmentStatus}
                            setSelectedStatus={setAssignmentStatus}
                            user={user}
                        />
                    }
                />
            </Tabs>
        </div>
    );
};

export default SideWindow;
