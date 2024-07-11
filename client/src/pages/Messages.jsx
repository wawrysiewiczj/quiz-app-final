import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import SkeletonMessage from "../components/SkeletonMessage";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Field, Input } from "@headlessui/react";

const Messages = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      _id: "message1",
      senderId: "user1",
      senderUsername: "User One",
      senderPhoto: "path/to/photo1.jpg",
      message: "Hello there!",
      createdAt: "2023-07-10T10:00:00Z",
    },
    {
      _id: "message2",
      senderId: currentUser ? currentUser._id : "currentUserId",
      senderUsername: currentUser ? currentUser.username : "currentUsername",
      senderPhoto: "path/to/photo2.jpg",
      message: "Hi! How are you?",
      createdAt: "2023-07-10T10:01:00Z",
    },
  ]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return; // Do not send empty messages

    const newMsg = {
      _id: `message${messages.length + 1}`,
      senderId: currentUser._id,
      senderUsername: currentUser.username,
      senderPhoto: "path/to/photo.jpg", // placeholder path, update as needed
      message: newMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  if (loading) {
    return (
      <div>
        <SkeletonMessage isSender={false} />
        <SkeletonMessage isSender={true} />
        <SkeletonMessage isSender={false} />
        <SkeletonMessage isSender={false} />
        <SkeletonMessage isSender={true} />
        <SkeletonMessage isSender={false} />
      </div>
    );
  }

  return (
    <div className="h-full w-full fixed top-14 left-0 pb-44 ">
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        <div className="h-full">
          <div
            className="h-full animate duration-300 overflow-y-scroll"
            ref={messageContainerRef}
          >
            <div className="flex justify-center items-start py-8">
              <h2>Chat for everyone</h2>
            </div>
            {messages.length > 0 ? (
              messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                  className={`flex items-end gap-1 mb-1 px-4 ${
                    message.senderId === currentUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.senderId !== currentUser._id && (
                    <img
                      className="w-6 h-6 rounded-full object-cover object-center"
                      src={message.senderPhoto}
                      alt={`${message.senderUsername}'s profile`}
                    />
                  )}

                  <div
                    className={`flex flex-col max-w-xs  ${
                      message.senderId === currentUser._id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <h3
                      className={`text-xs text-gray-500 mb-0.5 ${
                        message.senderId === currentUser._id ? " me-3" : " ms-3"
                      }`}
                    >
                      {message.senderUsername}
                    </h3>
                    <p
                      className={`text-md rounded-2xl px-3 py-2  ${
                        message.senderId === currentUser._id
                          ? "bg-blue-300 text-gray-800 dark:bg-blue-500 dark:text-gray-100 self-end "
                          : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      }`}
                    >
                      {message.message}
                    </p>
                    <p
                      className={`text-xs text-gray-500 hidden ${
                        message.senderId === currentUser._id ? " me-2" : " ms-2"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center">No messages found.</p>
            )}
          </div>
          <div className="flex px-4 w-full left-0 fixed bottom-16">
            <form onSubmit={handleSubmit} className="w-full">
              <Field className="max-w-3xl mx-auto w-full flex gap-2">
                <Input
                  type="text"
                  className={clsx(
                    "block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500"
                  )}
                  placeholder="Aa"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="flex justify-center items-center bg-violet-600 text-white px-3.5 py-2.5 rounded-xl shadow hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PaperAirplaneIcon className="w-5 h-5 inline" />
                </button>
              </Field>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
