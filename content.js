(() => {
  console.log("Content script carregado.");

  // Função para verificar e extrair o código da URL
  function checkUrlAndExtractCode() {
    const url = window.location.href;
    const hubspotPattern = /https:\/\/app\.hubspot\.com\/contacts\/19499302\/record\/0-5\/(\d+)/;

    // Verificar se a URL corresponde ao padrão
    const match = url.match(hubspotPattern);
    if (match && match[1]) {
      const code = match[1];
      console.log(`Código extraído da URL: ${code}`);
      createHoverWindow(code);
    }
  }

  // Função para verificar e extrair o código do elemento <h1>
  function checkElementAndExtractCode() {
    const element = document.querySelector('h1.z-title.z-title--size-small.my-none[id^="codent-"]');
    if (element) {
      const code = element.id.split('-')[1];
      console.log(`Código encontrado no elemento: ${code}`);
      createHoverWindow(code);
    }
  }

  // Função para criar a janela flutuante com o número e o botão "Copiar"
  function createHoverWindow(code) {
    // Remover uma janela existente para evitar duplicações
    const existingWindow = document.getElementById('hover-window');
    if (existingWindow) existingWindow.remove();

    // Criar o contêiner da janela flutuante
    const hoverWindow = document.createElement('div');
    hoverWindow.id = 'hover-window';
    hoverWindow.style.position = 'fixed';
    hoverWindow.style.top = '70px';
    hoverWindow.style.right = '20px';
    hoverWindow.style.padding = '10px';
    hoverWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    hoverWindow.style.color = 'white';
    hoverWindow.style.borderRadius = '5px';
    hoverWindow.style.zIndex = '9999';
    hoverWindow.style.fontFamily = 'Arial, sans-serif';
    hoverWindow.style.fontSize = '14px';

    // Criar o texto com o código
    const codeText = document.createElement('span');
    codeText.textContent = `Código: ${code}`;
    hoverWindow.appendChild(codeText);

    // Criar o botão de copiar
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.marginLeft = '10px';
    copyButton.style.padding = '5px 10px';
    copyButton.style.backgroundColor = '#007bff';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '3px';
    copyButton.style.cursor = 'pointer';

    // Adicionar o evento de copiar para a área de transferência
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        // Alterar o texto do botão para "Copiado"
        copyButton.textContent = "Copiado";
        copyButton.style.backgroundColor = '#28a745'; // Verde para indicar sucesso

        // Após 5 segundos, retornar o texto original
        setTimeout(() => {
          copyButton.textContent = "Copiar";
          copyButton.style.backgroundColor = '#007bff'; // Azul original
        }, 5000);
      }).catch(err => {
        console.error('Erro ao copiar o código: ', err);
      });
    });

    hoverWindow.appendChild(copyButton);

    // Adicionar a janela flutuante ao corpo da página
    document.body.appendChild(hoverWindow);
  }

  // Verificar a URL atual ao carregar o script
  checkUrlAndExtractCode();

  // Verificar o elemento na página
  checkElementAndExtractCode();

  // Observar mudanças na URL e verificar se ela corresponde ao padrão
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      console.log(`URL mudou para: ${lastUrl}`);
      checkUrlAndExtractCode();
    }
  });

  observer.observe(document, { subtree: true, childList: true });
})();
