document.addEventListener('DOMContentLoaded', init, true);

function init() {
    setupEvents();
    loadData();
}

function setupEvents() {
    document.querySelector('#btn-plus').addEventListener('click', addEmptyRecord);
    document.querySelector('#btn-clean').addEventListener('click', cleanData);
    document.querySelector('#btn-reset').addEventListener('click', resetData);
    document.querySelector('#active-box').addEventListener('click', activate);
}

function activate(event) {
    chrome.storage.sync.set({'active': event.target.checked});
}

function saveData() {
    const data = []; 
    const records = document.querySelector('#records').children;
    for (let i = 0; i < records.length; i++) {
        let target = records[i].querySelector('.target').value;
        let replace = records[i].querySelector('.replace').value;
        data.push(new Record(target, replace));
    }
    chrome.storage.sync.set({'records': data});
}

function addRecord(target, replace) {
    const container = document.querySelector('#records');
    let template = document.querySelector('#record').innerHTML;
    template = template.replace('{{target}}', target);
    template = template.replace('{{replace}}', replace);
    container.insertAdjacentHTML('beforeend', template);
    container.lastElementChild.querySelector('.btn-remove').addEventListener('click', removeRecord);
    container.lastElementChild.querySelector('.target').addEventListener('change', saveData);
    container.lastElementChild.querySelector('.replace').addEventListener('change', saveData);
}

function addEmptyRecord() {
    addRecord('', '');
}

function removeRecord(event) {
    const container = document.querySelector('#records');
    if (container.childElementCount > 1) {
        event.target.parentNode.parentNode.remove();
        saveData();
    }
}

function resetData() {
    if(confirm('Do you really want to reset data to default?')) {
        loadDefaultData();
    }
}

function loadData() {
    chrome.storage.sync.get('records', function(result) {
        if (!result || !result.records || !result.records.length) {
            loadDefaultData();
        } else {
            result.records.forEach(record => {
                addRecord(record.target, record.replace);
            });
        }
    });
    chrome.storage.sync.get('active', function(result) {
        if (result && result.active) {
            document.querySelector('#active-box').setAttribute('checked', '');
        } else {
            document.querySelector('#active-box').removeAttribute('checked');
        }
    });
}

function loadDefaultData() {
    document.querySelector('#records').innerHTML = '';
    DEFAULT_DATA.forEach(record => {
        addRecord(record.target, record.replace);
    });
    saveData();
}

function cleanData() {
    if(confirm('Do you really want to delete all data?')) {
        document.querySelector('#records').innerHTML = '';
        addEmptyRecord();
        saveData();
    }
}

function Record(target, replace) {
    this.target = target;
    this.replace = replace;
}

DEFAULT_DATA = [
    { target: 'if', replace: 'for' },
    { target: 'while', replace: 'if' },
    { target: 'let', replace: 'set' },
    { target: 'var', replace: 'const' },
    { target: 'continue', replace: 'return' },
    { target: 'null', replace: 'true' },
    { target: 'false', replace: '!!-1' },
    { target: 'typeof', replace: 'throw' },
    { target: 'int', replace: 'char' },
    { target: 'double', replace: 'number' },
    { target: 'str', replace: 'list[char]' },
    { target: 'String', replace: 'List<char>' },
    { target: 'public', replace: 'protected' },
    { target: 'private', replace: 'static' },
    { target: 'prompt', replace: 'dialog' },
    { target: 'enum', replace: 'trait' },
    { target: 'parseInt', replace: 'eval' },
    { target: 'ArrayList', replace: 'Queue' },
    { target: 'forEach', replace: 'enumerate' },
    { target: 'filter', replace: 'validate' },
    { target: 'reduce', replace: 'compress' },
    { target: 'switch', replace: 'case' },
    { target: 'function', replace: 'void' },
    { target: 'break', replace: 'continue' },
    { target: '++', replace: '--' },
    { target: '+=', replace: '-=' },
    { target: '==', replace: '!=' },
    { target: '*', replace: '/' },
    { target: '&&', replace: '<>' },
]
