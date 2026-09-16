# Rota - App de Corrida

Este projeto consiste em um aplicativo de mobilidade urbana desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 1. Instalação e Execução Local

Esta seção descreve como preparar o ambiente de desenvolvimento em sua máquina local.

### Requisitos
*   **Node.js:** O projeto utiliza o Expo SDK 57, que exige uma versão recente do Node.js (versão 18 ou superior recomendada). Caso a sua versão seja incompatível, utilize o nvm (Node Version Manager) para instalar a versão correta.
*   **Gerenciador de pacotes:** npm ou yarn.

### Passo a passo
1.  **Instalação de dependências:**
    Abra o terminal na pasta raiz do projeto e execute:
    ```bash
    npm install
    ```

2.  **Iniciar o servidor:**
    Após a instalação, inicie o ambiente de desenvolvimento com o comando:
    ```bash
    npx expo start
    ```

---

## 2. Execução via GitHub Codespaces

O Codespaces é uma alternativa recomendada para desenvolvimento em nuvem, especialmente útil caso você não deseje configurar o ambiente localmente ou esteja utilizando máquinas com restrições.

### Pré-requisitos
*   **Extensão do VS Code:** Certifique-se de ter a extensão "GitHub Codespaces" instalada no seu Visual Studio Code.
*   **Conta GitHub:** O repositório deve estar hospedado no GitHub para que o Codespace possa ser criado.

### Passo a passo
1.  **Criar o Codespace:**
    No repositório do projeto no GitHub, clique no botão "Code" e selecione a aba "Codespaces". Clique em "Create codespace on main". Isso abrirá um ambiente de desenvolvimento completo no seu navegador ou conectará diretamente ao seu VS Code local.

2.  **Instalação de dependências:**
    Assim que o terminal estiver disponível dentro do Codespace, execute:
    ```bash
    npm install
    ```

3.  **Iniciar o servidor com túnel:**
    Como o Codespace roda em um servidor remoto, é necessário criar um túnel para permitir que o seu celular (com o app Expo Go) acesse o servidor. Utilize o comando:
    ```bash
    npx expo start --tunnel
    ```
    Após executar este comando, um código QR aparecerá no terminal. Utilize o aplicativo Expo Go no seu celular para ler o QR Code e visualizar o aplicativo.

---

## Sobre o Projeto
O Rota tem como objetivo facilitar a conexão entre passageiros e motoristas, funcionando como um sistema de mobilidade urbana completo para o TCC.

---

## fluxo de trabalho

Se você é novo no projeto ou precisa de ajuda com o fluxo de trabalho e comandos do Git, consulte o nosso guia passo a passo:

👉 **[Guia Prático de Git e Workflow (`docs/git.md`)](docs/git.md)**

---

# Configuração de Pacotes Privados (`.npmrc`)

Este projeto utiliza pacotes privados hospedados no **GitHub Packages** sob o escopo `@ROTA-TCC`. O arquivo `.npmrc` na raiz instrui o gerenciador de pacotes (`pnpm`, `npm` ou `yarn`) a buscar essas dependências no registro do GitHub e autenticar o acesso.

---

## O que o arquivo faz

```ini
@ROTA-TCC:registry=[https://npm.pkg.github.com/](https://npm.pkg.github.com/)
//[npm.pkg.github.com/:_authToken=$](https://npm.pkg.github.com/:_authToken=$){NODE_AUTH_TOKEN}
