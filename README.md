# 🌿 Visual Lens & Smart Assistant

A lightweight, browser-based tool for object identification and plant care advice using machine learning and AI-powered chat assistance.

## ✨ Features

- **📸 Image Analysis**: Upload images to identify objects and plants using TensorFlow.js
- **🤖 Smart Chatbot**: Get instant answers about plant care, object details, and general knowledge
- **🎨 Modern UI**: Clean, responsive interface built with Tailwind CSS
- **⚡ Browser-Based**: No backend required - runs entirely in your browser
- **🔒 Privacy-First**: All processing happens locally on your device

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for loading external libraries)

### Installation

1. Clone or download this repository
2. Ensure you have the following files in the same directory:
   - `index.html`
   - `styles.css`
   - `script.js`

3. Open `index.html` in your web browser

That's it! No build process or dependencies to install.

## 📁 Project Structure

```
visual-plant-assistant/
├── index.html          # Main HTML structure
├── styles.css          # Custom styling
├── script.js           # Application logic and ML integration
└── README.md          # This file
```

## 🎯 Usage

### Image Analysis

1. Click the **"Choose File"** button in the Image Analyzer section
2. Select an image from your device (JPG, PNG, etc.)
3. The uploaded image will display on the left
4. ML model predictions will appear on the right showing:
   - Object/plant identification
   - Confidence percentage
   - Top predictions

### Smart Chatbot

1. Type your question in the chat input field
2. Click **"Send"** or press Enter
3. The chatbot will respond with helpful information about:
   - Plant care tips
   - Disease identification
   - Watering schedules
   - General plant knowledge

**Example Questions:**
- "What are the symptoms of powdery mildew?"
- "How often should I water succulents?"
- "What causes yellow leaves on tomato plants?"

## 🛠️ Technologies Used

- **HTML5** - Structure and semantics
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Application logic
- **Tailwind CSS** - Utility-first CSS framework
- **TensorFlow.js** - Machine learning in the browser
- **Anthropic Claude API** - AI-powered chat responses (if integrated)

## 🔧 Configuration

### Customizing the Chat Responses

If you're using the Anthropic Claude API for chat functionality, you'll need to:

1. Obtain an API key from [Anthropic](https://www.anthropic.com)
2. Add your API key to the `script.js` file (ensure you follow security best practices)
3. Never commit API keys to public repositories

### Modifying the ML Model

The current implementation uses TensorFlow.js with a pre-trained model. To use a different model:

1. Replace the model loading code in `script.js`
2. Update the prediction logic to match your model's output format
3. Adjust the results display accordingly

## 📝 Features Breakdown

### Image Analyzer
- Accepts common image formats (JPEG, PNG, GIF, WebP)
- Real-time image preview
- ML-powered object detection
- Confidence scores for predictions

### Smart Chatbot
- Natural language processing
- Plant care expertise
- Conversation history
- User-friendly interface

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## ⚠️ Known Limitations

- ML models require initial download (may take a few seconds on first load)
- Chat responses require internet connection if using external API
- Image processing speed depends on device capabilities
- Large images may take longer to process

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- TensorFlow.js team for the ML framework
- Tailwind CSS for the styling framework
- Anthropic for Claude AI capabilities
- The open-source community

## 📧 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure all files are in the same directory
3. Verify your internet connection
4. Try clearing your browser cache

## 🔮 Future Enhancements

- [ ] Add camera support for direct photo capture
- [ ] Implement plant disease database
- [ ] Add multi-language support
- [ ] Create offline mode with cached responses
- [ ] Add image history and favorites
- [ ] Implement voice input for chat

## 📊 Version History

- **v1.0.0** - Initial release
  - Basic image analysis
  - Chat functionality
  - Responsive design

---

Made with 🌱 for plant enthusiasts and curious minds everywhere!
