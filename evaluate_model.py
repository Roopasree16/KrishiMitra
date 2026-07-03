import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import json

print("=== Loading Model ===")
model = load_model('models/crop_disease_model.h5')

# Load class indices
with open('models/class_indices.json', 'r') as f:
    class_indices = json.load(f)

# Reverse mapping: index -> class name
idx_to_class = {v: k for k, v in class_indices.items()}

print("=== Loading Test Data ===")
test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    'dataset/test',
    target_size=(224, 224),
    batch_size=1,
    class_mode='categorical',
    shuffle=False
)

print("=== Making Predictions ===")
predictions = model.predict(test_generator, verbose=1)
y_pred = np.argmax(predictions, axis=1)
y_true = test_generator.classes

print("\n=== Classification Report ===")
report = classification_report(
    y_true, 
    y_pred, 
    target_names=list(class_indices.keys()),
    digits=3
)
print(report)

# Save report
with open('models/classification_report.txt', 'w') as f:
    f.write(report)

print("\n=== Creating Confusion Matrix ===")
cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(12, 10))
sns.heatmap(
    cm, 
    annot=True, 
    fmt='d', 
    cmap='Blues',
    xticklabels=list(class_indices.keys()),
    yticklabels=list(class_indices.keys())
)
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig('models/confusion_matrix.png', dpi=300)
print("Confusion matrix saved as 'models/confusion_matrix.png'")

# Calculate per-class accuracy
print("\n=== Per-Class Accuracy ===")
class_accuracy = cm.diagonal() / cm.sum(axis=1)
for class_name, accuracy in zip(class_indices.keys(), class_accuracy):
    print(f"{class_name}: {accuracy * 100:.2f}%")

print("\n✓ Evaluation Complete!")