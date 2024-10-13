// Animate the title with GSAP
gsap.from("h1", {
    duration: 1.5,
    opacity: 0,
    y: -100,
    ease: "bounce.out"
});

// Animate the image card with GSAP
gsap.from("#image-card", {
    duration: 1,
    opacity: 0,
    scale: 0.8,
    ease: "power2.out",
    delay: 0.5
});

// Animate buttons with staggered appearance using GSAP
gsap.fromTo(".button-container button",
    {
        opacity: 0,    // Start at opacity 0
        y: 50          // Start with buttons below
    },
    {
        duration: 1,
        opacity: 1,    // Fade to opacity 1
        y: 0,          // Move to final position
        stagger: 0.2,  // Staggered appearance of each button
        ease: "back.out(1.7)",
        delay: 0.7     // Start after the image card animation
    }
);

// Hover effects for buttons using GSAP
document.querySelectorAll(".button-container button").forEach(button => {
    button.addEventListener("mouseenter", () => {
        gsap.to(button, {
            scale: 1.1,    // Scale up on hover
            duration: 0.2,
            ease: "power2.out"
        });
    });

    button.addEventListener("mouseleave", () => {
        gsap.to(button, {
            scale: 1,      // Scale back to normal on leave
            duration: 0.2,
            ease: "power2.out"
        });
    });
});

// Function to fetch and display the generated image based on mood
async function generateImage(mood) {
    console.log(`Button clicked for mood: ${mood}`); // Log the clicked mood for debugging

    try {
        const response = await fetch(`http://localhost:5000/api/image?mood=${mood}`); // Make request to Express server
        if (!response.ok) {
            throw new Error('Failed to fetch image'); // Handle fetch failure
        }

        const data = await response.json(); // Get JSON response from Express server
        const imgElement = document.getElementById('generatedImage');

        // Display the fetched image
        imgElement.src = `data:image/png;base64,${data.imageBase64}`; // Set the image source to the received data

        // Optionally, you could animate the image card again if desired
        animateImageCard();

    } catch (error) {
        console.error('Error:', error); // Log any errors encountered
    }
}

// Function to animate the image card when a new image is loaded
function animateImageCard() {
    gsap.from("#image-card", {
        duration: 0.5,
        scale: 0.8,
        opacity: 0,
        ease: "power2.out",
    });
}


