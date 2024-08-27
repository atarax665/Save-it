document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('snippetTitle');
    const snippetInput = document.getElementById('newSnippet');
    const addButton = document.getElementById('addButton');
    const snippetsDiv = document.getElementById('snippets');
    const noSnippetsMessage = document.getElementById('noSnippetsMessage');
    const penIcon = document.querySelector('.pen-icon');
    const noteIcon = document.querySelector('.note-icon');
    const mainView = document.querySelector('.main-view');
    const createView = document.querySelector('.create-view');
  
    function loadSnippets() {
      chrome.storage.local.get('snippets', (result) => {
        const snippets = result.snippets || [];
        snippetsDiv.innerHTML = '';
        if (snippets.length === 0) {
          noSnippetsMessage.style.display = 'block';
        } else {
          noSnippetsMessage.style.display = 'none';
          snippets.forEach((item) => {
            const { title, content } = item;
  
            const accordion = document.createElement('div');
            accordion.className = 'accordion';
            accordion.textContent = title;
  
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent accordion click
              navigator.clipboard.writeText(content);
            });
  
            accordion.appendChild(copyBtn);
  
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
  
    function toggleView() {
      mainView.classList.toggle('active');
      createView.classList.toggle('active');
      penIcon.classList.toggle('hidden');
      noteIcon.classList.toggle('hidden');
      if (createView.classList.contains('active')) {
        noteIcon.style.display = 'inline';
        penIcon.style.display = 'none';
      } else {
        penIcon.style.display = 'inline';
        noteIcon.style.display = 'none';
        loadSnippets();
      }
    }
  
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
  
    penIcon.addEventListener('click', () => {
      toggleView();
    });
  
    noteIcon.addEventListener('click', () => {
      toggleView();
    });
  
    loadSnippets();
  });
  