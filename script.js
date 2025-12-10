// On utilise la version stable via esm.run qui est très fiable pour les navigateurs
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// --- Sélection des éléments du DOM ---
const apiKeyInput = document.getElementById('api-key-input');
const setApiKeyBtn = document.getElementById('set-api-key-btn');
const chatContainer = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-indicator');

// --- Variables d'état ---
let genAI = null;
let chatSession = null;
// On utilise le modèle 1.5 Flash, très rapide et stable pour les comptes gratuits
const MODEL_NAME = "gemini-1.5-flash"; 

// --- Fonctions Utilitaires ---

// Fonction pour ajouter un message à l'écran
function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    // Conversion des sauts de ligne (\n) en balises HTML <br> et protection basique XSS
    const cleanText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const formattedText = cleanText.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `<p>${formattedText}</p>`;
    
    chatContainer.appendChild(messageDiv);
    
    // Défilement automatique vers le bas
    chatContainer.scrollTop = chatContainer.scrollHeight; 
}

// Fonction pour activer/désactiver l'interface de chat
function toggleChat(enable) {
    userInput.disabled = !enable;
    sendButton.disabled = !enable;
    
    if (enable) {
        apiKeyInput.disabled = true;
        setApiKeyBtn.disabled = true;
        setApiKeyBtn.textContent = "Connecté";
        setApiKeyBtn.style.backgroundColor = "#4CAF50";
        setApiKeyBtn.style.color = "#fff";
        userInput.focus();
    } else {
        // Si on désactive (chargement), on garde le style mais on empêche le clic
        setApiKeyBtn.disabled = true;
    }
}

// --- Événements et Logique ---

// 1. Initialisation de la clé API
setApiKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (key === '') {
        alert("Veuillez entrer une clé API Gemini valide.");
        return;
    }

    try {
        // Initialisation de la librairie
        genAI = new GoogleGenerativeAI(key);
        
        // Configuration du modèle
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        // Démarrage de la session de chat (historique vide au début)
        chatSession = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Bonjour, es-tu opérationnel ?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Bonjour ! Je suis opérationnel et prêt à discuter avec vous." }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Si on arrive ici sans erreur, on active le chat
        toggleChat(true);
        appendMessage('ai', "Système connecté. Je suis prêt !");

    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        alert("Erreur: Impossible de configurer l'IA. Vérifiez que votre clé est correcte.");
    }
});

// 2. Envoi du message
async function sendMessage() {
    const prompt = userInput.value.trim();
    
    if (prompt === '') return;
    if (!chatSession) {
        alert("Veuillez d'abord valider votre clé API.");
        return;
    }

    // Affichage immédiat du message utilisateur
    appendMessage('user', prompt);
    userInput.value = ''; 
    
    // État de chargement
    userInput.disabled = true;
    sendButton.disabled = true;
    loadingIndicator.style.display = 'block';

    try {
        // Envoi à Gemini
        const result = await chatSession.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Affichage de la réponse
        appendMessage('ai', text);
        
    } catch (error) {
        console.error("Erreur Gemini API:", error);
        appendMessage('ai', "⚠️ Erreur : " + error.message);
    } finally {
        // Restauration
        userInput.disabled = false;
        sendButton.disabled = false;
        loadingIndicator.style.display = 'none';
        userInput.focus();
    }
}

// Écouteurs d'événements pour l'envoi
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});