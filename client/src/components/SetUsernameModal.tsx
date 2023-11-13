import React, {FC, useState} from 'react';
import { createPortal } from 'react-dom';

interface SetUsernameModalProps {
    isOpen: boolean;
    onSubmit: (username: string) => void;
}

export const SetUsernameModal: FC<SetUsernameModalProps> = ({ isOpen, onSubmit }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = () => {
        if (username) {
            onSubmit(username);
        }
    };

    return createPortal(
        <div className="fixed bg-black bg-opacity-50 backdrop-blur inset-0 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-2xl font-bold mb-4">Enter your username</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded-md mb-4"
                />
                <button
                    onClick={handleSubmit}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Submit
                </button>
            </div>
        </div>,
        document.body
    );
}