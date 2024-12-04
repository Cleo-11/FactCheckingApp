const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // Serve static files from 'public' folder

// Define the route for classification
app.post('/classify', (req, res) => {
    const inputText = req.body.text;  // Text input from the request body

    // Check if input text exists
    if (!inputText) {
        return res.status(400).json({ error: 'No input text provided' });
    }

    // Spawn a Python process to run the classify.py script
    const pythonProcess = spawn('python', ['classify.py']);

    let prediction = '';
    let errorOccurred = false;

    // Write input text to Python's stdin
    pythonProcess.stdin.write(inputText + '\n');
    pythonProcess.stdin.end();

    // Collect output data from Python script
    pythonProcess.stdout.on('data', (data) => {
        prediction += data.toString();
    });

    // Handle errors from the Python process
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
        if (!errorOccurred) {
            errorOccurred = true;
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
        if (!errorOccurred) {
            if (code === 0) {
                res.json({ prediction: prediction.trim() });
            } else {
                res.status(500).json({ error: 'Error in classification process' });
            }
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
