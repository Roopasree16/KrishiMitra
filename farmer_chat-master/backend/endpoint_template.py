"""Temporary file to add endpoint to app.py"""
# This content will be inserted into app.py before the if __name__ == "__main__": block

@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    """Convert speech audio to text using Deepgram API
    Expects multipart form data with:
    - file: audio file (WAV, MP3, etc.)
    - language: target language code (en, hi, or, te, etc.)
    """
    try:
        from speech_handler import transcribe_audio
        
        if 'file' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['file']
        language = request.form.get('language', 'en')
        
        if not audio_file or audio_file.filename == '':
            return jsonify({"error": "Empty audio file"}), 400
        
        # Read audio data
        audio_data = audio_file.read()
        
        # Transcribe using Deepgram
        result = transcribe_audio(audio_data, language)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e), "transcript": ""}), 500
