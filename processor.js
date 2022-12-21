document.querySelectorAll("code").forEach(element => {
    chrome.storage.sync.get('active', function(result) {
        if (result && result.active) {
            chrome.storage.sync.get('records', function(result) {
                let code = element.innerHTML;
                result.records.forEach(record => {
                    code = code.replaceAll(record.target, record.replace);
                });
                element.innerHTML = code;
            });
        }
    });
});