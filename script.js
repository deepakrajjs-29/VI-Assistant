// --- GLOBAL VARIABLES & CONFIGURATION ---
let generalObjectModel = null;
let lastUploadedImageBase64 = null; // Stores image for analysis by LLM
const IMAGE_SIZE = 224;

// =========================================================================================
// !!! API CONFIGURATION: PASTE YOUR GEMINI API KEY HERE !!!
// WARNING: This key will be public on GitHub. Create a new key just for this project.
const USER_PROVIDED_GEMINI_API_KEY = "AIzaSyB8lWR0TK-vW2zvn2GfpJJtitaCpnYBuu8"; // <-- REPLACE with YOUR ACTUAL KEY
// =========================================================================================

const GEMINI_API_KEY = USER_PROVIDED_GEMINI_API_KEY; // Use the user's key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
const analysisPrompt = "Analyze this image. If it's a plant, identify the plant species, list any visible diseases or issues, and provide three concise care tips. If it is a non-plant object, identify it clearly. Format the output as simple, clear paragraphs.";
const systemPrompt = "You are a helpful and simple plant care and object information assistant. Keep answers concise and friendly, similar to a knowledgeable expert giving quick tips.";

// The MobileNetV1 model URL (kept for general object analysis if needed)
const MOBILENET_URL = "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json";
const resultsDiv = document.getElementById("results");

// --- 1. Model Loading (for local check) ---
async function loadModels() {
  try {
    // Load TensorFlow model for quick client-side classification
    generalObjectModel = await tf.loadLayersModel(MOBILENET_URL);

    resultsDiv.innerHTML = `
      <h3 class="text-lg font-bold text-emerald-800">Models Loaded!</h3>
      <p class="text-sm text-emerald-700">Ready for general object identification (MobileNet V1). 
      <br>Upload an image to use the advanced Vision model for detailed plant analysis.</p>
    `;
  } catch (error) {
    console.error("Error loading models:", error);
    resultsDiv.innerHTML = `
      <h3 class="text-lg font-bold text-red-700"> ML Model Error!!!!</h3>
      <p class="text-sm text-red-600">Could not load TensorFlow.js model. Check console for details.</p>`;
  }
}

// --- Utility to convert data URL to base64 and MIME type ---
function dataURLtoMime(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const data = arr[1];
  return { mime, data };
}

// --- 2. Image Analysis Core Logic (Using Gemini Vision) ---
async function analyzeImage(imageElement) {
  if (!lastUploadedImageBase64) {
    resultsDiv.innerHTML = `<p class="text-orange-700">Please upload an image first.</p>`;
    return;
  }
  if (!GEMINI_API_KEY) {
    resultsDiv.innerHTML = `<p class="text-red-700 font-bold">🚨 API KEY REQUIRED 🚨</p><p class="text-red-600 text-sm">Please insert your API key in the script to enable vision analysis.</p>`;
    return;
  }

  resultsDiv.innerHTML = '<p class="text-blue-700 flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing Image with Smart Vision...</p>';

  // Prepare image data for API
  const { mime, data } = dataURLtoMime(lastUploadedImageBase64);

  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: analysisPrompt }, // The analysis prompt
            { inlineData: { mimeType: mime, data: data } }, // The image data
          ],
        },
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      // Convert paragraphs to a nicely formatted HTML list of results
      const paragraphs = generatedText.split("\n\n").filter((p) => p.trim() !== "");
      let htmlOutput = '<h3 class="text-lg font-bold text-gray-700">✅ Smart Vision Analysis</h3><div class="space-y-3 mt-2">';

      paragraphs.forEach((p) => {
        // Simple heuristic to highlight key sections
        let formattedP = p.replace(
          /(Plant Species|Object|Diseases|Care Tips|Issue):/g,
          "<strong>$1:</strong>"
        );
        htmlOutput += `<p class="text-sm bg-white p-2 rounded">${formattedP}</p>`;
      });

      htmlOutput += "</div>";
      resultsDiv.innerHTML = htmlOutput;
    } else {
      resultsDiv.innerHTML = '<p class="text-red-600">The AI vision model returned no clear analysis. Please try a clearer image.</p>';
    }
  } catch (error) {
    console.error("Your Vision API Fetch Error:", error);
    resultsDiv.innerHTML = `<p class="text-red-600">Analysis failed: Could not connect to the vision service. Check network/console.</p>`;
  }
}

// --- Dummy functions for MobileNet (kept for initial load check) ---
async function getTopKClasses(predictions, k) {
  const mockLabels = [
    "Daisy flower", "Monstera plant", "Tomato leaf", "Apple",
    "Laptop computer", "Desk chair", "Cat", "Banana",
    "Soccer ball", "Vase",
  ];
  const { values, indices } = tf.topk(predictions, k);
  const topKValues = await values.data();
  const topKIndices = await indices.data();
  return Array.from(topKValues).map((value, i) => ({
    className: mockLabels[topKIndices[i] % mockLabels.length],
    probability: value,
  }));
}

function getSimulatedPlantResults(generalName) {
  /* Dummy implementation not used in final analysis */
  return {
    plantName: "N/A",
    disease: "N/A",
    care: ["N/A"],
  };
}

// --- 3. Event Listeners and Setup ---
document.addEventListener("DOMContentLoaded", () => {
  loadModels();

  const imageUpload = document.getElementById("imageUpload");
  const uploadedImage = document.getElementById("uploadedImage");

  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage.src = e.target.result;
        lastUploadedImageBase64 = e.target.result; // Store base64 data
        uploadedImage.onload = () => analyzeImage(uploadedImage); // Trigger analysis after load
      };
      reader.readAsDataURL(file);
    }
  });

  // --- 4. Chatbot Logic (Using Gemini API) ---
  const chatInput = document.getElementById("chatInput");
  const sendMessageButton = document.getElementById("sendMessage");
  const chatWindow = document.getElementById("chatWindow");

  sendMessageButton.addEventListener("click", () => sendChat());
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  });

  async function sendChat() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    if (!GEMINI_API_KEY) {
      const loadingMsg = document.getElementById("loading-msg");
      if (loadingMsg) loadingMsg.remove();
      chatWindow.innerHTML += `<p class="bot-message bg-red-100 text-red-800">
        Chatbot Disabled: Please insert your API key in the script to use the chatbot.
      </p>`;
      chatWindow.scrollTop = chatWindow.scrollHeight;
      return;
    }

    // Display user message
    const userHTML = `<p class="user-message">${userMessage}</p>`;
    chatWindow.innerHTML += userHTML;
    chatInput.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Display loading message
    const loadingHTML = `<p class="bot-message text-gray-500 flex items-center" id="loading-msg"><svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>... consulting AI ...</p>`;
    chatWindow.innerHTML += loadingHTML;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    let botResponseText = "Connection Failed. Please try again or check your network.";
    let success = false;

    try {
      const payload = {
        contents: [{ parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        botResponseText = generatedText;
        success = true;
      } else {
        botResponseText = "The AI model returned no output. Try rephrasing the question.";
      }
    } catch (error) {
      console.error("Your API Fetch Error:", error);
      // Leave the default failure message
    }

    // Remove loading message
    const loadingMsg = document.getElementById("loading-msg");
    if (loadingMsg) loadingMsg.remove();

    // Display final response
    const messageClass = success ? "bot-message" : "bot-message bg-red-100 text-red-800";
    const botHTML = `<p class="${messageClass}">${botResponseText}</p>`;
    chatWindow.innerHTML += botHTML;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
