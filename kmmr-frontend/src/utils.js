/**
 * Asynchronous function to fetch the mood image path from the server based on the provided mood.
 *
 * @param {string} mood - The mood value ('Happy', 'Okay', or 'Sad').
 * @returns {Promise<string|null>} - A promise resolving with the mood image path or null if no image found.
 */
export async function fetchMoodImage(mood) {
    try {
        // Fetch the mood image path from the server using the provided mood
        const response = await fetch(`http://localhost:7000/database.php?mood=${mood}`);

        // Check if the network response is ok
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the mood image path with timestamp if available, otherwise return null
        return data.imagePath ? `http://localhost:7000/${data.imagePath}?t=${new Date().getTime()}` : null;
    } catch (error) {
        // Log and handle errors that occur during the fetch operation
        console.error("Error fetching image:", error);
        return null; // Return null in case of error
    }
}
