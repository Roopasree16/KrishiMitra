import os

def verify_organized_dataset():
    """Verify the organized train/test split"""
    
    print("="*60)
    print("Verifying Organized Dataset")
    print("="*60 + "\n")
    
    # Check if directories exist
    train_path = 'dataset/train'
    test_path = 'dataset/test'
    
    if not os.path.exists(train_path):
        print(f"❌ Train directory not found: {train_path}")
        return False
    
    if not os.path.exists(test_path):
        print(f"❌ Test directory not found: {test_path}")
        return False
    
    print(f"✓ Train directory exists: {train_path}")
    print(f"✓ Test directory exists: {test_path}\n")
    
    # Get disease categories from train
    train_classes = sorted([d for d in os.listdir(train_path) 
                        if os.path.isdir(os.path.join(train_path, d))])
    
    # Get disease categories from test
    test_classes = sorted([d for d in os.listdir(test_path) 
                        if os.path.isdir(os.path.join(test_path, d))])
    
    print(f"Train classes: {len(train_classes)}")
    print(f"Test classes: {len(test_classes)}")
    
    # Check if train and test have same classes
    if train_classes != test_classes:
        print("\n⚠️  Warning: Train and test have different classes!")
        missing_in_test = set(train_classes) - set(test_classes)
        missing_in_train = set(test_classes) - set(train_classes)
        
        if missing_in_test:
            print(f"Missing in test: {missing_in_test}")
        if missing_in_train:
            print(f"Missing in train: {missing_in_train}")
    else:
        print("✓ Train and test have matching classes\n")
    
    # Count images in each class
    print("="*60)
    print("Class Distribution:")
    print("="*60)
    print(f"{'Class Name':<40} {'Train':<10} {'Test':<10}")
    print("-"*60)
    
    total_train = 0
    total_test = 0
    
    for disease_class in train_classes[:10]:  # Show first 10
        # Count train images
        train_class_path = os.path.join(train_path, disease_class)
        train_images = len([f for f in os.listdir(train_class_path) 
                        if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
        
        # Count test images
        test_class_path = os.path.join(test_path, disease_class)
        test_images = len([f for f in os.listdir(test_class_path) 
                        if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
        
        total_train += train_images
        total_test += test_images
        
        print(f"{disease_class:<40} {train_images:<10} {test_images:<10}")
    
    if len(train_classes) > 10:
        print(f"... and {len(train_classes) - 10} more classes")
        
        # Count remaining
        for disease_class in train_classes[10:]:
            train_class_path = os.path.join(train_path, disease_class)
            train_images = len([f for f in os.listdir(train_class_path) 
                            if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
            
            test_class_path = os.path.join(test_path, disease_class)
            test_images = len([f for f in os.listdir(test_class_path) 
                            if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
            
            total_train += train_images
            total_test += test_images
    
    print("-"*60)
    print(f"{'TOTAL':<40} {total_train:<10} {total_test:<10}")
    print("="*60)
    
    # Show final structure
    print("\n📁 Final Directory Structure:")
    print("dataset/")
    print("├── train/")
    print(f"│   ├── {train_classes[0]}/")
    print(f"│   ├── {train_classes[1]}/")
    print(f"│   └── ... ({len(train_classes)} classes)")
    print("└── test/")
    print(f"    ├── {test_classes[0]}/")
    print(f"    ├── {test_classes[1]}/")
    print(f"    └── ... ({len(test_classes)} classes)")
    
    print("\n" + "="*60)
    print("✓ Dataset verification complete!")
    print("="*60)
    print("\n🚀 Ready for training!")
    print("Next step: python train_model.py")
    
    return True

if __name__ == "__main__":
    verify_organized_dataset()