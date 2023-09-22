let programmingLanguage;
let problemContent;

async function fetchGPT4Solution() {
    try {
        if (!problemContent) {
            throw new Error('Problem content is undefined or null');
        }

        let optimalSolution = await callOpenAIApi(`Solve this in ${programmingLanguage}: ${problemContent}`);
        console.log('Optimal Solution:', optimalSolution);

        let solutionExplanation = await callOpenAIApi(`Explain this: ${optimalSolution}`);
        console.log('In-depth Explanation:', solutionExplanation);

        let timeAndSpaceComplexity = await callOpenAIApi(`Time and Space Complexity?: ${optimalSolution}`);
        console.log('Time and Space Complexity:', timeAndSpaceComplexity);

        return {
            optimalSolution,
            solutionExplanation,
            timeAndSpaceComplexity
        };
    } catch (error) {
        console.error('Error fetching solution from GPT-4:', error);
        return null;
    }
}


async function callOpenAIApi(promptText) {
    try {
        let response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer API_KEY",
                "OpenAI-Organization": "ORG_KEY" 
            },
            body: JSON.stringify({ 
                prompt: promptText,
                max_tokens: 200,
                temperature: 0.7,
                frequency_penalty: 0,
                presence_penalty: 0
             })
        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.statusText}`);
        }
        
        let responseData = await response.json();
        if (!responseData.choices) {
            throw new Error('Incomplete response from API: "choices" property is missing');
        }
        if (!responseData.choices[0]) {
            throw new Error('Incomplete response from API: "choices[0]" property is missing');
        }
        if (!responseData.choices[0].text) {
            throw new Error('Incomplete response from API: "choices[0].text" property is missing');
        }

        return responseData.choices[0].text.trim();
    } catch (error) {
        console.error('Error in API call:', error);
        throw error;
    }
}


function checkForProblemElement() {
    setTimeout(() => {
        const problemElement = document.querySelector('div[data-track-load="description_content"]');
    
        if (problemElement) {
            problemContent = problemElement.textContent;
            console.log('Problem Content:', problemContent);
        } else {
            console.error('Problem element not found');
        }
    }, 5000); // Delay of 5000 milliseconds (5 seconds)
}


function startChecking() {
    chrome.storage.local.get('programmingLanguage', (result) => {
        programmingLanguage = result.programmingLanguage || 'python';
        console.log('Programming language retrieved:', programmingLanguage);
        setTimeout(() => checkForProblemElement(), 1000);  // 1000ms or 1 second delay
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startChecking);
} else {
    startChecking();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchProblemStatement') {
        console.log('fetchProblemStatement action received in content script');
        
        if (problemContent) {
            sendResponse({ problemStatement: problemContent });
        } else {
            sendResponse({ error: 'Problem content is undefined or null' });
        }

        return true; // indicates that the response is sent asynchronously
    }
    if (request.action === 'startAnalysis') {
        console.log('Start Analysis action received in content script');

        fetchGPT4Solution()
            .then((result) => {
                if (result) {
                    sendResponse({
                        problemStatement: problemContent,
                        optimalSolution: result.optimalSolution,
                        solutionExplanation: result.solutionExplanation,
                        timeAndSpaceComplexity: result.timeAndSpaceComplexity
                    });
                } else {
                    sendResponse({error: 'Analysis failed'});
                }
            })
            .catch(error => {
                console.error('Error during analysis:', error);
                sendResponse({error: 'Analysis failed'});
            });

        return true;
    }
});