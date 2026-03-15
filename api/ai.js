export default async function handler(req, res) {

const userMessage = req.query.message || "Hello";

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
role: "user",
content: userMessage
}
]
})
});

const data = await response.json();

res.status(200).json(data);

}
