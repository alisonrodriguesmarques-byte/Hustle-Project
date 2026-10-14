# HUSTLE//ARENA — GitHub Pages

Jogo de luta estratégica 2D inspirado no gênero de combate quadro a quadro. Projeto independente, com identidade visual própria.

## Publicar gratuitamente no GitHub Pages

1. Baixe e extraia o ZIP do projeto.
2. No GitHub, crie um repositório novo, por exemplo `hustle-arena`.
3. Envie **todo o conteúdo da pasta `yomi-inspired`** para a raiz do repositório. A pasta `.github` também precisa ser enviada.
4. No repositório, abra **Settings → Pages**.
5. Em **Build and deployment → Source**, selecione **GitHub Actions**.
6. Abra a aba **Actions** e espere “Deploy game to GitHub Pages” terminar com marca verde.
7. Em **Settings → Pages**, abra o endereço publicado. Geralmente será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

O workflow compila automaticamente o React/Vite quando você enviar alterações para a branch `main`.

## O que funciona no GitHub Pages

- Jogar contra a IA local do navegador.
- Dois jogadores no mesmo computador.
- Arena, movimentos e simulação.
- Laboratório, configurações básicas e histórico de replays no navegador.

## Limitação: multiplayer online

O GitHub Pages hospeda apenas arquivos estáticos; ele **não executa o servidor Node/Express/Socket.IO**. Salas e chat online precisam de um servidor separado hospedado em um serviço compatível com Node.js. Publique a pasta `server`, configure `VITE_SERVER_URL` com o endereço público do servidor na etapa de build e ajuste o CORS do servidor para permitir o domínio do GitHub Pages. Sem isso, o jogo contra IA e o modo local continuam funcionando.

## Rodar localmente

Requisitos: Node.js 20+ e npm.

```bash
cd client
npm install
npm run dev
```

Abra o endereço local mostrado pelo Vite.

## Estado do projeto

Esta é uma versão inicial jogável, não uma reprodução completa do YOMI Hustle. A previsão de combate é aproximada, e multiplayer sincronizado, mais animações, combos avançados, áudio e testes completos ainda precisam de desenvolvimento.
