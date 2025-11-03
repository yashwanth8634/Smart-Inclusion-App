
const express = require('express');
const cors = require('cors');


const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
})); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Hello from the Smart Inclusion Server!');
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});