'use client'
import {useRef, useState} from "react";
import {SetUsernameModal} from "@/components/SetUsernameModal";
import {Input} from "@/components/ui/input";
import {SettingsIcon, UserIcon} from "lucide-react";
import {HamburgerMenuIcon} from "@radix-ui/react-icons";

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
        socket.current = new WebSocket('ws://localhost:8000')

        socket.current.onopen = () => {
            setConnected(true)
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [...prev, message])
        }
        socket.current.onclose = () => {
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
            {!connected && <SetUsernameModal isOpen={connected} onSubmit={handleUsernameSubmit}/>}
            <div className="h-screen flex flex-col">
                <header className="flex justify-between items-center p-4 bg-zinc-100">
                    <HamburgerMenuIcon/>
                    <div className="flex gap-4">
                        {username}
                        <UserIcon/>
                        <SettingsIcon/>
                    </div>
                </header>
                <div className="flex flex-1">
                    <main className="flex flex-col flex-1">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(mes =>
                                mes.username == username
                                    ? <div key={mes.key} className="flex gap-4 justify-end">
                                        <div>
                                            <div className="flex justify-end font-bold">{mes.username}</div>
                                            <div className="bg-zinc-200 p-2 rounded-md">{mes.message}</div>
                                        </div>
                                        <img
                                            alt="Profile picture"
                                            className="rounded-full object-cover"
                                            height="50"
                                            src="/placeholder.jpg"
                                            width="50"
                                        />
                                    </div>
                                    : <div key={mes.key} className="flex gap-4 justify-start">
                                        <img
                                            alt="Profile picture"
                                            className="rounded-full object-cover"
                                            height="50"
                                            src="/placeholder.jpg"
                                            width="50"
                                        />
                                        <div>
                                            <div className="font-bold">{mes.username}</div>
                                            <div className="bg-zinc-200 p-2 rounded-md">{mes.message}</div>
                                        </div>
                                    </div>
                            )}
                        </div>
                        <div className="border-t p-4 flex items-center gap-4">
                            <Input className="flex-1"
                                   onChange={e => setValue(e.target.value)}
                                   placeholder="Type a message"
                                   value={value}
                                   type="text"/>
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
