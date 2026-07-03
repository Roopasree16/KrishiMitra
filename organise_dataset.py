import os
import shutil
from sklearn.model_selection import train_test_split
from pathlib import Path

# ===== CONFIGURATION =====
# Source: where your extracted data is
source_path = 'dataset/raw'

# Destination: where we'll organize the data
train_path = 'dataset/train'
test_path = 'dataset/test'

# Split ratio (80% train, 20% test)
test_size = 0.2

# ===== START PROCESSING =====
print("="*60)
print("KrishiMitra Dataset Organization")
print("="*60)

# Check if source exists
if not os.path.exists(source_path):
    print(f"\n❌ Error: Source path not found: {source_path}")
    print("\nPlease check:")
    print("1. The path is correct")
    print("2. The dataset was extracted properly")
    exit(1)

print(f"\n✓ Source path found: {source_path}")

# Create destination directories
os.makedirs(train_path, exist_ok=True)
os.makedirs(test_path, exist_ok=True)
print(f"✓ Created train directory: {train_path}")
print(f"✓ Created test directory: {test_path}")

# Get all disease folders from color directory
disease_folders = [f for f in os.listdir(source_path) 
                if os.path.isdir(os.path.join(source_path, f))]

print(f"\n✓ Found {len(disease_folders)} disease categories")
print("\n" + "="*60)
print("Processing each disease category...")
print("="*60 + "\n")

total_train = 0
total_test = 0

# Process each disease category
for idx, disease in enumerate(disease_folders, 1):
    print(f"[{idx}/{len(disease_folders)}] Processing: {disease}")
    
    # Source disease folder path
    disease_source_path = os.path.join(source_path, disease)
    
    # Get all images in this disease folder
    all_files = os.listdir(disease_source_path)
    images = [f for f in all_files 
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.JPG'))]
    
    if len(images) == 0:
        print(f"  ⚠️  No images found in {disease}. Skipping...")
        continue
    
    print(f"  Found {len(images)} images")
    
    # Split into train and test
    train_images, test_images = train_test_split(
        images, 
        test_size=test_size, 
        random_state=42
    )
    
    # Create disease folders in train and test directories
    train_disease_path = os.path.join(train_path, disease)
    test_disease_path = os.path.join(test_path, disease)
    
    os.makedirs(train_disease_path, exist_ok=True)
    os.makedirs(test_disease_path, exist_ok=True)
    
    # Copy training images
    print(f"  Copying {len(train_images)} images to train/")
    for img in train_images:
        src = os.path.join(disease_source_path, img)
        dst = os.path.join(train_disease_path, img)
        shutil.copy2(src, dst)
    
    # Copy test images
    print(f"  Copying {len(test_images)} images to test/")
    for img in test_images:
        src = os.path.join(disease_source_path, img)
        dst = os.path.join(test_disease_path, img)
        shutil.copy2(src, dst)
    
    total_train += len(train_images)
    total_test += len(test_images)
    
    print(f"  ✓ Done: {len(train_images)} train | {len(test_images)} test\n")

# ===== SUMMARY =====
print("="*60)
print("ORGANIZATION COMPLETE!")
print("="*60)
print(f"\n📊 Summary:")
print(f"  Total disease categories: {len(disease_folders)}")
print(f"  Total training images: {total_train}")
print(f"  Total test images: {total_test}")
print(f"  Total images: {total_train + total_test}")
print(f"\n📁 Dataset Structure:")
print(f"  Train: {train_path}")
print(f"  Test: {test_path}")

print("\n" + "="*60)
print("✓ Dataset is ready for training!")
print("="*60)
print("\nNext step: Run 'python train_model.py'")