#!/usr/bin/env python3
"""
Quick performance test for the optimized chat endpoint
"""
import time
import json
import requests

# Test messages in different languages
test_messages = [
    {"text": "How are you?", "lang": "en"},
    {"text": "मैं बहुत खुश हूँ", "lang": "hi"},
    {"text": "నేను చేదుగా ఉన్నాను", "lang": "te"},
]

def test_chat_performance():
    print("🚀 Testing optimized chat endpoint...\n")
    
    times = []
    
    for msg in test_messages:
        print(f"Testing: {msg['text'][:50]}...")
        
        start = time.time()
        try:
            response = requests.post(
                "http://localhost:5002/chat",
                json=msg,
                timeout=30
            )
            elapsed = time.time() - start
            times.append(elapsed)
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✓ Time: {elapsed:.2f}s")
                print(f"  Emotion: {data.get('emotion', 'N/A')}")
                print(f"  Sentiment: {data.get('sentiment_score', 'N/A'):.2f}")
            else:
                print(f"  ✗ Error: {response.status_code}")
        except Exception as e:
            print(f"  ✗ Failed: {e}")
        
        print()
    
    if times:
        avg = sum(times) / len(times)
        print(f"📊 Average response time: {avg:.2f}s")
        print(f"⚡ Target: < 3s | Achieved: {'✓ PASS' if avg < 3 else '✗ SLOW'}")

if __name__ == "__main__":
    test_chat_performance()
