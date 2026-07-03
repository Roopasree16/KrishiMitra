import requests

# Test with a sample image
def test_prediction(image_path):
    url = 'http://localhost:5000/predict'
    
    with open(image_path, 'rb') as img:
        files = {'image': img}
        response = requests.post(url, files=files)
    
    if response.status_code == 200:
        result = response.json()
        print("\n=== Prediction Result ===")
        print(f"Disease: {result['disease']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Severity: {result['severity']}")
        print(f"\nTreatment: {result['treatment']}")
        print(f"\nPrevention: {result['prevention']}")
    else:
        print(f"Error: {response.json()}")

# Test with an image from your test set
test_prediction("../dataset/test/Tomato___Bacterial_spot/0a22f50a-5f25-4cf6-816b-76cae94b7f30___GCREC_Bact.Sp 6103.JPG")