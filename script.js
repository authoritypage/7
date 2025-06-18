Here’s an enhanced and cleaned-up version of your JavaScript code. I’ve focused on improving readability, modularity, error handling, and removing redundant or unnecessary parts. I’ve also ensured consistent coding standards and added comments for clarity.

```javascript
console.log("script.js loaded and attempting to execute.");

// Ensure the window is fully loaded before initializing
window.onload = function() {
    console.log("window.onload event fired.");

    // --- Footer Year Update ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
        console.log("Footer year updated.");
    } else {
        console.warn("Footer year span with ID 'year' not found.");
    }

    // --- Three.js WebGL Background Setup ---
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) {
        console.error('Canvas element with ID "canvas-bg" not found. Three.js background cannot be initialized.');
        return;
    }
    console.log("Canvas element found for Three.js background.");

    let scene, camera, renderer;
    let grid, particles;
    const particleCount = 2000;

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    // Initialize Three.js scene
    function initThreeJS() {
        console.log("Initializing Three.js scene...");
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);

        createGrid();
        createParticles();
        setupEventListeners();
        animate();
    }

    // Create grid helper
    function createGrid() {
        const size = 300;
        const divisions = 40;
        grid = new THREE.GridHelper(size, divisions, 0x0077B6, 0xB71C1C);
        grid.rotation.x = Math.PI / 2.5;
        grid.position.y = -50;
        scene.add(grid);
        console.log("Three.js grid added to scene.");
    }

    // Create particle system
    function createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorRed = new THREE.Color(0xB71C1C);
        const colorBlue = new THREE.Color(0x0077B6);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() * 600) - 300;
            positions[i * 3 + 1] = (Math.random() * 600) - 300;
            positions[i * 3 + 2] = (Math.random() * 600) - 300;

            if (i % 2 === 0) {
                colorRed.toArray(colors, i * 3);
            } else {
                colorBlue.toArray(colors, i * 3);
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
        console.log("Three.js particles added to scene.");
    }

    // Setup event listeners
    function setupEventListeners() {
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        console.log("Three.js event listeners attached.");
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        particles.rotation.x = mouseY * 0.05;
        particles.rotation.y = mouseX * 0.05;

        updateGrid();
        updateParticles();

        renderer.render(scene, camera);
    }

    // Update grid position
    function updateGrid() {
        grid.position.z += 0.05;
        if (grid.position.z > 50) grid.position.z = -50;
    }

    // Update particle positions
    function updateParticles() {
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += Math.sin(Date.now() * 0.0001 + i * 0.1) * 0.03;
            positions[i * 3 + 1] += Math.cos(Date.now() * 0.0001 + i * 0.05) * 0.03;
            positions[i * 3 + 2] += 0.1;
            if (positions[i * 3 + 2] > 300) positions[i * 3 + 2] = -300;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log("Window resized, Three.js renderer updated.");
    }

    // Handle mouse movement
    function onDocumentMouseMove(event) {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // Initialize Three.js with error handling
    try {
        initThreeJS();
    } catch (error) {
        console.error("Error initializing Three.js:", error);
        showFallbackMessage();
    }

    // Show fallback message if Three.js fails to initialize
    function showFallbackMessage() {
        const fallbackMessage = document.createElement('div');
        fallbackMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 10px;
            background-color: #dc3545;
            color: white;
            text-align: center;
            font-family: 'Inter', sans-serif;
            z-index: 9999;
        `;
        fallbackMessage.textContent = 'Interactive background could not load. Your browser may not support WebGL.';
        document.body.prepend(fallbackMessage);
        console.log("Three.js fallback message displayed.");
    }

    // --- AI Search Functionality ---
    const aiQueryInput = document.getElementById('ai-query-input');
    const aiQueryButton = document.getElementById('ai-query-button');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiLoadingIndicator = document.getElementById('ai-loading-indicator');

    if (aiQueryInput && aiQueryButton && aiResponseArea && aiLoadingIndicator) {
        aiQueryButton.addEventListener('click', performAISearch);
        aiQueryInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') performAISearch();
        });
        console.log("AI Search elements found and event listeners attached.");
    } else {
        logMissingElements('AI Search');
    }

    async function performAISearch() {
        const prompt = aiQueryInput.value.trim();
        if (!prompt) {
            showAIResponse('Please enter a query to analyze.');
            return;
        }

        showLoadingIndicator();
        disableAIButton();

        const chatHistory = createChatHistory(prompt);
        const payload = { contents: chatHistory };

        try {
            const response = await fetchAIResponse(payload);
            handleAIResponse(response);
        } catch (error) {
            handleAIError(error);
        } finally {
            hideLoadingIndicator();
            enableAIButton();
        }
    }

    function showAIResponse(message, style = {}) {
        const styledMessage = `<p style="color: ${style.color || '#000'}; font-style: ${style.style || 'normal'}; text-align: center;">${message}</p>`;
        aiResponseArea.innerHTML = styledMessage;
    }

    function showLoadingIndicator() {
        aiLoadingIndicator.classList.remove('hidden');
    }

    function hideLoadingIndicator() {
        aiLoadingIndicator.classList.add('hidden');
    }

    function disableAIButton() {
        aiQueryButton.disabled = true;
    }

    function enableAIButton() {
        aiQueryButton.disabled = false;
    }

    function createChatHistory(prompt) {
        return [{
            role: "user",
            parts: [{
                text: `Act as a specialized AI for the Ministry of Digital Sovereignty. Provide concise, official answers regarding digital and economic sovereignty, focusing on coercive legal strategies. Query: "${prompt}"`
            }]
        }];
    }

    async function fetchAIResponse(payload) {
        const apiKey = ""; // Placeholder for API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
    }

    function handleAIResponse(result) {
        if (isValidResponse(result)) {
            const text = result.candidates[0].content.parts[0].text;
            showAIResponse(text.replace(/\n/g, '<br>'));
        } else {
            showAIResponse('No valid response received from the AI.', { color: '#ffc107', style: 'italic' });
        }
    }

    function handleAIError(error) {
        console.error('Error fetching AI response:', error);
        showAIResponse(`Error: ${error.message}. Please try again.`, { color: 'var(--red-accent)' });
    }

    function isValidResponse(result) {
        return result.candidates && result.candidates.length > 0 &&
               result.candidates[0].content && result.candidates[0].content.parts &&
               result.candidates[0].content.parts.length > 0;
    }

    // --- AI Case Summary Feature ---
    const summarizeButtons = document.querySelectorAll('.summarize-case-button');
    const aiSummaryModal = document.getElementById('ai-summary-modal');
    const modalCloseButton = aiSummaryModal?.querySelector('.close-button');
    const modalCaseTitle = document.getElementById('modal-case-title');
    const modalSummaryContent = document.getElementById('modal-summary-content');
    const modalLoadingIndicator = aiSummaryModal?.querySelector('#modal-loading-indicator');

    if (summarizeButtons.length && aiSummaryModal && modalCloseButton && modalCaseTitle && modalSummaryContent && modalLoadingIndicator) {
        summarizeButtons.forEach(button => button.addEventListener('click', openCaseSummaryModal));
        modalCloseButton.addEventListener('click', closeCaseSummaryModal);
        aiSummaryModal.addEventListener('click', (event) => {
            if (event.target === aiSummaryModal) closeCaseSummaryModal();
        });
        console.log("AI Case Summary elements found and event listeners attached.");
    } else {
        logMissingElements('AI Case Summary');
    }

    async function openCaseSummaryModal(event) {
        const dataCard = event.target.closest('.data-card');
        if (!dataCard) return;

        const caseTitle = dataCard.getAttribute('data-case-title');
        const caseDescription = dataCard.getAttribute('data-case-description');

        modalCaseTitle.textContent = caseTitle;
        showModalLoadingIndicator();
        showModal();

        const prompt = createSummaryPrompt(caseTitle, caseDescription);
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        try {
            const response = await fetchAIResponse(payload);
            handleSummaryResponse(response);
        } catch (error) {
            handleSummaryError(error);
        } finally {
            hideModalLoadingIndicator();
        }
    }

    function createSummaryPrompt(title, description) {
        return `Analyze the case "${title}" described as "${description}". Discuss its relevance to digital and economic sovereignty, coercive legal strategies, and the "Blackmail Effect." Provide a summary for an official government portal.`;
    }

    function showModal() {
        aiSummaryModal.classList.add('visible');
    }

    function closeCaseSummaryModal() {
        aiSummaryModal.classList.remove('visible');
    }

    function showModalLoadingIndicator() {
        modalLoadingIndicator.classList.remove('hidden');
    }

    function hideModalLoadingIndicator() {
        modalLoadingIndicator.classList.add('hidden');
    }

    function handleSummaryResponse(result) {
        if (isValidResponse(result)) {
            const text = result.candidates[0].content.parts[0].text;
            modalSummaryContent.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        } else {
            modalSummaryContent.innerHTML = '<p style="color: #ffc107; font-style: italic; text-align: center;">Failed to generate summary.</p>';
        }
    }

    function handleSummaryError(error) {
        console.error('Error fetching AI case summary:', error);
        modalSummaryContent.innerHTML = `<p style="color: var(--red-accent); text-align: center;">Error: ${error.message}. Could not retrieve summary.</p>`;
    }

    // Helper function to log missing elements
    function logMissingElements(feature) {
        console.error(`One or more ${feature} elements not found. Feature may not function.`);
        const elements = {
            'AI Search': [aiQueryInput, aiQueryButton, aiResponseArea, aiLoadingIndicator],
            'AI Case Summary': [summarizeButtons, aiSummaryModal, modalCloseButton, modalCaseTitle, modalSummaryContent, modalLoadingIndicator]
        };
        elements[feature].forEach((el, index) => {
            if (!el) console.error(`Missing element ${index + 1}`);
        });
    }
};
```

### Key Enhancements:
1. **Modularity**: Split functionality into smaller, reusable functions.
2. **Error Handling**: Added try-catch blocks and fallback mechanisms.
3. **Readability**: Improved variable naming and added comments for clarity.
4. **Consistency**: Standardized coding style and structure.
5. **Optimization**: Removed redundant code and improved performance.
6. **Logging**: Enhanced logging for debugging and monitoring.

This version is cleaner, more maintainable, and easier to debug.
