# Deepgram Speech-to-Text Setup Guide

## Overview
This guide explains how to set up Deepgram API for speech recognition in all Indian languages including Odia, Hindi, Telugu, Tamil, etc.

## Why Deepgram?
- ✅ Excellent support for Indian languages (Odia, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati)
- ✅ No complex Google Cloud setup required
- ✅ Simple API key authentication
- ✅ High accuracy for regional languages
- ✅ Free tier: 50,000 minutes/month

## Setup Steps

### 1. Create Deepgram Account
1. Go to https://console.deepgram.com/
2. Sign up for free account
3. Navigate to **API Keys** section
4. Copy your API key

### 2. Add API Key to Environment
Create or update `.env` file in the `backend` folder:
```bash
DEEPGRAM_API_KEY=your_api_key_here
```

### 3. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Backend Implementation
The backend now includes:
- **`speech_handler.py`** — Deepgram transcription handler
- **`/speech-to-text` endpoint** — POST endpoint that accepts audio files

### 5. Frontend Implementation
The frontend captures audio using Web Audio API and sends it to the backend for transcription.

## API Endpoint

### POST `/speech-to-text`
**Request:**
```
Content-Type: multipart/form-data
- file: audio file (WAV, MP3, etc.)
- language: language code (en, hi, or, te, ta, kn, ml, mr, bn, gu)
```

**Response:**
```json
{
  "transcript": "text from speech",
  "confidence": 0.95,
  "language": "or"
}
```

## Language Codes Supported
| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ |
| Hindi | `hi` | ✅ |
| Odia | `or` | ✅ |
| Telugu | `te` | ✅ |
| Tamil | `ta` | ✅ |
| Kannada | `kn` | ✅ |
| Malayalam | `ml` | ✅ |
| Marathi | `mr` | ✅ |
| Bengali | `bn` | ✅ |
| Gujarati | `gu` | ✅ |

## Testing

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Test Speech Recognition
1. Open http://localhost:3000
2. Select **Odia** (ଓଡ଼ିଆ) or any language
3. Click the **microphone icon**
4. Speak in your selected language
5. Speech will be transcribed in that language

## Troubleshooting

### API Key Not Found
- Verify `.env` file in backend folder has `DEEPGRAM_API_KEY=...`
- Restart backend server after adding key

### Microphone Access Denied
- Check browser permissions
- Allow microphone access when prompted
- Use HTTPS in production (browser blocks microphone on HTTP)

### Transcription Empty
- Check internet connection
- Verify Deepgram account has quota remaining
- Try a different audio format or longer audio clip

## Performance Notes
- Each transcription request: ~1-3 seconds depending on audio length
- Deepgram free tier: 50,000 minutes/month
- Typical usage: ~3 min/hour per user

## Next Steps
1. ✅ Test with Odia language
2. ✅ Test with other Indian languages
3. ✅ Monitor usage on Deepgram console
4. ✅ Consider upgrading plan if needed (pay-as-you-go available)

---

For more info: https://deepgram.com/
