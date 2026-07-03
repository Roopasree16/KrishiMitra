# Quick Start Guide - Farmer Mental Health Chatbot

## 🚀 Getting Started in 5 Minutes

### Step 1: Clone and Navigate
```bash
cd farmer-chatbot
```

### Step 2: Start the Backend
```bash
cd backend

# Install dependencies (if needed)
pip install -r requirements.txt

# Create .env file with your OpenAI API key
# OPENAI_API_KEY=sk-xxxxxx

# Run the server
python app.py
# Server will run on http://localhost:5002
```

### Step 3: Start the Frontend
```bash
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm start
# App will open at http://localhost:3000
```

## 🎯 Testing the Features

### 1. Language Selection
- Select your preferred language from 10 Indian languages
- Watch the animated background shapes
- Notice the responsive layout

### 2. Chat Interface
- **Text Input**: Type your message and press Enter or click Send
- **Voice Input**: Click the microphone button and speak (browser must support Speech Recognition)
- **Voice Output**: Bot responses are automatically spoken

### 3. Virtual Keyboard
- Click "Show Virtual Keyboard" for additional input method
- Multi-language keyboard layouts available
- Perfect for accessibility

### 4. Emergency Features
- Type crisis-related keywords to trigger emergency support
- Click "Emergency" button to view helplines
- See nearby mental health services (if location is enabled)

## 📂 Key Files to Know

### Frontend Components
- `src/components/ui/Button.js` - Reusable button component
- `src/components/ChatMessage.js` - Message display with actions
- `src/components/EmergencyModal.js` - Crisis support interface
- `src/pages/ChatPage.js` - Main chat interface
- `src/pages/LanguageSelect.js` - Language selection screen

### Styling
- `src/index.css` - Global styles and utilities
- `src/App.css` - App-level styling
- `src/pages/ChatPage.css` - Chat page styles
- `src/pages/LanguageSelect.css` - Language select styles

### Backend
- `app.py` - Main Flask application
- `models.py` - Database models
- `requirements.txt` - Python dependencies

## 🎨 Customization Guide

### Change Primary Color
Edit color values in CSS files:
```css
/* Change from green to blue */
background: #0ea5e9; /* was #16a34a */
```

### Add New Languages
1. Update `LanguageSelect.js` languages array
2. Add keyboard layout to `VirtualKeyboard.js` KEYBOARD_LAYOUTS
3. Add translations to backend if needed

### Customize Bot Responses
Edit the backend `app.py` to modify:
- Severity detection keywords
- Response generation prompts
- Emergency alert conditions

## 🔧 Troubleshooting

### Voice Not Working?
- Check browser support (Chrome, Firefox, Safari, Edge)
- Ensure microphone permissions are granted
- Check browser console for errors

### Styles Not Applying?
- Clear cache: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check CSS file imports
- Verify CSS Module syntax

### Backend Connection Error?
- Ensure backend is running on `http://localhost:5002`
- Check CORS is enabled in Flask
- Verify network connectivity

### OpenAI API Error?
- Check API key is set in `.env`
- Verify API key has sufficient credits
- Check API rate limits

## 📊 Project Statistics

- **Components**: 10+ reusable components
- **Languages**: 10 Indian languages supported
- **CSS Files**: 12+ stylesheets with CSS Modules
- **Total Lines of Code**: 2000+
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive Breakpoints**: 3 (Desktop, Tablet, Mobile)

## 🌟 Key Features Highlight

✅ Beautiful UI with gradients and animations  
✅ Multi-language support with voice  
✅ Emergency crisis detection  
✅ Responsive design for all devices  
✅ Accessibility features  
✅ Virtual keyboard for accessibility  
✅ Message actions (copy, speak)  
✅ Professional component architecture  
✅ CSS Module-based styling  
✅ Real-time voice recognition  

## 📞 Support & Help

### Backend Issues?
- Check Flask logs in terminal
- Review `app.py` error handling
- Test API with curl or Postman

### Frontend Issues?
- Check browser console (F12)
- Review React error boundaries
- Test components in isolation

### UI/UX Questions?
- Review component documentation in code
- Check CSS Module files for styling
- Reference design system in README

## 🎓 Learning Resources

- React Docs: https://react.dev
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Flask Docs: https://flask.palletsprojects.com
- Accessibility: https://www.w3.org/WAI/

## 🚀 Next Steps

1. ✅ Set up backend with OpenAI API key
2. ✅ Start both servers
3. ✅ Test voice features
4. ✅ Enable geolocation for services
5. ✅ Customize colors and content
6. ✅ Deploy to production

## 📝 Notes

- Keep `.env` file secure (never commit to git)
- Test on real mobile devices
- Monitor API usage and costs
- Regularly update dependencies
- Back up database regularly

---

**Happy coding! 🌾💚**

For detailed information, see `UI_IMPROVEMENTS_SUMMARY.md`
