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

// Animate buttons and ensure they remain visible
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

// Function to animate the image card
function animateImageCard() {
    gsap.from("#image-card", {
        duration: 0.5,
        scale: 0.8,
        opacity: 0,
        ease: "power2.out",
    });
}

// Function to fetch and display the generated image
async function generateImage(mood) {
    console.log(`Button clicked for mood: ${mood}`);

    try {
        const response = await fetch(`http://localhost:5000/api/image?mood=${mood}`);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        const data = await response.json();

        // Log received data for debugging
        console.log('Data received:', data);

        const imgElement = document.getElementById('generatedImage');

        // Ensure that imageBase64 is available
        if (data.imageBase64) {
            // Update the src attribute with a cache-busting query
            imgElement.src = `data:image/png;base64,${data.imageBase64}?t=${new Date().getTime()}`;

            // Call the animation function
            animateImageCard();
        } else {
            console.error('Image data is not available in the response.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

