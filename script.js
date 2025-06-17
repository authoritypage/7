window.onload = function() {
    // --- Footer Year Update ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Three.js WebGL Background Setup ---
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) {
        console.error('Canvas element with ID "canvas-bg" not found.');
        // If canvas is critical and missing, you might want to stop further execution or provide a prominent error.
        // For now, we'll log and return.
        return; 
    }

    let scene, camera, renderer;
    let grid, particles;
    const particleCount = 2000; // Increased particle count for more density

    // Mouse variables for interaction
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0; // For smooth interpolation

    // Initialize the Three.js scene
    function init() {
        scene = new THREE.Scene();

        // Camera setup: PerspectiveCamera(fov, aspect, near, far)
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100; // Position camera further back

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Handle high DPI screens
        renderer.setClearColor(0x000000, 0); // Transparent background

        // GridHelper with a subtle blue/red blend for its lines
        // GridHelper(size, divisions, colorCenterLine, colorGrid)
        const size = 300;
        const divisions = 40;
        grid = new THREE.GridHelper(size, divisions, 0x0077B6, 0xB71C1C); // Blue and Red lines
        grid.rotation.x = Math.PI / 2.5; // Tilt the grid for perspective
        grid.position.y = -50; // Lower the grid
        scene.add(grid);

        // Particle System
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
        const colors = new Float32Array(particleCount * 3); // r, g, b for each particle

        const colorRed = new THREE.Color(0xB71C1C); // From CSS var(--red-accent)
        const colorBlue = new THREE.Color(0x0077B6); // From CSS var(--blue-accent)

        for (let i = 0; i < particleCount; i++) {
            // Random positions in a larger volume
            positions[i * 3 + 0] = (Math.random() * 600) - 300; // X from -300 to 300
            positions[i * 3 + 1] = (Math.random() * 600) - 300; // Y from -300 to 300
            positions[i * 3 + 2] = (Math.random() * 600) - 300; // Z from -300 to 300

            // Alternate colors for variety
            if (i % 2 === 0) {
                colorRed.toArray(colors, i * 3);
            } else {
                colorBlue.toArray(colors, i * 3);
            }
        }

        // Set attributes for the geometry
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create a material for the particles
        const material = new THREE.PointsMaterial({
            size: 1.8, // Slightly larger particles
            vertexColors: true, // Use colors defined in the geometry
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending // Essential for glow effect
        });

        // Create the particle system
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Add event listeners for responsiveness and interactivity
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);

        // Start animation loop
        animate();
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate); // Request next frame for smooth animation

        // Smoothly interpolate mouse movement for camera/rotation effect
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Apply subtle rotation to particles based on mouse position
        particles.rotation.x = mouseY * 0.05;
        particles.rotation.y = mouseX * 0.05;

        // Grid movement: continuously move forward
        grid.position.z += 0.05;
        // Reset grid position when it moves too far to create a continuous scrolling effect
        if (grid.position.z > 50) { 
            grid.position.z = -50;
        }

        // Particle subtle drift: update positions for a dynamic effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            // Add a small, unique, oscillating movement to each particle
            positions[i * 3 + 0] += Math.sin(Date.now() * 0.0001 + i * 0.1) * 0.03; // X-axis movement
            positions[i * 3 + 1] += Math.cos(Date.now() * 0.0001 + i * 0.05) * 0.03; // Y-axis movement
            positions[i * 3 + 2] += 0.1; // Make particles slowly move forward along Z-axis
            // If particle moves beyond a certain point, reset its Z position to the back
            if (positions[i * 3 + 2] > 300) {
                positions[i * 3 + 2] = -300;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true; // Crucial: tell Three.js that positions have changed

        renderer.render(scene, camera); // Render the scene with updated positions
    }

    // Handle window resizing: adjust camera aspect ratio and renderer size
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix(); // Update camera's projection matrix
        renderer.setSize(window.innerWidth, window.innerHeight); // Resize renderer
    }

    // Handle mouse movement for interactive background: update targetMouseX/Y for smooth transition
    function onDocumentMouseMove(event) {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to -1 to +1
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize to -1 to +1 (Y-axis inverted for typical screen coords)
    }

    // Call init to start the WebGL scene
    try {
        init();
    } catch (error) {
        console.error("Error initializing Three.js:", error);
        // Fallback message if WebGL is not supported or an error occurs
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
    }

    // --- AI Search Functionality (Existing) ---
    const aiQueryInput = document.getElementById('ai-query-input');
    const aiQueryButton = document.getElementById('ai-query-button');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiLoadingIndicator = document.getElementById('ai-loading-indicator'); // Shared loading indicator

    if (aiQueryInput && aiQueryButton && aiResponseArea && aiLoadingIndicator) {
        aiQueryButton.addEventListener('click', performAISearch);
        aiQueryInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performAISearch();
            }
        });
    } else {
        console.error('One or more AI search elements not found. AI search feature may not function.');
    }

    async function performAISearch() {
        const prompt = aiQueryInput.value.trim();
        if (!prompt) {
            aiResponseArea.innerHTML = '<p style="color: #ffc107; font-style: italic; text-align: center;">Please enter a query to analyze.</p>';
            return;
        }

        // Show loading indicator and clear previous response
        aiLoadingIndicator.classList.remove('hidden');
        aiResponseArea.innerHTML = ''; // Clear previous content
        aiResponseArea.classList.add('ai-response-area'); // Ensure class is present
        aiQueryButton.disabled = true; // Disable button during search

        let chatHistory = [];
        // The prompt for the LLM. It's crucial to define the AI's persona and task clearly.
        chatHistory.push({ 
            role: "user", 
            parts: [{ text: `Act as a highly specialized AI for the Ministry of Digital Sovereignty. Provide concise, official, and direct answers regarding legal concepts related to digital and economic sovereignty, especially concerning coercive legal strategies. Focus on the spirit of the "Blackmail Effect" as a core principle. Here is the query: "${prompt}"` }] 
        });

        const payload = {
            contents: chatHistory
        };

        const apiKey = ""; // Canvas will automatically provide this in runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
            }

            const result = await response.json();

            // Check for valid response structure
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                aiResponseArea.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`; // Display response, convert newlines to <br>
            } else {
                aiResponseArea.innerHTML = '<p style="color: #ffc107; font-style: italic; text-align: center;">No valid response received from the AI. Please try a different query.</p>';
            }

        } catch (error) {
            console.error('Error fetching AI response:', error);
            aiResponseArea.innerHTML = `<p style="color: var(--red-accent); text-align: center;">Error: ${error.message}. Please try again.</p>`;
        } finally {
            aiLoadingIndicator.classList.add('hidden'); // Hide loading indicator
            aiQueryButton.disabled = false; // Re-enable button
        }
    }

    // --- AI Case Summary Feature (New) ---
    const summarizeButtons = document.querySelectorAll('.summarize-case-button');
    const aiSummaryModal = document.getElementById('ai-summary-modal');
    const modalCloseButton = aiSummaryModal ? aiSummaryModal.querySelector('.close-button') : null;
    const modalCaseTitle = document.getElementById('modal-case-title');
    const modalSummaryContent = document.getElementById('modal-summary-content');
    const modalLoadingIndicator = aiSummaryModal ? aiSummaryModal.querySelector('#modal-loading-indicator') : null;

    if (summarizeButtons.length > 0 && aiSummaryModal && modalCloseButton && modalCaseTitle && modalSummaryContent && modalLoadingIndicator) {
        summarizeButtons.forEach(button => {
            button.addEventListener('click', openCaseSummaryModal);
        });

        modalCloseButton.addEventListener('click', closeCaseSummaryModal);
        aiSummaryModal.addEventListener('click', (event) => {
            // Close modal if clicked outside the content area
            if (event.target === aiSummaryModal) {
                closeCaseSummaryModal();
            }
        });
    } else {
        console.error('One or more AI case summary elements not found. Case summary feature may not function.');
    }

    async function openCaseSummaryModal(event) {
        const dataCard = event.target.closest('.data-card');
        if (!dataCard) {
            console.error('Could not find parent data-card for summary button.');
            return;
        }

        const caseTitle = dataCard.getAttribute('data-case-title');
        const caseDescription = dataCard.getAttribute('data-case-description');

        modalCaseTitle.textContent = caseTitle;
        modalSummaryContent.innerHTML = ''; // Clear previous content
        modalLoadingIndicator.classList.remove('hidden');
        aiSummaryModal.classList.add('visible'); // Show the modal

        // Construct a more detailed prompt for the LLM. The specificity helps the AI generate relevant content.
        const prompt = `Provide a detailed legal and strategic analysis of the case "${caseTitle}" which is described as "${caseDescription}". Elaborate on its relevance to concepts of digital and economic sovereignty, and how it might exemplify or counteract "coercive legal strategies" or the "Blackmail Effect." Provide a summary suitable for an official government portal.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = {
            contents: chatHistory
        };

        const apiKey = ""; // Canvas will automatically provide this in runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                modalSummaryContent.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`; // Display response, converting newlines
            } else {
                modalSummaryContent.innerHTML = '<p style="color: #ffc107; font-style: italic; text-align: center;">Failed to generate summary. No valid response from AI.</p>';
            }

        } catch (error) {
            console.error('Error fetching AI case summary:', error);
            modalSummaryContent.innerHTML = `<p style="color: var(--red-accent); text-align: center;">Error: ${error.message}. Could not retrieve summary.</p>`;
        } finally {
            modalLoadingIndicator.classList.add('hidden'); // Hide loading indicator regardless of success or failure
        }
    }

    function closeCaseSummaryModal() {
        aiSummaryModal.classList.remove('visible'); // Hide the modal
    }
};
