import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock } from 'lucide-react';

const CapsuleCard = ({ capsule }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isLocked, setIsLocked] = useState(capsule.status === 'locked');

    // Calculate time left
    useEffect(() => {
        if (!isLocked) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const unlockTime = new Date(capsule.unlockDate).getTime();
            const distance = unlockTime - now;

            if (distance < 0) {
                clearInterval(interval);
                setIsLocked(false);
                setTimeLeft("UNLOCKED");
                // Ideally trigger a refresh here, but for now just show unlocked state visually
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [capsule.unlockDate, isLocked]);

    const dateObj = new Date(capsule.unlockDate);
    const validDate = !isNaN(dateObj.getTime());
    const formattedDate = validDate ? dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString() : 'Invalid Date';

    return (
        <div className="glass-panel capsule-content">
            <div className="capsule-meta">
                <span><Clock size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> created on {new Date(capsule.createdAt || Date.now()).toLocaleDateString()}</span>
                <span className={`status-badge ${isLocked ? 'status-locked' : 'status-unlocked'}`}>
                    {isLocked ? <><Lock size={12} /> LOCKED</> : <><Unlock size={12} /> UNLOCKED</>}
                </span>
            </div>

            <h3>{capsule.title}</h3>

            {isLocked ? (
                <div className="countdown">
                    <p>Unlocks in:</p>
                    {timeLeft || "Calculating..."}
                </div>
            ) : (
                <div className="message-content">
                    <p><strong>Message:</strong></p>
                    <p style={{ fontStyle: 'italic', color: '#fff' }}>{capsule.message}</p>
                </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                Unlock Date: {formattedDate}
            </div>
        </div>
    );
};

export default CapsuleCard;
