export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const message = req.query.message;
  
  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       "Authorization": "Bearer " + process.env.GOJO
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
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
    });

    const data = await response.json();
    
    return res.status(200).json({
      choices: [{
        message: {
          content: data.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro ao processar requisição" });
  }
}
