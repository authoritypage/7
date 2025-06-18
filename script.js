// Ensure Three.js is loaded before executing any Three.js-related code
if (typeof THREE === 'undefined') {
    console.warn("Three.js library not loaded. Some interactive features may be unavailable.");
} else {
    // Three.js WebGL Background Setup - Only execute if Three.js is available
    window.addEventListener('load', () => {
        const canvas = document.getElementById('canvas-bg');
        if (!canvas) {
            console.error('Canvas element with ID "canvas-bg" not found. Three.js background cannot be initialized.');
            return;
        }

        let scene, camera, renderer;
        let grid, particles;
        const particleCount = 2500; // Increased particle count for more density
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        function initThreeJS() {
            scene = new THREE.Scene();

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 120; // Slightly further back

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 0); // Transparent background

            // GridHelper
            const size = 300;
            const divisions = 40;
            // Use subtle shades that match the theme
            grid = new THREE.GridHelper(size, divisions, 0x34495e, 0x7f8c8d);
            grid.rotation.x = Math.PI / 2.5;
            grid.position.y = -50;
            scene.add(grid);

            // Particle System
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            // Theme colors from CSS variables
            const colorPrimary = new THREE.Color(0x3498db); // --color-primary
            const colorAccentRed = new THREE.Color(0xe74c3c); // --color-accent-red

            for (let i = 0; i < particleCount; i++) {
                // Random positions in a larger volume
                positions[i * 3 + 0] = (Math.random() * 600) - 300;
                positions[i * 3 + 1] = (Math.random() * 600) - 300;
                positions[i * 3 + 2] = (Math.random() * 600) - 300;

                // Alternate colors for variety, or blend for subtle effect
                if (i % 2 === 0) {
                    colorPrimary.toArray(colors, i * 3);
                } else {
                    colorAccentRed.toArray(colors, i * 3);
                }
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 2, // Slightly larger particles
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);

            animate();
        }

        function animate() {
            requestAnimationFrame(animate);

            // Smoothly interpolate mouse movement
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Apply subtle rotation to particles and grid based on mouse position
            particles.rotation.x = mouseY * 0.03;
            particles.rotation.y = mouseX * 0.03;
            grid.rotation.y = mouseX * 0.01; // Also rotate grid slightly

            // Grid movement: continuously move forward and reset
            grid.position.z += 0.08;
            if (grid.position.z > 100) {
                grid.position.z = -200; // Reset further back to avoid visible jump
            }

            // Particle subtle drift
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 0] += Math.sin(Date.now() * 0.00008 + i * 0.1) * 0.02;
                positions[i * 3 + 1] += Math.cos(Date.now() * 0.00008 + i * 0.05) * 0.02;
                positions[i * 3 + 2] += 0.15; // Move particles forward

                if (positions[i * 3 + 2] > 300) {
                    positions[i * 3 + 2] = -300; // Reset particle to the back
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onDocumentMouseMove(event) {
            targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        // Initialize the Three.js scene
        try {
            initThreeJS();
        } catch (error) {
            console.error("Error initializing Three.js:", error);
            // Fallback message if WebGL is not supported or an error occurs
            const fallbackMessage = document.createElement('div');
            fallbackMessage.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                padding: 15px;
                background-color: var(--color-accent-red);
                color: white;
                text-align: center;
                font-family: var(--font-body);
                z-index: 9999;
                font-size: 0.9em;
            `;
            fallbackMessage.textContent = 'Interactive background could not load. Your browser may not support WebGL.';
            document.body.prepend(fallbackMessage);
        }
    });
}


// General JavaScript for the rest of the site (footer year, nav toggle, AI Console)
document.addEventListener('DOMContentLoaded', () => {
    // Update current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('open');
            const isExpanded = navToggle.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close nav when a link is clicked (for smooth scrolling)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', false);
                }
            });
        });
    }

    // --- AI Analysis Console Functionality ---
    const aiQueryInput = document.getElementById('ai-query-input');
    const aiQueryButton = document.getElementById('ai-query-button');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiLoadingIndicator = document.getElementById('ai-loading-indicator');

    if (aiQueryInput && aiQueryButton && aiResponseArea && aiLoadingIndicator) {
        aiQueryButton.addEventListener('click', performAISearch);
        aiQueryInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performAISearch();
            }
        });
        console.log("AI Analysis Console elements found and event listeners attached.");
    } else {
        console.warn('One or more AI Analysis Console elements not found. AI feature may not function.');
    }

    async function performAISearch() {
        const prompt = aiQueryInput.value.trim();
        if (!prompt) {
            aiResponseArea.innerHTML = '<p style="color: var(--color-light-text); font-style: italic; text-align: center;">Please enter a query to analyze.</p>';
            return;
        }

        aiLoadingIndicator.classList.remove('hidden');
        aiResponseArea.innerHTML = ''; // Clear previous content
        aiQueryButton.disabled = true; // Disable button during search

        // IMPORTANT: For actual functionality, you need to replace this with a real API key and endpoint.
        // This is a placeholder for demonstration purposes.
        // Example: Using a mock API or a service like Google Gemini API (requires setup and a backend to keep key secure)
        const mockApiResponse = new Promise(resolve => {
            setTimeout(() => {
                let responseText = "";
                const lowerPrompt = prompt.toLowerCase();

                if (lowerPrompt.includes("ambulance contract")) {
                    responseText = "The Santa Barbara County ambulance contract issue involves a controversial decision to award a new contract despite a higher-ranked bidder. This resulted in the purchase of 35 ambulances that remain unused, leading to significant financial costs and a lawsuit from the previous provider. The situation highlights concerns about procurement transparency and public safety resource allocation.";
                } else if (lowerPrompt.includes("homelessness funds")) {
                    responseText = "Investigations into homelessness funds in Santa Barbara County are part of a broader federal probe into statewide spending. Billions of dollars are under scrutiny for potential fraud and mismanagement, with significant amounts unaccounted for. This raises serious questions about the effectiveness and accountability of programs designed to address the homelessness crisis.";
                } else if (lowerPrompt.includes("judge michael j. carrozzo") || lowerPrompt.includes("judicial misconduct")) {
                    responseText = "Former Santa Barbara County Judge Michael J. Carrozzo resigned and was permanently banned from the bench due to admitted willful misconduct. This included illegally practicing law while serving as a judge, a severe ethics violation that eroded public trust in the judiciary and judicial integrity within the county.";
                } else if (lowerPrompt.includes("jail conditions") || lowerPrompt.includes("murray v. county of santa barbara")) {
                    responseText = "The 'Murray v. County of Santa Barbara' class-action lawsuit is an ongoing federal litigation concerning severe deficiencies in the county jail. It addresses critical issues such as inadequate medical and mental health care for inmates, insufficient disability accommodations, and concerns regarding excessive solitary confinement, pointing to systemic failures in correctional facilities.";
                } else if (lowerPrompt.includes("fiscal mismanagement") || lowerPrompt.includes("county spending")) {
                    responseText = "Reports indicate significant fiscal mismanagement in Santa Barbara County, including questionable decision-making and alleged misuse of funds. Specific concerns involve supervisor pay raises and the financial fallout from the botched ambulance contract, signaling a need for greater financial oversight and accountability in public spending.";
                }
                else {
                    responseText = `AI Response for "${prompt}": While our AI has access to extensive public data, this specific query may require more context or is outside the scope of detailed public records available for immediate analysis. Please try rephrasing or focusing on a specific county issue listed on this portal.`;
                }
                resolve({ candidates: [{ content: { parts: [{ text: responseText }] } }] });
            }, 1500); // Simulate network delay
        });

        try {
            // Replace `mockApiResponse` with actual fetch to your AI API
            // const response = await fetch(apiUrl, { ... });
            // const result = await response.json();
            const result = await mockApiResponse; // Use mock response for demo

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                aiResponseArea.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
            } else {
                aiResponseArea.innerHTML = '<p style="color: var(--color-accent-red); text-align: center;">No valid response received from the AI. Please try a different query.</p>';
            }

        } catch (error) {
            console.error('Error fetching AI response:', error);
            aiResponseArea.innerHTML = `<p style="color: var(--color-accent-red); text-align: center;">Error: ${error.message}. Please try again.</p>`;
        } finally {
            aiLoadingIndicator.classList.add('hidden');
            aiQueryButton.disabled = false;
        }
    }
});