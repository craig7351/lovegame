// Access global window.gameScript
// import { gameScript } from './data/gameScript.js'; <--- Removed

class GameEngine {
    constructor() {
        this.currentSceneId = "01";
        this.elements = {
            gameContainer: document.getElementById('game-container'),
            background: document.getElementById('background-layer'),
            character: document.getElementById('character-layer'),
            dialogueBox: document.getElementById('dialogue-box'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            choicesContainer: document.getElementById('choices-container'),
            mainMenu: document.getElementById('main-menu'),
            startBtn: document.getElementById('start-btn')
        };

        this.init();
    }

    init() {
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startGame());
        } else {
            console.error("Start button not found!");
        }
    }

    startGame() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.style.display = 'none';
        }
        this.loadScene(this.currentSceneId);
    }

    loadScene(sceneId) {
        // Access global variable window.gameScript
        const script = window.gameScript;
        if (!script) {
            console.error("Game script not loaded!");
            return;
        }

        const sceneData = script.find(scene => scene.id === sceneId);
        if (!sceneData) {
            console.error("Scene not found:", sceneId);
            return;
        }

        // 1. Update Image (Single Photo Mode with Blurred Background)
        if (sceneData.image) {
            // Blurred background fill
            this.elements.background.style.backgroundImage = `url('${sceneData.image}')`;

            // Centered clear image
            this.elements.character.style.backgroundImage = `url('${sceneData.image}')`;
            this.elements.character.style.opacity = 1;
        } else {
            // Fallback
        }

        // 3. Show Text
        this.showDialogue(sceneData.speaker, sceneData.text, () => {
            // 4. Show Choices after text is done
            this.showChoices(sceneData.choices);
        });
    }

    showDialogue(speaker, text, callback) {
        this.elements.dialogueBox.classList.add('visible');
        this.elements.speakerName.textContent = speaker;
        this.elements.dialogueText.textContent = "";

        // Typewriter effect
        let i = 0;
        const speed = 50; // ms per char

        const typeWriter = () => {
            if (i < text.length) {
                this.elements.dialogueText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                if (callback) callback();
            }
        };

        typeWriter();
    }

    showChoices(choices) {
        this.elements.choicesContainer.innerHTML = ''; // Clear old choices
        if (!choices || choices.length === 0) return;

        this.elements.choicesContainer.style.display = 'flex';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn fade-in';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => {
                this.elements.choicesContainer.style.display = 'none';
                this.loadScene(choice.nextScene);
            });
            this.elements.choicesContainer.appendChild(btn);
        });
    }
}

// Initialize Game
window.onload = () => {
    const game = new GameEngine();
};
