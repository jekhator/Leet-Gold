console.log('Popup script loaded!');

const languageSelector = document.getElementById('languageSelector');
const runAnalysisButton = document.getElementById('runAnalysisButton');
const problemStatementContent = document.getElementById('problemStatementContent');
const optimalSolutionContent = document.getElementById('optimalSolutionContent');
const solutionExplanationContent = document.getElementById('solutionExplanationContent');

if (languageSelector) {
    languageSelector.addEventListener('change', () => {
        const selectedLanguage = languageSelector.value;
        chrome.storage.local.set({ programmingLanguage: selectedLanguage });
    });
}

if (runAnalysisButton) {
    runAnalysisButton.addEventListener('click', () => {
        console.log('Run Analysis button clicked');
        chrome.runtime.sendMessage({ action: 'runAnalysis' }, (response) => {
            console.log(response);

            if (response) {
                problemStatementContent.textContent = response.problemStatement || 'No data';
                optimalSolutionContent.textContent = response.optimalSolution || 'No data';
                solutionExplanationContent.textContent = response.solutionExplanation || 'No data';
            }
        });
    });
} else {
    console.error('Run Analysis button element not found');
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('programmingLanguage', (result) => {
        if (result.programmingLanguage) {
            languageSelector.value = result.programmingLanguage;
        }
    });
});

function handleStartAnalysisClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'startAnalysis' }, (response) => {
            if (response) {
                document.getElementById('problemStatement').innerText = response.problemStatement;
                document.getElementById('optimalSolution').innerText = response.optimalSolution;
                document.getElementById('solutionExplanation').innerText = response.solutionExplanation;
            } else {
                console.error('Error fetching response from content script');
            }
        });
    });
}

document.getElementById('startAnalysisButton').addEventListener('click', handleStartAnalysisClick);
