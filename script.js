// AI Toxicity Analysis using OpenAI API
async function analyzeToxicity() {
  const text = document.getElementById('textInput').value;
  const resultsDiv = document.getElementById('results');

  if (!text.trim()) {
    resultsDiv.innerHTML = "<p>Please enter text to analyze.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Analyzing...</p>";

  try {
    const response = await fetch('/api/toxicityAnalyzer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    const toxicityLevel = data.toxicityLevel;
    const traits = data.traits;

    resultsDiv.innerHTML = `
      <h3>Analysis Results</h3>
      <p>Toxicity Level: ${toxicityLevel}%</p>
      <p>Detected Traits: ${traits.join(', ')}</p>
    `;
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error analyzing text. Please try again.</p>";
  }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
