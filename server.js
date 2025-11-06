const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

const users = {
    "admin": "1234",
    "user1": "password"
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if(users[username] && users[username] === password){
        res.json({ success: true})
    } else {
        res.json({ success: false});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Server running on port ${PORT}`));