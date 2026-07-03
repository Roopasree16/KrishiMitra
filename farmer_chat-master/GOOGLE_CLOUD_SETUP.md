# Google Cloud Speech-to-Text Setup Guide

This guide will help you set up Google Cloud Speech-to-Text for reliable Odia, Tamil, Kannada, Marathi, and other regional Indian language support.

## Why Google Cloud Speech-to-Text?

- **Best support for Indian languages** (Odia, Tamil, Kannada, Telugu, Marathi, Bengali, Gujarati, Punjabi, etc.)
- **High accuracy** (99%+ for clear audio)
- **Automatic punctuation** and capitalization
- **More reliable than browser Web Speech API** for regional languages

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project**
3. Name it (e.g., "Farmer Chatbot")
4. Click **Create**

### 2. Enable Speech-to-Text API

1. In the Cloud Console, go to **APIs & Services > Library**
2. Search for **"Speech-to-Text API"**
3. Click on it and click **Enable**

### 3. Create a Service Account

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Fill in the details:
   - **Service account name**: `farmer-chatbot-stt`
   - Click **Create and Continue**
4. Grant roles:
   - Add the role **"Cloud Speech-to-Text User"** (or **"Basic > Editor"** for testing)
   - Click **Continue** and **Done**

### 4. Create and Download Service Account Key

1. On the **Credentials** page, find your service account and click on it
2. Go to the **Keys** tab
3. Click **Add Key > Create new key**
4. Choose **JSON** format
5. Click **Create** — the JSON file will download automatically
6. **Keep this file safe** — it contains credentials to access your Google Cloud resources

### 5. Set Up Environment Variable

**On Windows (PowerShell):**

```powershell
# Set the environment variable to point to your credentials file
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\your\credentials-file.json"

# Verify it's set
$env:GOOGLE_APPLICATION_CREDENTIALS
```

To make it **permanent** across sessions:

```powershell
[System.Environment]::SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\path\to\your\credentials-file.json", [System.EnvironmentVariableTarget]::User)
```

Then **restart your terminal** for the change to take effect.

**On Mac/Linux:**

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials-file.json"
```

To make it permanent, add this line to `~/.bashrc` or `~/.zshrc`.

### 6. Install Dependencies

From the `backend/` directory:

```bash
pip install -r requirements.txt
```

This will install:
- `google-cloud-speech` — Google Cloud Speech library
- Other dependencies (Flask, OpenAI, etc.)

### 7. Test the Setup

Start the backend:

```bash
python app.py
```

Test with a simple Python script to verify credentials work:

```python
from google_speech_handler import transcribe_audio

# Test audio (just 16-bit PCM WAV data)
# For a real test, load an actual audio file
test_audio = b'\x00\x00' * 16000  # Dummy audio

result = transcribe_audio(test_audio, language='or')
print(result)
```

If you see no errors, the credentials are working!

### 8. Test in the App

1. Start frontend (if not running):
   ```bash
   cd frontend
   npm start
   ```

2. Select **Odia** (or any Indian language) from the language selector
3. Click the **mic button** and speak in Odia
4. The text should appear in Odia with high accuracy

## Supported Languages

- **English**: `en`
- **Hindi**: `hi`
- **Odia**: `or` ✅ (what you need!)
- **Telugu**: `te`
- **Tamil**: `ta`
- **Kannada**: `kn`
- **Malayalam**: `ml`
- **Marathi**: `mr`
- **Bengali**: `bn`
- **Gujarati**: `gu`
- **Punjabi**: `pa`

## Pricing

Google Cloud Speech-to-Text is **free for the first 60 minutes per month**. After that, it costs ~$0.024 per 15 seconds.

For a chatbot with occasional voice input, the free tier should be sufficient for development and testing.

## Troubleshooting

### Error: "GOOGLE_APPLICATION_CREDENTIALS environment variable not set"

- **Solution**: Make sure you've set the environment variable and **restarted your terminal/IDE**.

### Error: "Credentials file not found"

- **Solution**: Check that the file path is correct and the file exists.

### Error: "The caller does not have permission"

- **Solution**: Make sure the service account has the **Cloud Speech-to-Text User** role assigned.

### Error: "Invalid audio encoding"

- **Solution**: The frontend should send audio as **16-bit linear PCM WAV**. The MediaRecorder in the browser handles this automatically.

### Still Getting English Transcription for Odia?

- Make sure you've selected **Odia** in the language selector before speaking
- Speak clearly and avoid background noise
- Try the `/speech-to-text` endpoint directly with a test audio file

## Next Steps

Once STT is working:
- ✅ AI replies should be generated in the selected language (already implemented)
- 🔜 Consider switching TTS to **Google Cloud Text-to-Speech** for better regional language voice output
- 🔜 Add speech input validation and error messages for users

## Support

If you encounter issues, check:
1. Google Cloud Console > Speech-to-Text API is **Enabled**
2. Service account has the correct role
3. `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
4. Backend is restarted after setting the environment variable
