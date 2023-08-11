import https from "node:https";

export const completeWithChatGPT = (
  // Takes a prompt, like 'A funny story about a dog'
  prompt: string,
  // This token is to confirm that response has been received from ChatGPT, call the API again with the text with the completed string in it,  
  tokenCallback: (text: string) => void,
  // endCallback() is call when the callback ends
  endCallback: () => void,
  // Can get some options, if any options is required
  options: object = {}
) => {
  let text = "";
  // Just a simple req to OpenAI platform  
  const req = https.request(
    {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
    },
    // stream: true => will send a bunch of packets, which would be available in the callback res, 
    function (res) {
      res.on("data", (chunks) => {
        // The data in the res would have a bunch of data chunks in it
        for (const chunk of chunks.toString().split("\n")) {
          if (chunk.toString().startsWith("data: ")) {
            const data = chunk.toString().replace(/^data: /, "");
            try {
              // Get the choice from the data  
              const content = JSON.parse(data)?.choices?.[0]?.delta?.content;
              if (content) {
                text += content;
                tokenCallback(text);
              }
            } catch (e) {}
          }
        }
      });
      // Finally when it's all over `end` would be received, meaning the end of the stream, and also get the endcallback
      res.on("end", endCallback);
    }
  );
  // Req Body
  const body = JSON.stringify({
    // AI Model
    model: "gpt-3.5-turbo",
    max_tokens: 200,
    temperature: 0.5,
    n: 1,
    stop: ["\n"],
    stream: true,
    ...options,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  req.on("error", (e) => {
    console.error("problem with request:" + e.message);
  });

  req.write(body);
  req.end();
};