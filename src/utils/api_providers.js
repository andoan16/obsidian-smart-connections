const { requestUrl } = require('obsidian');

async function call_openai_api(prompt, options) {
  const api_key = options.api_key;
  const model = options.model || 'gpt-3.5-turbo';
  const max_tokens = options.max_tokens || 150;
  const temperature = options.temperature || 0.7;
  
  const headers = {
    'Authorization': `Bearer ${api_key}`,
    'Content-Type': 'application/json'
  };
  
  const body = JSON.stringify({
    model: model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: max_tokens,
    temperature: temperature
  });
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: body
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

async function call_google_gemini_api(prompt, options) {
  const api_key = options.api_key;
  const model = options.model || 'gemini-pro';
  const max_tokens = options.max_tokens || 150;
  const temperature = options.temperature || 0.7;
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${api_key}`;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const body = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      maxOutputTokens: max_tokens,
      temperature: temperature
    }
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });
    
    // Check for HTTP errors
    if (!response.ok) {
      let errorMessage = `Google Gemini API error: ${response.status} ${response.statusText}`;
      
      // Try to parse error details from response
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (parseError) {
        // If we can't parse the error, just use the status text
        console.warn('Could not parse error response from Gemini API:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      throw new Error('Invalid response format from Google Gemini API: No candidates found');
    }
    
    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
      throw new Error('Invalid response format from Google Gemini API: No content parts found');
    }
    
    const content = candidate.content.parts[0].text;
    if (typeof content !== 'string') {
      throw new Error('Invalid response format from Google Gemini API: Content is not a string');
    }
    
    return content.trim();
  } catch (error) {
    // Handle network errors, parsing errors, etc.
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error when calling Google Gemini API. Please check your internet connection.');
    }
    
    console.error('Error calling Google Gemini API:', error);
    throw error;
  }
}

module.exports = {
  call_openai_api,
  call_google_gemini_api
};