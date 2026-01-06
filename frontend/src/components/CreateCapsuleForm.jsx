import React, { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

const CreateCapsuleForm = ({ onCapsuleCreated }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [unlockDate, setUnlockDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dateObj = new Date(unlockDate);
        if (isNaN(dateObj.getTime())) {
            alert("Invalid date selected. Please try again.");
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/capsules', {
                title,
                message,
                unlockDate: dateObj.toISOString()
            });
            // Reset form
            setTitle('');
            setMessage('');
            setUnlockDate('');
            // Notify parent
            if (onCapsuleCreated) onCapsuleCreated();
        } catch (error) {
            console.error("Error creating capsule:", error);
            alert("Failed to create capsule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel">
            <h2>Create New Time Capsule</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Capsule Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. My Future Predictions"
                        required
                    />
                </div>
                <div>
                    <label>Secret Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write something for the future..."
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label>Unlock Date & Time</label>
                    <input
                        type="datetime-local"
                        value={unlockDate}
                        onChange={(e) => setUnlockDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Sealing...' : <><Send size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Seal Capsule</>}
                </button>
            </form>
        </div>
    );
};

export default CreateCapsuleForm;
