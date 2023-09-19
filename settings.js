document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('programmingLanguage', (result) => {
        if (result.programmingLanguage) {
            document.getElementById('programmingLanguage').value = result.programmingLanguage;
        }
    });

    document.getElementById('saveSettings').addEventListener('click', () => {
        const programmingLanguage = document.getElementById('programmingLanguage').value;
        chrome.storage.local.set({ programmingLanguage }, () => {
            alert('Settings saved successfully!');
        });
    });
});
