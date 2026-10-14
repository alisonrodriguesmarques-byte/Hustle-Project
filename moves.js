export const MOVES = [
  { id:"approach", name:"Avançar", group:"Movimento", frames:18, range:0, damage:0, cost:0, dx:115, dy:0, kind:"move", desc:"Fecha a distância rapidamente." },
  { id:"retreat", name:"Recuar", group:"Movimento", frames:16, range:0, damage:0, cost:0, dx:-95, dy:0, kind:"move", desc:"Cria espaço para respirar." },
  { id:"jump", name:"Salto", group:"Movimento", frames:24, range:0, damage:0, cost:0, dx:35, dy:-95, kind:"jump", desc:"Salta e muda sua altura." },
  { id:"guard", name:"Defender", group:"Defesa", frames:22, range:120, damage:0, cost:0, dx:0, dy:0, kind:"guard", desc:"Reduz o dano recebido durante a ação." },
  { id:"dodge", name:"Esquiva", group:"Defesa", frames:18, range:0, damage:0, cost:8, dx:-70, dy:-8, kind:"dodge", desc:"Deslocamento evasivo com janela curta." },
  { id:"jab", name:"Soco rápido", group:"Ataque", frames:15, range:105, damage:8, cost:0, dx:18, dy:0, kind:"attack", activeStart:5, activeEnd:9, desc:"Golpe veloz de curto alcance." },
  { id:"heavy", name:"Soco forte", group:"Ataque", frames:26, range:145, damage:17, cost:8, dx:38, dy:0, kind:"attack", activeStart:11, activeEnd:16, desc:"Mais dano, mas é mais lento." },
  { id:"kick", name:"Chute", group:"Ataque", frames:22, range:155, damage:13, cost:5, dx:28, dy:0, kind:"attack", activeStart:8, activeEnd:13, desc:"Bom alcance horizontal." },
  { id:"air", name:"Ataque aéreo", group:"Ataque", frames:21, range:130, damage:12, cost:4, dx:42, dy:-20, kind:"air", activeStart:7, activeEnd:12, desc:"Avança com um golpe no ar." },
  { id:"special", name:"Rajada", group:"Especial", frames:32, range:235, damage:22, cost:25, dx:12, dy:0, kind:"special", activeStart:13, activeEnd:20, desc:"Projétil de energia com alto custo." },
  { id:"grab", name:"Agarrão", group:"Especial", frames:25, range:82, damage:19, cost:10, dx:12, dy:0, kind:"grab", activeStart:9, activeEnd:14, desc:"Forte de perto; não funciona à distância." },
  { id:"recover", name:"Recuperar", group:"Especial", frames:20, range:0, damage:0, cost:0, dx:0, dy:0, kind:"recover", desc:"Recupera um pouco de energia." }
];