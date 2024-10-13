from flask import Flask, request, jsonify
from diffusers import StableDiffusionPipeline
import torch
import io
import base64

app = Flask(__name__)

if torch.cuda.is_available():  # For ROCm support on AMD GPUs
    device = "cuda"
elif torch.backends.mps.is_available():  # For macOS M1/M2 devices, in case you're using them
    device = "mps"
else:
    device = "cpu"

# Load the Stable Diffusion model
model = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4").to("cpu")  # Use "cuda" if GPU is available

@app.route('/generate', methods=['POST'])
def generate_image():
    try:
        # Get the prompt from the request
        data = request.json
        prompt = data.get('prompt', 'A cute cat')

        print(f"Generating image for prompt: {prompt}")

        # Generate the image
        with torch.no_grad():
            image = model(prompt).images[0]

        # Save image to in-memory buffer
        img_io = io.BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)

        print("Image generated successfully.")

        # Encode the image to base64
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

        # Return the base64 encoded image in the response
        return jsonify({"image_base64": img_base64})
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
