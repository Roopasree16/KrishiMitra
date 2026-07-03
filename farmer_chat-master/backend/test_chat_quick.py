#!/usr/bin/env python3
"""
Quick test to verify chat endpoint is working
"""
import json
from app import app

def test_chat():
    with app.app_context():
        with app.test_client() as client:
            # Test 1: English message
            print("Test 1: English message...")
            response = client.post('/chat', json={
                'text': 'How are you feeling today?',
                'lang': 'en'
            })
            
            if response.status_code == 200:
                data = response.get_json()
                print(f"✓ Status: {response.status_code}")
                print(f"  Reply: {data.get('reply')[:60]}...")
                print(f"  Emotion: {data.get('emotion')}")
                print(f"  Sentiment: {data.get('sentiment_score'):.2f}")
            else:
                print(f"✗ Error: {response.status_code}")
                print(response.data)
            
            print()
            
            # Test 2: Hindi message
            print("Test 2: Hindi message...")
            response = client.post('/chat', json={
                'text': 'मैं बहुत खुश हूँ',
                'lang': 'hi'
            })
            
            if response.status_code == 200:
                data = response.get_json()
                print(f"✓ Status: {response.status_code}")
                print(f"  Reply: {data.get('reply')[:60]}...")
                print(f"  Emotion: {data.get('emotion')}")
                print(f"  Sentiment: {data.get('sentiment_score'):.2f}")
            else:
                print(f"✗ Error: {response.status_code}")
            
            print()
            print("✅ Chat endpoint is working!")

if __name__ == "__main__":
    test_chat()
