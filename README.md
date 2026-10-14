# HUSTLE//ARENA

Jogo de luta estratégica 2D inspirado no gênero de combate quadro a quadro.

## Publicar no GitHub Pages

1. Envie **todo o conteúdo desta pasta** para a raiz do repositório `Hustle-Project`, substituindo os arquivos antigos quando solicitado.
2. Confirme que `.github/workflows/deploy.yml`, `src`, `index.html`, `package.json` e `vite.config.js` aparecem diretamente na raiz do repositório.
3. Abra Settings → Pages e escolha **GitHub Actions** em Source.
4. Abra Actions e aguarde o workflow **Deploy game to GitHub Pages** ficar verde.
5. O site deverá ficar em https://alisonrodriguesmarques-byte.github.io/Hustle-Project/

`node_modules` não deve ser enviado ao repositório. O GitHub Actions instala as dependências e compila o jogo automaticamente.

## Rodar localmente

Requisitos: Node.js 20+ e npm. Execute `npm install` e depois `npm run dev`.

## Limitação

GitHub Pages hospeda apenas o frontend estático. Recursos que dependem do servidor Node/Express precisam de um servidor separado. Esta é uma versão inicial jogável, não uma reprodução completa do YOMI Hustle.
