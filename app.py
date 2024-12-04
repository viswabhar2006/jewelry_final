from flask import Flask, request, send_file, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import io
from flask_cors import CORS
import cv2
import os
import time

app = Flask(__name__)
CORS(app, resources={r"/process-image": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# Load GAN model
try:
    generator_model = tf.keras.models.load_model('generator_final1.keras')
    input_size = generator_model.input_shape[1:3]  # Infer input size from the model
except Exception as e:
    raise RuntimeError(f"Failed to load the GAN model: {e}")

# Ensure output directory exists
GENERATED_DIR = 'generated'
os.makedirs(GENERATED_DIR, exist_ok=True)

# Function to convert an image to a pencil sketch
def image_to_sketch(image):
    # Convert to grayscale
    gr = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Invert the grayscale image
    invert = cv2.bitwise_not(gr)

    # Apply Gaussian Blur
    blur = cv2.GaussianBlur(invert, (21, 21), 0)

    # Invert the blurred image
    inverted_blur = cv2.bitwise_not(blur)

    # Create the pencil sketch
    sketch = cv2.divide(gr, inverted_blur, scale=256.0)

    # Sharpen the sketch for more distinct lines
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])  # Sharpening kernel
    sketch = cv2.filter2D(sketch, -1, kernel)

    # Threshold to ensure white background and black sketch lines
    _, sketch = cv2.threshold(sketch, 240, 255, cv2.THRESH_BINARY)

    return sketch

# Image preprocessing function
def preprocess_image(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')  # Ensure RGB
    image = image.resize((512, 512))  # Resize to model input size
    image_array = np.array(image) / 127.5 - 1  # Normalize to [-1, 1]
    return np.expand_dims(image_array, axis=0)

# Image postprocessing function
def postprocess_image(image_array, output_format='JPEG'):
    image_array = ((image_array + 1) * 127.5).astype(np.uint8)  # Scale back to [0, 255]
    image = Image.fromarray(np.squeeze(image_array))  # Remove unnecessary dimensions
    image = image.convert("RGBA") if output_format.upper() == 'PNG' else image.convert("RGB")
    return image

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'imageInput' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        # Retrieve image file and optional format
        image_file = request.files['imageInput']
        output_format = request.form.get('output_format', 'JPEG').upper()

        # Validate format
        if output_format not in ['JPEG', 'PNG', 'WEBP', 'AVIF']:
            return jsonify({'error': 'Unsupported output format. Use JPEG, PNG, WEBP, or AVIF.'}), 400

        # Load image into OpenCV format
        file_bytes = np.asarray(bytearray(image_file.read()), dtype=np.uint8)
        cv_image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if cv_image is None:
            return jsonify({'error': 'Invalid image file.'}), 400

        # Convert the image to a sketch
        sketch_image = image_to_sketch(cv_image)

        # Convert the sketch to PIL for further processing
        sketch_pil = Image.fromarray(sketch_image)

        # Preprocess the sketch for the GAN model
        input_tensor = preprocess_image(sketch_pil)

        # Generate output using GAN model
        output_tensor = generator_model.predict(input_tensor)
        output_image = postprocess_image(output_tensor[0], output_format)

        # Save generated image with a unique filename
        output_filename = os.path.join(GENERATED_DIR, f"generated_{int(time.time())}.{output_format.lower()}")
        output_image.save(output_filename, format=output_format)

        # Save image to buffer for response
        image_io = io.BytesIO()
        output_image.save(image_io, format=output_format)
        image_io.seek(0)

        return send_file(image_io, mimetype=f'image/{output_format.lower()}')
    except Exception as e:
        return jsonify({'error': f'An internal error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(port=5000)
