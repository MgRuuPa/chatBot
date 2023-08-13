
const text = document.getElementById("text");
const send = document.getElementById("send");
const chatbox = document.getElementById("chatbox");
const chattoggle = document.querySelector(".chatbot_toggle")
const chatbotclose = document.querySelector(".close")

let userMessage;
const api_key = "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" ;

const createChatDiv = (message, className) => {
    //create a chat <div> element with passed message and className
    const chatDiv = document.createElement("div") ;
    chatDiv.classList.add('chat', className) ;
    let chatContent = className === "output" ? `<p class="mesay">${message}</p>` : `<span class="bot">&#129302;</span> <p class="botsay">${message}</p>`;
    chatDiv.innerHTML= chatContent;
    chatDiv.querySelector(".chat p").textContent = message;
    return chatDiv ;
}

const generateResponse = (incomeChatDiv) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomeChatDiv.querySelector("p");
    //defind the property and message for the api request
    const requestOptions = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Corrected the header key
            "Authorization": `Bearer ${api_key}`,
        },
        body: JSON.stringify({  // Convert body to JSON string
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: userMessage,
                }
            ],
        }),
}
    // send post request to api and get response
    fetch(url,requestOptions) // Pass requestOptions as the second argument
        .then((res) => res.json())
        .then((data) => messageElement.textContent = data.choices[0].message.content)
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Something wrong!!!"
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); // Handle potential errors
};


const sendMessage = () => {
    userMessage = text.value.trim();
    console.log(userMessage);
    if(!userMessage) return;
    text.value = "" ;
    //append the user message to the chatbox
    chatbox.appendChild(createChatDiv(userMessage, "output"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    //display typing while wating for the respone message
    setTimeout(() => {
        const incomeChatDiv = createChatDiv("typing...", "income");
        chatbox.appendChild(incomeChatDiv);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomeChatDiv);
    },600) ;
}

chattoggle.addEventListener("click", () => document.body.classList.toggle("show_chatbot"))
chatbotclose.addEventListener("click", () => document.body.classList.remove("show_chatbot"))
send.addEventListener("click", sendMessage) ;

