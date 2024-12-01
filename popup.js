document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
  
      // Configurar o listener antes de injetar o content.js
      chrome.runtime.onMessage.addListener(function listener(message) {
        const codeElement = document.getElementById("code");
  
        if (message?.code) {
          codeElement.textContent = `Código encontrado: ${message.code}`;
        } else {
          codeElement.textContent = "Nenhum código encontrado.";
        }
  
        // Remover listener após a primeira execução para evitar duplicação
        chrome.runtime.onMessage.removeListener(listener);
      });
  
      // Injetar o content.js na aba ativa
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["content.js"],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Erro ao injetar content.js:", chrome.runtime.lastError);
            document.getElementById("code").textContent =
              "Erro ao executar o script.";
            return;
          }
        }
      );
    });
  });
  