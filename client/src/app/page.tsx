'use client'
import {useRef, useState} from "react";
import { SetUsernameModal } from "@/components/SetUsernameModal";
import {Input} from "@/components/ui/input";

interface IMessage {
    key: string
    type: string
    username: string
    message: string
}

export default function Home() {
    const [username, setUsername] = useState("");
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const socket = useRef<WebSocket>()
    const [connected, setConnected] = useState(false);

    function connect() {
        socket.current = new WebSocket('ws://localhost:8000/ws')

        socket.current.onopen = () => {
            setConnected(true)
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [...prev, message])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async () => {
        if (value) {
            const message: { message: string; username: string } = {
                username: username,
                message: value,
            }
            if (!socket.current) return;
            socket.current.send(JSON.stringify(message));
            setValue('')
        } else return
    }

    const handleUsernameSubmit = (enteredUsername: string) => {
        setUsername(enteredUsername);
        connect();
    };

    return (
        <>
            {!connected && <SetUsernameModal isOpen={connected} onSubmit={handleUsernameSubmit} />}
            <div className="h-screen flex flex-col">
                <header className="flex justify-between items-center p-4 bg-zinc-100">
                    <svg
                        className=" h-6 w-6"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
                    </svg>
                    <div className="flex gap-4">
                        {username}
                        <svg
                            className=" h-6 w-6"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <svg
                            className=" h-6 w-6"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                </header>
                <div className="flex flex-1">
                    <main className="flex flex-col flex-1">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(mes =>
                                <div key={mes.key} className="flex items-start gap-4">
                                    <img
                                        alt="Profile picture"
                                        className="rounded-full object-cover"
                                        height="40"
                                        src="/placeholder.jpg"
                                        width="40"
                                    />
                                    <div>
                                        <div className="font-bold">{mes.username}</div>
                                        <div className="bg-zinc-200 p-2 rounded-md">{mes.message}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="border-t p-4 flex items-center gap-4">
                            <svg
                                className=" h-6 w-6"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            <Input className="flex-1" onChange={e => setValue(e.target.value)} placeholder="Type a message" type="text"/>
                           <button onClick={sendMessage}>
                               Отправить
                           </button>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
