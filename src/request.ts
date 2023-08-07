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
    const requestId = Math.random().toString(36).substring(2,15);
    // Craeting an entry into the requests lookup, that has the requestId, and has the completion and pending(which is true as the request is still pending and not complete, yet)
    requests[requestId] = {
        completion: "",
        pending: true
    };

    // A timer to add prompt on to itself for a bunch of times, and finally finishes until it has created a string that is big enough
    const interval = setTimeout(() =>{
        // Add a prompt to the completion string, every 100ms, that alraedy has a bunch of prompts alrady added on to it. Then after it reaches 100 chars, it completes, by assigning pending as false, and clear the interval
        requests[requestId].completion += prompt + " ";
        if(requests[requestId].completion.length > 100){
            clearInterval(interval);
            requests[requestId].pending = false;
        }
    },100);

    return requestId;
}
