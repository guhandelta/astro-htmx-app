import { completeWithChatGPT } from "./openai";

const requests: Record< // Map of requests
    string, // request id
    {
        completion: string,
        pending: boolean // To let us know if the process should be stopped or not. It will be held in the memory of the server.
    }
> = {};

// Given a requestId, will give back the request
export const getRequest = (requestId) => {
    return requests[requestId];
}

// A fn() that is called when calling /prompt, will give back the request
export const startRequest = async (prompt:string) => {
    const requestId = Math.random().toString(36).substring(2, 15);
    // Creating an entry into the requests lookup, that has the requestId, and has the completion and pending(which is true as the request is still pending and not complete, yet)
    requests[requestId] = {
        completion: "",
        pending: true,
    };  

    completeWithChatGPT(
        `Funny story about a ${prompt}`,
        // TokenCallback - Set the completion, everytime a text block is received
        (text) => {
            requests[requestId].completion = text;
        },
        // Set the pending to false, when it has ended
        () => {
            requests[requestId].pending = false;
        }
    );
    
    return requestId;
}
