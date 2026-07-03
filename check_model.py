import os

print("Checking for model files...\n")

# Check models directory
models_dir = 'models'
if os.path.exists(models_dir):
    print(f"✓ Models directory exists: {os.path.abspath(models_dir)}")
    
    # List all files in models directory
    files = os.listdir(models_dir)
    print(f"\nFiles in models directory:")
    for file in files:
        file_path = os.path.join(models_dir, file)
        file_size = os.path.getsize(file_path) / (1024 * 1024)  # Size in MB
        print(f"  • {file} ({file_size:.2f} MB)")
    
    # Check for specific model file
    model_path = os.path.join(models_dir, 'crop_disease_model.h5')
    if os.path.exists(model_path):
        print(f"\n✓ Model file found: {os.path.abspath(model_path)}")
        print(f"  Size: {os.path.getsize(model_path) / (1024 * 1024):.2f} MB")
    else:
        print(f"\n❌ Model file NOT found: {model_path}")
else:
    print(f"❌ Models directory NOT found: {models_dir}")

# Check from backend directory perspective
print("\n" + "="*60)
print("Checking paths from backend directory:")
print("="*60)

backend_dir = 'backend'
if os.path.exists(backend_dir):
    # Check relative path from backend
    relative_model_path = os.path.join('..', 'models', 'crop_disease_model.h5')
    absolute_from_backend = os.path.abspath(relative_model_path)
    
    print(f"\nRelative path from backend: {relative_model_path}")
    print(f"Resolves to: {absolute_from_backend}")
    print(f"Exists: {os.path.exists(relative_model_path)}")