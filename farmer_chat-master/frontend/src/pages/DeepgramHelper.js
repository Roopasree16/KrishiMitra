/* Audio recording + Deepgram integration for ChatPage.js */

// Add this new function to replace the old startListening function

async function startListeningWithDeepgram(language, updateInputFunc, analyzeSpeechFunc, textLang) {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create MediaRecorder
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];
    let isRecording = true;
    
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };
    
    mediaRecorder.onstop = async () => {
      // Create audio blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      
      // Send to backend for Deepgram transcription
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('language', textLang);
      
      try {
        const res = await fetch('http://localhost:5002/speech-to-text', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) return;
        
        const data = await res.json();
        const transcript = data.transcript || '';
        
        if (transcript && transcript.trim().length > 0) {
          // Update input with transcript
          updateInputFunc(transcript);
          // Analyze for crisis detection
          if (transcript.trim().length > 2) {
            analyzeSpeechFunc(transcript);
          }
        }
      } catch (e) {
        console.error('Deepgram transcription failed', e);
      }
    };
    
    // Start recording
    mediaRecorder.start();
    
    // Stop recording after 30 seconds or when user stops (you can add a stop button)
    setTimeout(() => {
      if (isRecording && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        isRecording = false;
        stream.getTracks().forEach(track => track.stop());
      }
    }, 30000);
    
    return {
      stop: () => {
        if (isRecording && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          isRecording = false;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  } catch (error) {
    console.error('Microphone access denied or error:', error);
    alert('Microphone access denied. Please enable microphone and try again.');
  }
}
