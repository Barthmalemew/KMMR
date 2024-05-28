import React, { useState } from 'react';
import { fetchMoodImage } from './utils'; // Import fetchMoodImage function

/**
 * Main application component responsible for displaying the mood ring UI.
 *
 * @returns {JSX.Element} - Rendered application.
 */
function App() {
    // State to store the current image path
    const [imagePath, setImagePath] = useState('/base.jpg');

    /**
     * Function to change the image based on the selected mood.
     *
     * @param {string} mood - Mood value ('Happy', 'Okay', or 'Sad').
     * @returns {Promise<void>} - Promise resolving after image update.
     */
    const changeImage = async (mood) => {
        try {
            // Fetch mood image path from the server
            const imagePathWithTimestamp = await fetchMoodImage(mood);
            // Update image path state if image found
            if (imagePathWithTimestamp) {
                setImagePath(imagePathWithTimestamp);
            } else {
                // Handle error or provide fallback behavior
                console.error("Image not found for mood:", mood);
            }
        } catch (error) {
            // Log and handle fetch errors
            console.error("Error fetching mood image:", error);
        }
    };

    // Log the current image path state
    console.log("Current image path state:", imagePath);

    // Render the application UI
    return (
        <div className="App">
            {/* Header section */}
            <div className="header">
                <h1>Kailee's Magic Mood Ring</h1>
            </div>
            {/* Container section */}
            <div className="container">
                {/* Display the mood image */}
                <img id="bannerImage" src={imagePath} alt="Mood Cat Image" /><br />
                {/* Mood buttons container */}
                <div className="button-container">
                    {/* Mood buttons triggering changeImage function */}
                    <button onClick={() => changeImage('happy')}>Happy!</button>
                    <button onClick={() => changeImage('okay')}>Okay!</button>
                    <button onClick={() => changeImage('sad')}>Sad!</button>
                </div>
            </div>
        </div>
    );
}

export default App;
;
