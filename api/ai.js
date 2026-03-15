export default async function handler(req, res) {
  console.log("🚀 INÍCIO DA FUNÇÃO");
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const message = req.query.message;
  console.log("📨 Mensagem recebida:", message);
  
  if (!message) {
    console.log("❌ Sem mensagem");
    return res.status(400).json({ error: "No message" });
  }

  // Verificar se a chave existe
  if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY não definida!");
    return res.status(500).json({ error: "API key not configured" });
  }
  console.log("✅ GROQ_API_KEY existe");

  try {
    console.log("🔄 Fazendo requisição para Groq...");
    
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
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    console.log("📊 Status da resposta:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro da Groq:", errorText);
      return res.status(500).json({ 
        error: "Erro da API Groq", 
        status: response.status,
        details: errorText 
      });
    }

    const data = await response.json();
    console.log("✅ Resposta recebida da Groq");
    
    if (!data.choices?.[0]?.message?.content) {
      console.error("❌ Resposta vazia da Groq:", data);
      return res.status(500).json({ error: "Resposta vazia da Groq" });
    }

    console.log("🎉 Sucesso! Enviando resposta...");
    return res.status(200).json({
      choices: [{
        message: {
          content: data.choices[0].message.content
        }
      }]
    });

  } catch (error) {
    console.error("💥 ERRO CATASTRÓFICO:", error);
    console.error("Nome do erro:", error.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    
    return res.status(500).json({ 
      error: "Erro ao processar requisição",
      message: error.message,
      name: error.name
    });
  } finally {
    console.log("🏁 FIM DA FUNÇÃO");
  }
}
