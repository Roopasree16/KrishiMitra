"""Speech-to-Text handler using OpenAI Whisper (free, open-source, offline)"""
import os
import io
import tempfile

try:
    import whisper
except ImportError:
    whisper = None

# Language code mappings for Whisper
LANGUAGE_CODES = {
    'en': 'en',
    'hi': 'hi',
    'or': 'or',      # Odia
    'te': 'te',      # Telugu
    'ta': 'ta',      # Tamil
    'kn': 'kn',      # Kannada
    'ml': 'ml',      # Malayalam
    'mr': 'mr',      # Marathi
    'bn': 'bn',      # Bengali
    'gu': 'gu',      # Gujarati
    'pa': 'pa',      # Punjabi
}

# Global model cache to avoid reloading
_model_cache = None

def get_whisper_model():
    """Load Whisper model (cached after first load)"""
    global _model_cache
    
    if _model_cache is not None:
        return _model_cache
    
    if whisper is None:
        raise ImportError("Whisper not installed. Run: pip install openai-whisper")
    
    print("Loading Whisper model (this takes ~30 seconds on first run)...")
    _model_cache = whisper.load_model("base")
    print("Whisper model loaded!")
    return _model_cache

def transcribe_audio(audio_data, language="en"):
    """
    Transcribe audio using OpenAI Whisper (free, open-source).
    
    Whisper is excellent for Indian regional languages.
    First run downloads ~1.4GB model, subsequent runs are fast.
    
    Args:
        audio_data: Audio bytes (WAV, MP3, OGG, FLAC, etc.)
        language: Language code ('en', 'hi', 'or', 'te', 'ta', etc.)
    
    Returns:
        dict: { "transcript": "...", "confidence": 0.9, "language": "or" }
    """
    try:
        if whisper is None:
            return {
                "error": "Whisper not installed. Run: pip install openai-whisper",
                "transcript": ""
            }
        
        # Map language code
        whisper_lang = LANGUAGE_CODES.get(language.split('-')[0].lower(), 'en')
        
        # Write audio to temporary file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            tmp_file.write(audio_data)
            tmp_path = tmp_file.name
        
        try:
            # Load Whisper model
            model = get_whisper_model()
            
            # Transcribe with language hint
            result = model.transcribe(tmp_path, language=whisper_lang)
            
            transcript = result.get("text", "").strip()
            
            return {
                "transcript": transcript,
                "confidence": 0.95,  # Whisper is highly accurate
                "language": whisper_lang,
            }
        finally:
            # Clean up temp file
            import os as os_module
            try:
                os_module.remove(tmp_path)
            except:
                pass
    
    except Exception as e:
        return {
            "error": f"Whisper transcription error: {str(e)}",
            "transcript": "",
            "language": LANGUAGE_CODES.get(language, 'en')
        }


