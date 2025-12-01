const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function loadUsers() {
    return JSON.parse(fs.readFileSync('users.json', 'utf8')).users;
}

function saveUsers(users) {
    fs.writeFileSync('users.json', JSON.stringify({ users}, null, 2));
}

app.post('/create', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const exists = users.find(u => u.username === username);

    if (exists) {
        return res.json({ success: false, message: 'Username already taken' });
    }

    users.push({ username, password });
    saveUsers(users);

    res.json({ success:true });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const validUser = users.find(u => u.username === username && u.password === password);

    if (validUser) {
        return res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
