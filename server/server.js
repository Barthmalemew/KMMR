const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 5000;

// Serve static files from the "public" directory located inside "server"
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "cat_hopper" directory
app.use('/cat_hopper', express.static(path.join(__dirname, 'cat_hopper')));

// Serve static files from the "otter_cleanup" directory
app.use('/otter_cleanup', express.static(path.join(__dirname, 'otter_cleanup')));

// Route to serve the main page (index.html) from the "public" directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to serve the Cat Hopper game
app.get('/cat_hopper', (req, res) => {
    res.sendFile(path.join(__dirname, 'cat_hopper/flappyBird.html'));
});

// Route to serve the Otter Cleanup game
app.get('/otter_cleanup', (req, res) => {
    res.sendFile(path.join(__dirname, 'otter_cleanup/otterCleanup.html'));
});

// Image generation API
app.get('/api/image', async (req, res) => {
    try {
        const mood = req.query.mood.toLowerCase();
        if (!mood) {
            return res.status(400).json({ error: 'Mood parameter is missing' });
        }

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

        const response = await axios.post('http://localhost:5001/generate', {
            prompt: prompt
        });

        const imageBase64 = response.data.image_base64;
        if (!imageBase64) {
            return res.status(500).json({ error: 'Failed to generate image' });
        }

        res.json({ imageBase64 });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
