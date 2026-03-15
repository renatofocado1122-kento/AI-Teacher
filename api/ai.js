export default async function handler(req, res) {

const message = req.query.message;

if(!message){
return res.status(400).json({error:"No message"});
}

const response = await fetch("https://api.groq.com/openai/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer SUA_GROQ_KEY"
},
body:JSON.stringify({
model:"llama-3.3-70b-versatile",
messages:[
{role:"user",content:message}
]
})
});

const data = await response.json();

res.status(200).json(data);

}
