const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 5000;

// Serve static files from the "public" directory located inside "server"
app.use(express.static(path.join(__dirname, 'public'))); // Fixed this path

// Serve static files from the "cat_hopper" directory located inside "server"
app.use('/cat_hopper', express.static(path.join(__dirname, 'cat_hopper')));

// Route to serve the main page (index.html) from the "public" directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')); // Fixed this path
});

// Route to serve the Cat Hopper game (flappyBird.html) from "cat_hopper"
app.get('/cat_hopper', (req, res) => {
    res.sendFile(path.join(__dirname, 'cat_hopper/flappyBird.html')); // Fixed this path
});

// Image generation API
app.get('/api/image', async (req, res) => {
    try {
        const mood = req.query.mood.toLowerCase();
        if (!mood) {
            return res.status(400).json({ error: 'Mood parameter is missing' });
        }

        // Define custom prompts based on the mood
        let prompt = 'A cute cat';  // Default prompt
        if (mood === 'happy') {
            prompt = 'A joyful and playful kitten';
        } else if (mood === 'okay') {
            prompt = 'A calm and content cat';
        } else if (mood === 'sad') {
            prompt = 'A melancholic and thoughtful cat';
        } else if (mood === 'excited') {
            prompt = 'A cat excitedly playing with a ball of yarn';
        } else if (mood === 'angry') {
            prompt = 'An angry cat with fur standing on end';
        } else if (mood === 'relaxed') {
            prompt = 'A cat peacefully sleeping in a sunbeam';
        }

        // Call the Python microservice to generate the image with the custom prompt
        const response = await axios.post('http://localhost:5001/generate', {
            prompt: prompt
        });

        const imageBase64 = response.data.image_base64;

        if (!imageBase64) {
            return res.status(500).json({ error: 'Failed to generate image' });
        }

        // Send the base64 image back to the client
        res.json({ imageBase64 });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server on port 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
