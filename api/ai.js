export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const message = req.query.message;
  console.log("1. Mensagem recebida:", message);
  
  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  try {
    console.log("2. GROQ_API_KEY existe?", !!process.env.GROQ_API_KEY);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
     body: JSON.stringify({
  model: "llama3-8b-8192",
  messages: [
    {
      role: "system",
      content: "Você é um assistente especializado em criar planos de aula de inglês. Responda sempre em português do Brasil."
    },
    {
      role: "user",
      content: message
    }
  ],
  temperature: 0.7
})

    console.log("3. Status da resposta:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("4. Erro da Groq:", errorText);
      return res.status(500).json({ 
        error: "Erro da API Groq", 
        status: response.status,
        details: errorText 
      });
    }

    const data = await response.json();
    console.log("5. Resposta recebida:", data);
    
    return res.status(200).json({
      choices: [{
        message: {
          content: data.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error("6. Erro no catch:", error);
    return res.status(500).json({ 
      error: "Erro ao processar requisição",
      message: error.message 
    });
  }
}
