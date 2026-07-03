#!/usr/bin/env python3
"""
Performance test - measure response times
"""
import time
import json
from app import app

def test_performance():
    print("🚀 Performance Test - Chat Endpoint\n")
    print("="*50)
    
    test_cases = [
        {"text": "Hello, how are you?", "lang": "en", "desc": "English regular"},
        {"text": "मैं बहुत खुश हूँ", "lang": "hi", "desc": "Hindi positive"},
        {"text": "I need help", "lang": "en", "desc": "English critical"},
        {"text": "मुझे मदद चाहिए", "lang": "hi", "desc": "Hindi critical"},
        {"text": "How's the weather?", "lang": "en", "desc": "English neutral"},
    ]
    
    times = []
    
    with app.app_context():
        with app.test_client() as client:
            for test in test_cases:
                print(f"\n📝 {test['desc']}")
                print(f"   Text: {test['text'][:40]}...")
                
                start = time.time()
                response = client.post('/chat', json={
                    'text': test['text'],
                    'lang': test['lang']
                })
                elapsed = time.time() - start
                times.append(elapsed)
                
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"   ✓ Time: {elapsed:.2f}s")
                    print(f"   Emotion: {data.get('emotion')}")
                    print(f"   Sentiment: {data.get('sentiment_score'):.2f}")
                else:
                    print(f"   ✗ Error: {response.status_code}")
    
    print("\n" + "="*50)
    print(f"\n📊 Summary:")
    print(f"   Total messages: {len(times)}")
    print(f"   Average time: {sum(times)/len(times):.2f}s")
    print(f"   Fastest: {min(times):.2f}s")
    print(f"   Slowest: {max(times):.2f}s")
    
    avg = sum(times) / len(times)
    if avg < 2:
        print(f"\n   ⚡ Performance: EXCELLENT ({avg:.2f}s avg)")
    elif avg < 3:
        print(f"\n   ✓ Performance: GOOD ({avg:.2f}s avg)")
    else:
        print(f"\n   ⚠ Performance: SLOW ({avg:.2f}s avg)")

if __name__ == "__main__":
    test_performance()
