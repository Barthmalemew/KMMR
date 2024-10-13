const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); // Import path for serving files

// Initialize the Express app
const app = express();
const port = 5000;

// Use CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from 'public' folder within 'server'

// Serve the HTML file for the main interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html
});

// Define your API route for image generation
app.get('/api/image', async (req, res) => {
    const mood = req.query.mood; // Get the mood from query parameters

    // Check if mood is provided
    if (!mood) {
        return res.status(200).json({ message: 'Mood parameter is not provided, please select a mood.' });
    }

    try {
        // Normalize the mood to lower case
        const normalizedMood = mood.toLowerCase();

        // Define custom prompts based on the mood
        let prompt = 'A cute cat';  // Default prompt
        switch (normalizedMood) {
            case 'happy':
                prompt = 'A joyful and playful kitten';
                break;
            case 'okay':
                prompt = 'A calm and content cat';
                break;
            case 'sad':
                prompt = 'A melancholic and thoughtful cat';
                break;
            case 'excited':
                prompt = 'A cat excitedly playing with a ball of yarn';
                break;
            case 'angry':
                prompt = 'An angry cat with fur standing on end';
                break;
            case 'relaxed':
                prompt = 'A cat peacefully sleeping in a sunbeam';
                break;
            default:
                return res.status(400).json({ error: 'Invalid mood parameter' });
        }

        // Call the Flask microservice to generate the image with the custom prompt
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
        console.error('Error generating image:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
