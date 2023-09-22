console.log('Popup script loaded!');

// Get references to the necessary elements
const languageSelector = document.getElementById('languageSelector');
const runAnalysisButton = document.getElementById('runAnalysisButton');
const problemStatementContent = document.getElementById('problemStatementContent');
const optimalSolutionContent = document.getElementById('optimalSolutionContent');
const solutionExplanationContent = document.getElementById('solutionExplanationContent');
const timeAndSpaceComplexityContent = document.getElementById('timeAndSpaceComplexityContent');

if (languageSelector) {
    languageSelector.addEventListener('change', () => {
        const selectedLanguage = languageSelector.value;
        chrome.storage.local.set({ programmingLanguage: selectedLanguage });
    });
}

if (runAnalysisButton) {
    runAnalysisButton.addEventListener('click', () => {
        const spinner = document.getElementById('spinner');
        spinner.classList.remove('hidden');

        chrome.runtime.sendMessage({ action: 'runAnalysis' }, (response) => {
            if (response) {
                // Assume response contains analyzed data
                const analysisData = {
                    problemStatement: response.problemStatement || 'No data',
                    optimalSolution: response.optimalSolution || 'No data',
                    solutionExplanation: response.solutionExplanation || 'No data',
                    timeAndSpaceComplexity: response.timeAndSpaceComplexity || 'No data',
                };

                // Save analysis data to storage
                chrome.storage.local.set({ analysisData });

                // Update popup contents
                problemStatementContent.textContent = analysisData.problemStatement;
                optimalSolutionContent.textContent = analysisData.optimalSolution;
                solutionExplanationContent.textContent = analysisData.solutionExplanation;
                timeAndSpaceComplexityContent.textContent = analysisData.timeAndSpaceComplexity;
            }

            spinner.classList.add('hidden');
        });
    });
} else {
    console.error('Run Analysis button element not found');
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['programmingLanguage', 'analysisData'], (result) => {
        if (result.programmingLanguage) {
            languageSelector.value = result.programmingLanguage;
        }
        
        if (result.analysisData) {
            problemStatementContent.textContent = result.analysisData.problemStatement || 'No data';
            optimalSolutionContent.textContent = result.analysisData.optimalSolution || 'No data';
            solutionExplanationContent.textContent = result.analysisData.solutionExplanation || 'No data';
            timeAndSpaceComplexityContent.textContent = result.analysisData.timeAndSpaceComplexity || 'No data';
        }
    });
});
