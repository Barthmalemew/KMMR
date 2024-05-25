import React from 'react';

/**
 * Functional component representing mood buttons.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.changeImage - Function to change the image based on mood.
 * @returns {JSX.Element} - Rendered mood buttons.
 */
function MoodButtons({ changeImage }) {
    /**
     * Handles click event on mood buttons and calls the changeImage function with the corresponding mood.
     *
     * @param {string} mood - Mood value ('Happy', 'Okay', or 'Sad').
     */
    const handleClick = (mood) => {
        changeImage(mood);
    };

    return (
        <div className="button-container">
            {/* Button for Happy mood */}
            <button onClick={() => handleClick('Happy')}>Happy!</button>

            {/* Button for Okay mood */}
            <button onClick={() => handleClick('Okay')}>Okay!</button>

            {/* Button for Sad mood */}
            <button onClick={() => handleClick('Sad')}>Sad!</button>
        </div>
    );
}

export default MoodButtons;
