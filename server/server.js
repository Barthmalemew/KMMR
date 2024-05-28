const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Allow cross-origin requests from any origin
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Database connection parameters
const pool = new Pool({
    user: 'postgres', // PostgreSQL username
    host: 'localhost',    // Server hostname
    database: 'mood_cat', // Database name
    password: '832506', // PostgreSQL password
    port: 5432,           // PostgreSQL port
});

/**
 * Fetches a random image path for a specific mood from the database.
 *
 * @param {Pool} pool - PostgreSQL connection pool.
 * @param {string} mood - Mood for which to fetch the image path.
 * @return {Promise<string|null>} - Random image path for the specified mood, or null if not found.
 */
async function getRandomImagePathForMood(pool, mood) {
    const sql = "SELECT filename FROM " + mood + " ORDER BY RANDOM() LIMIT 1";

    try {
        const result = await pool.query(sql);
        const row = result.rows[0];
        return row ? row.filename : null;
    } catch (err) {
        console.error("Error executing query", err);
        return null;
    }
}

// Route to handle requests for a random image based on mood
app.get('/image', async (req, res) => {
    const mood = req.query.mood;
    if (mood) {
        const imagePath = await getRandomImagePathForMood(pool, mood);
        if (imagePath) {
            res.json({ imagePath: imagePath });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } else {
        res.status(400).json({ error: 'Mood not specified' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
