let checkTimeout;
let attempts = 0;
let programmingLanguage;
let problemContent;

async function fetchGPT4Solution() {
    try {
        if (!problemContent) {
            throw new Error('Problem content is undefined or null');
        }

        const problemPrompt = `Develop a Python function to solve the following problem written in ${programmingLanguage}: 
        Problem Statement: ${problemContent}`;

        let optimalSolution = await callOpenAIApi(problemPrompt);
        console.log('Optimal Solution:', optimalSolution);

        const explanationPrompt = `In 3 sentences, give a brief explanation for the following code:
        
        Code:
        ${optimalSolution}`;

        let solutionExplanation = await callOpenAIApi(explanationPrompt);
        console.log('In-depth Explanation:', solutionExplanation);

        const complexityPrompt = `What is the time and space complexity of the following code (just give the complexities no explanation):

        Code:
        ${optimalSolution}`;

        let timeAndSpaceComplexity = await callOpenAIApi(complexityPrompt);
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ 
                prompt: promptText,
                max_tokens: 1000,
                temperature: 0.7
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
    const problemElement = document.querySelector('div[data-track-load="description_content"]');

    if (problemElement) {
        problemContent = problemElement.textContent;
        console.log('Problem Content:', problemContent);
        clearTimeout(checkTimeout);
    } else {
        console.error('Problem element not found');
        if (attempts < 20) {  // Increased maximum number of attempts
            attempts += 1;
            checkTimeout = setTimeout(checkForProblemElement, 1000);  // 1000ms or 1 second delay between checks
        }
    }
}


function startChecking() {
    chrome.storage.local.get('programmingLanguage', (result) => {
        programmingLanguage = result.programmingLanguage || 'python';
        setTimeout(() => checkForProblemElement(), 1000);  // 1000ms or 1 second delay
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startChecking);
} else {
    startChecking();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
