import express from 'express';

const app = express();
const args = process.argv.slice(2);
const folder = args[0];
const PORT = args[1] || 3000;

app.use(express.static(folder));

/*
app.get('/', (req, res) => {
    res.send('Hello World!');
});
*/

app.listen(PORT, () => console.log(`Server listening on port: ${PORT} and root folder: "${folder}"`));
