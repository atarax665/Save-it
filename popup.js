document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('snippetTitle');
    const snippetInput = document.getElementById('newSnippet');
    const addButton = document.getElementById('addButton');
    const snippetsDiv = document.getElementById('snippets');
    const noSnippetsMessage = document.getElementById('noSnippetsMessage');
    const penIcon = document.querySelector('.pen-icon');
    const noteIcon = document.querySelector('.note-icon');
    const binIcon = document.querySelector('.bin-icon');
    const mainView = document.querySelector('.main-view');
    const createView = document.querySelector('.create-view');
    let deleteMode = false;

    function loadSnippets() {
        chrome.storage.local.get('snippets', (result) => {
            const snippets = result.snippets || [];
            snippetsDiv.innerHTML = '';
            if (snippets.length === 0) {
                noSnippetsMessage.style.display = 'block';
                binIcon.classList.add('disabled');
            } else {
                noSnippetsMessage.style.display = 'none';
                binIcon.classList.remove('disabled');
                snippets.forEach((item, index) => {
                    const { title, content } = item;

                    const accordion = document.createElement('div');
                    accordion.className = 'accordion';
                    accordion.textContent = title;

                    const actionBtn = document.createElement('button');
                    actionBtn.className = 'action-btn';
                    actionBtn.textContent = deleteMode ? 'Delete' : 'Copy';
                    actionBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (deleteMode) {
                            deleteSnippet(index);
                        } else {
                            navigator.clipboard.writeText(content).then(() => {
                                actionBtn.textContent = '✓ Copied';
                                setTimeout(() => {
                                    actionBtn.textContent = 'Copy';
                                }, 2000);
                            });
                        }

                    });

                    accordion.appendChild(actionBtn);

                    const panel = document.createElement('div');
                    panel.className = 'panel';
                    panel.textContent = content;

                    accordion.addEventListener('click', () => {
                        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                    });

                    snippetsDiv.appendChild(accordion);
                    snippetsDiv.appendChild(panel);
                });
            }
        });
    }

    function deleteSnippet(index) {
        chrome.storage.local.get('snippets', (result) => {
            const snippets = result.snippets || [];
            snippets.splice(index, 1);
            chrome.storage.local.set({ snippets }, () => {
                loadSnippets();
            });
        });
    }

    function toggleView() {
        mainView.classList.toggle('active');
        createView.classList.toggle('active');
        penIcon.classList.toggle('hidden');
        noteIcon.classList.toggle('hidden');
        binIcon.classList.toggle('hidden');
        if (createView.classList.contains('active')) {
            noteIcon.style.display = 'inline';
            penIcon.style.display = 'none';
            binIcon.style.display = 'none';
        } else {
            penIcon.style.display = 'inline';
            noteIcon.style.display = 'none';
            binIcon.style.display = 'inline';
            loadSnippets();
        }
    }

    binIcon.addEventListener('click', () => {
        if (!binIcon.classList.contains('disabled')) {
            deleteMode = !deleteMode;
            loadSnippets();
        }
    });

    addButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = snippetInput.value.trim();
        if (title && content) {
            chrome.storage.local.get('snippets', (result) => {
                const snippets = result.snippets || [];
                snippets.push({ title, content });
                chrome.storage.local.set({ snippets }, () => {
                    titleInput.value = '';
                    snippetInput.value = '';
                    loadSnippets();
                    toggleView();
                });
            });
        }
    });

    penIcon.addEventListener('click', toggleView);
    noteIcon.addEventListener('click', toggleView);

    loadSnippets();
});
