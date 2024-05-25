<?php
// Allow cross-origin requests from any origin
header("Access-Control-Allow-Origin: *");

// Database connection parameters
$servername = "localhost"; // Server hostname
$username = "root"; // MySQL username
$password = "832506"; // MySQL password
$dbname = "mood_cats"; // Database name

// Establish a new MySQLi database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

/**
 * Fetches a random image path for a specific mood from the database.
 *
 * @param mysqli $conn - MySQLi database connection object.
 * @param string $mood - Mood for which to fetch the image path.
 * @return string|null - Random image path for the specified mood, or null if not found.
 */
function getRandomImagePathForMood($conn, $mood) {
    // SQL query to select a random image path for the given mood
    $sql = "SELECT filename FROM images WHERE mood = ? ORDER BY RAND() LIMIT 1";

    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Error preparing statement: " . $conn->error);
    }

    // Bind the mood parameter to the SQL statement
    $stmt->bind_param("s", $mood);

    // Execute the SQL statement
    if (!$stmt->execute()) {
        die("Error executing statement: " . $stmt->error);
    }

    // Get the result set from the executed statement
    $result = $stmt->get_result();
    if (!$result) {
        die("Error getting result set: " . $stmt->error);
    }

    // Fetch the row from the result set
    $row = $result->fetch_assoc();

    // Extract the image path from the row (or set it to null if not found)
    $imagePath = $row['filename'] ?? null;

    return $imagePath;
}

// Check if the 'mood' parameter is set in the request
if (isset($_GET['mood'])) {
    $mood = $_GET['mood']; // Get the value of the 'mood' parameter
    $imagePath = getRandomImagePathForMood($conn, $mood); // Fetch a random image path for the specified mood
    echo json_encode(['imagePath' => $imagePath]); // Output the image path as JSON
} else {
    echo json_encode(['error' => 'Mood not specified']); // Output an error message if the 'mood' parameter is not set
}

// Close the database connection
$conn->close(); // Close the MySQLi connection
?>
