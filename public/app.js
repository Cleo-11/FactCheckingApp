function classifyText() {
    const inputText = document.getElementById('inputText').value;
    fetch('/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('result').innerText = `Prediction: ${data.prediction}`;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  