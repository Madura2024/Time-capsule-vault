const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to read database
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

// Helper to write database
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// GET /api/capsules
app.get('/api/capsules', (req, res) => {
    const capsules = readDB();
    const now = new Date().getTime();

    const result = capsules.map(capsule => {
        const unlockTime = new Date(capsule.unlockDate).getTime();
        if (now < unlockTime) {
            return {
                id: capsule.id,
                title: capsule.title,
                unlockDate: capsule.unlockDate,
                status: 'locked',
                message: 'This message is locked until ' + capsule.unlockDate
            };
        } else {
            return {
                ...capsule,
                status: 'unlocked'
            };
        }
    });

    res.json(result);
});

// POST /api/capsules
app.post('/api/capsules', (req, res) => {
    const { title, message, unlockDate } = req.body;
    console.log('Received capsule request:', { title, message, unlockDate });

    if (!title || !message || !unlockDate) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    // Validate date
    const dateCheck = new Date(unlockDate);
    if (isNaN(dateCheck.getTime())) {
        return res.status(400).json({ error: 'Invalid unlockDate format' });
    }

    const capsules = readDB();
    const newCapsule = {
        id: Date.now().toString(),
        title,
        message,
        unlockDate,
        createdAt: new Date().toISOString()
    };

    capsules.push(newCapsule);
    writeDB(capsules);

    res.status(201).json(newCapsule);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
