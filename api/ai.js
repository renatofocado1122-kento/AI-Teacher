export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    console.log("1️⃣ Iniciando função...");
    
    const message = req.query.message;
    console.log("2️⃣ Message:", message);
    
    if (!message) {
      console.log("3️⃣ Sem mensagem");
      return res.status(200).json({ error: "No message" });
    }

    // Verificar chave
    console.log("4️⃣ Verificando GROQ_API_KEY...");
    console.log("   Existe?", !!process.env.GROQ_API_KEY);
    console.log("   Primeiros caracteres:", process.env.GROQ_API_KEY?.substring(0, 10));
    
    if (!process.env.GROQ_API_KEY) {
      console.log("5️⃣ Chave não encontrada!");
      return res.status(200).json({ error: "GROQ_API_KEY not found" });
    }

    console.log("6️⃣ Fazendo fetch para Groq...");
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
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
        max_tokens: 500
      })
    });

    console.log("7️⃣ Status da resposta:", response.status);
    console.log("8️⃣ Headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.log("9️⃣ Erro da Groq:", errorText);
      return res.status(200).json({ 
        error: "Groq API Error",
        status: response.status,
        details: errorText,
        stage: "groq_response_not_ok"
      });
    }

    const data = await response.json();
    console.log("🔟 Resposta recebida da Groq");
    
    if (!data.choices?.[0]?.message?.content) {
      console.log("1️⃣1️⃣ Resposta vazia:", JSON.stringify(data));
      return res.status(200).json({ 
        error: "Empty response from Groq",
        data: data,
        stage: "empty_response"
      });
    }

    console.log("1️⃣2️⃣ Sucesso! Enviando resposta...");
    return res.status(200).json({
      success: true,
      content: data.choices[0].message.content
    });

  } catch (error) {
    console.log("💥 ERRO CATASTRÓFICO:");
    console.log("   Nome:", error.name);
    console.log("   Mensagem:", error.message);
    console.log("   Stack:", error.stack);
    
    return res.status(200).json({ 
      error: "Erro catastrófico",
      name: error.name,
      message: error.message,
      stack: error.stack,
      stage: "catch_block"
    });
  }
}
