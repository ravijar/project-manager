import React, {useEffect, useRef} from "react";
import "./ChatWindow.css";
import Message from "./Message";
import ChatInfoBar from "./ChatInfoBar";
import FooterBar from "./FooterBar";

const ChatWindow = ({messages, selectedChat, onNewMessage, loadingMessages}) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-window">
            <ChatInfoBar
                avatarSrc={selectedChat && selectedChat.user.photoURL}
                name={selectedChat && selectedChat.user.name}
                loadingMessages={loadingMessages}
            />
            <div className="chat-messages" ref={scrollRef}>
                {messages.map((message, index) => (
                    <div key={index} style={{display: "flex", flexDirection: "column"}}>
                        {index === 0 || messages[index - 1].date !== message.date ? (
                            <div className="date-divider">
                                <span className="date-text">{message.date}</span>
                            </div>
                        ) : null}
                        <Message
                            text={message.text}
                            time={message.time}
                            isSender={message.isSender}
                            isFile={message.isFile}
                        />
                    </div>
                ))}
            </div>
            <FooterBar onSendMessage={onNewMessage} chatId={selectedChat.chatId}/>
        </div>
    );
};

export default ChatWindow;
