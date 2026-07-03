from flask import Flask, request, jsonify
from flask_cors import CORS
from tf_keras.models import load_model
import numpy as np
from PIL import Image
import io
import json
import os

app = Flask(__name__)
CORS(app)

print("="*60)
print("KrishiMitra Backend - Starting...")
print("="*60)

# Get absolute path to project root
# Since this file is in backend/, go up one level
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_disease_model.h5')
CLASS_INDICES_PATH = os.path.join(BASE_DIR, 'models', 'class_indices.json')

print(f"\nProject root: {BASE_DIR}")
print(f"Model path: {MODEL_PATH}")
print(f"Class indices path: {CLASS_INDICES_PATH}")

# Check if files exist
if not os.path.exists(MODEL_PATH):
    print(f"\n❌ ERROR: Model file not found at {MODEL_PATH}")
    print("\nPlease check:")
    print("1. The model file exists in the models/ directory")
    print("2. The file is named exactly 'crop_disease_model.h5'")
    print("3. You're running this script from the correct directory")
    exit(1)

if not os.path.exists(CLASS_INDICES_PATH):
    print(f"\n❌ ERROR: Class indices file not found at {CLASS_INDICES_PATH}")
    exit(1)

print("\n✓ All required files found")

# Load model
print("\nLoading model...")
try:
    model = load_model(MODEL_PATH)
    print("✓ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {str(e)}")
    exit(1)

# Load class indices
print("Loading class indices...")
try:
    with open(CLASS_INDICES_PATH, 'r') as f:
        class_indices = json.load(f)
    
    # Reverse mapping: index -> class name
    idx_to_class = {v: k for k, v in class_indices.items()}
    print(f"✓ Loaded {len(class_indices)} classes")
except Exception as e:
    print(f"❌ Error loading class indices: {str(e)}")
    exit(1)

# Load disease information
DISEASE_INFO_PATH = os.path.join(BASE_DIR, 'backend', 'disease_info.json')

if os.path.exists(DISEASE_INFO_PATH):
    print("Loading disease information...")
    with open(DISEASE_INFO_PATH, 'r',encoding='utf-8') as f:
        disease_info = json.load(f)
    print(f"✓ Loaded information for {len(disease_info)} diseases")
else:
    print("⚠️  Warning: disease_info.json not found. Using default responses.")
    disease_info = {}

def preprocess_image(image_bytes):
    """Preprocess uploaded image for model prediction"""
    try:
        # Open image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        img = img.resize((224, 224))
        
        # Convert to array and normalize
        img_array = np.array(img) / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

@app.route('/')
def home():
    return jsonify({
        'message': 'KrishiMitra Crop Disease Detection API',
        'version': '1.0',
        'status': 'running',
        'model_loaded': True,
        'num_classes': len(class_indices)
    })

@app.route('/predict', methods=['POST'])
def predict_disease():
    try:
        language = request.form.get('language', 'en')
        
        print(f"\n=== DEBUG INFO ===")
        print(f"Received language parameter: '{language}'")
        print(f"Form data keys: {list(request.form.keys())}")
        print(f"==================\n")
        


        # Validate language
        supported_languages = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'mr', 'bn', 'gu']
        if language not in supported_languages:
            language = 'en'  # Fallback to English
        
        # ... rest of your existing code for image processing ...
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Check if file is empty
        if image_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        print(f"\nReceived image: {image_file.filename}")
        
        # Read image bytes
        image_bytes = image_file.read()
        print(f"Image size: {len(image_bytes)} bytes")
        
        # Preprocess image
        print("Preprocessing image...")
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        print("Making prediction...")
        predictions = model.predict(processed_image, verbose=0)
        
        # Get top prediction
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        print(f"Predicted class index: {class_idx}")
        print(f"Confidence: {confidence * 100:.2f}%")
        
        # Get disease name
        disease_key = idx_to_class[class_idx]
        print(f"Disease: {disease_key}")
        
        # Get disease information
        if disease_key in disease_info:
            disease_translations = disease_info[disease_key]
            if language in disease_translations:
                disease_data = disease_translations[language]
            else:
        # Fallback to English if translation not available
                disease_data = disease_translations.get('en', {
                    'name': disease_key.replace('___', ' - ').replace('_', ' '),
                    'treatment': 'Translation not available. Consult agricultural expert.',
                    'prevention': 'Standard practices recommended.',
                    'severity': 'unknown'
                })
        else:
            # Default response if disease info not found
            disease_data = {
                'name': disease_key.replace('___', ' - ').replace('_', ' '),
                'treatment': 'Consult an agricultural expert for specific treatment recommendations.',
                'prevention': 'Follow standard crop management practices and monitor plants regularly.',
                'severity': 'unknown'
            }
        
        # Get top 3 predictions for additional info
        top_3_idx = np.argsort(predictions[0])[-3:][::-1]
        alternative_predictions = []
        for idx in top_3_idx[1:]:  # Skip the first (already shown)
            alt_disease_key = idx_to_class[idx]
            alternative_predictions.append({
                'disease': alt_disease_key.replace('___', ' - ').replace('_', ' '),
                'confidence': f'{float(predictions[0][idx]) * 100:.1f}%'
            })
        
        # Prepare response
        response = {
            'success': True,
            'disease': disease_data['name'],
            'confidence': f'{confidence * 100:.2f}%',
            'confidence_score': confidence,
            'severity': disease_data.get('severity', 'unknown'),
            'treatment': disease_data['treatment'],
            'prevention': disease_data['prevention'],
            'organic_treatment': disease_data.get('organic_treatment', 'Not available'),
            'recommended_insecticide_pesticide': disease_data.get('recommended_insecticide_pesticide', 'Not available'),
            'alternative_predictions': alternative_predictions
        }
        
        print("✓ Prediction successful\n")
        return jsonify(response)
    
    except ValueError as ve:
        print(f"❌ Value Error: {str(ve)}\n")
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'num_classes': len(class_indices)
    })

@app.route('/classes', methods=['GET'])
def get_classes():
    """Return all available disease classes"""
    classes_list = [key.replace('___', ' - ').replace('_', ' ') for key in class_indices.keys()]
    return jsonify({
        'classes': sorted(classes_list),
        'count': len(classes_list)
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("KrishiMitra Backend API Ready!")
    print("="*60)
    print(f"Model classes: {len(class_indices)}")
    print(f"Diseases in database: {len(disease_info)}")
    print("="*60)
    print("\nAPI Endpoints:")
    print("  GET  /          - API info")
    print("  POST /predict   - Predict disease from image")
    print("  GET  /health    - Health check")
    print("  GET  /classes   - List all classes")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)