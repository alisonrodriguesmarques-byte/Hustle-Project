import { MOVES } from "./moves.js";

export const freshState = (mode="ai", difficulty="Médio") => ({
  mode, difficulty, phase:"decision", frame:0, turn:1, winner:null, log:[],
  fighters:[
    {name:"Vanguard", x:310, y:0, hp:100, energy:45, color:0x9b8cff, facing:1, state:"idle", guarding:false, airborne:false, move:null, moveFrame:0, hitThisMove:false, combo:0},
    {name:"Phantom", x:690, y:0, hp:100, energy:45, color:0xff657f, facing:-1, state:"idle", guarding:false, airborne:false, move:null, moveFrame:0, hitThisMove:false, combo:0}
  ],
  pending:[null,null], activePlayer:0, speed:1, replay:[]
});

export function chooseMove(state, player, moveId) {
  if (state.phase !== "decision" || state.winner) return state;
  const move = MOVES.find(m=>m.id===moveId);
  if (!move) return state;
  const fighter=state.fighters[player];
  if (move.cost > fighter.energy) return {...state, message:"Energia insuficiente para esse movimento."};
  const pending=[...state.pending]; pending[player]=moveId;
  return {...state,pending,message:null};
}
export function confirmMove(state, player, moveId) {
  if (state.phase!=="decision" || state.winner) return state;
  const id=moveId || state.pending[player];
  if (!id) return {...state,message:"Escolha um movimento antes de confirmar."};
  const move=MOVES.find(m=>m.id===id), fighter=state.fighters[player];
  if (!move || move.cost>fighter.energy) return {...state,message:"Movimento inválido ou energia insuficiente."};
  const pending=[...state.pending]; pending[player]=id;
  if (state.mode==="local" && !pending.every(Boolean)) return {...state,pending,activePlayer:1-player,message:`Jogador ${player+1} confirmou. Vez do jogador ${2-player}.`};
  if (!pending.every(Boolean)) return {...state,pending};
  const fighters=state.fighters.map((f,i)=>({...f, move:MOVES.find(m=>m.id===pending[i]),moveFrame:0,hitThisMove:false,state:"acting",guarding:pending[i]==="guard",airborne:pending[i]==="jump"||pending[i]==="air"}));
  fighters.forEach((f,i)=>{f.energy=Math.max(0,f.energy-(f.move.cost||0));if(f.move.kind==="recover")f.energy=Math.min(100,f.energy+22);f.facing=f.x<fighters[1-i].x?1:-1;});
  const replay=[...state.replay,{turn:state.turn,moves:[...pending]}];
  return {...state,fighters,pending:[null,null],phase:"simulating",frame:0,activePlayer:0,replay,message:null,log:[...state.log,`Turno ${state.turn}: ${fighters[0].move.name} × ${fighters[1].move.name}`]};
}
export function tick(state) {
  if(state.phase!=="simulating" || state.winner) return state;
  const fighters=state.fighters.map(f=>({...f})); const nextFrame=state.frame+1;
  fighters.forEach((f,i)=>{
    const enemy=fighters[1-i], m=f.move;
    if(!m)return;
    f.moveFrame++;
    const t=f.moveFrame/Math.max(1,m.frames);
    if(m.kind==="move"||m.kind==="dodge"||m.kind==="attack"||m.kind==="special"||m.kind==="grab"||m.kind==="air") {
      const amount=m.dx/m.frames;
      f.x += amount*f.facing;
    }
    if(m.kind==="jump"){f.y=-Math.sin(Math.min(1,t)*Math.PI)*100; f.x+=m.dx/m.frames*f.facing;}
    if(m.kind==="air"){f.y=-Math.sin(Math.min(1,t)*Math.PI)*48;}
    f.x=Math.max(50,Math.min(950,f.x)); f.y=Math.min(0,f.y);
    const active=(m.activeStart??0)<=f.moveFrame && f.moveFrame<=(m.activeEnd??-1);
    if(active&&!f.hitThisMove&&m.damage>0){
      const distance=Math.abs(enemy.x-f.x), vertical=Math.abs(enemy.y-f.y);
      if(distance<=m.range && vertical<105){
        let damage=m.damage;
        if(enemy.guarding && m.kind!=="grab") damage=Math.max(1,Math.round(damage*.22));
        if(enemy.move?.kind==="dodge" && enemy.moveFrame<enemy.move.frames*.72) damage=0;
        enemy.hp=Math.max(0,enemy.hp-damage);
        if(damage>0){enemy.x=Math.max(50,Math.min(950,enemy.x+f.facing*(m.kind==="special"?12:24)));enemy.state="hit";enemy.combo=(enemy.combo||0)+1;}
        f.hitThisMove=true;
      }
    }
    if(f.moveFrame>=m.frames){f.move=null;f.state="idle";f.moveFrame=0;f.guarding=false;f.airborne=false;f.y=0;}
  });
  const winner=fighters[0].hp<=0?1:fighters[1].hp<=0?0:null;
  const allDone=fighters.every(f=>!f.move);
  return {...state,fighters,frame:nextFrame,phase:winner?"finished":allDone?"decision":"simulating",turn:allDone?state.turn+1:state.turn,winner,message:winner!==null?`${fighters[winner].name} venceu!`:null};
}
export function aiMove(state) {
  const me=state.fighters[1], you=state.fighters[0], dist=Math.abs(me.x-you.x);
  const pool=state.difficulty==="Fácil"?["jab","approach","guard","kick"]:state.difficulty==="Difícil"?["special","dodge","heavy","kick","grab","guard"]:["jab","kick","approach","guard","heavy"];
  let candidates=pool.map(id=>MOVES.find(m=>m.id===id)).filter(m=>m&&m.cost<=me.energy);
  if(dist>220)candidates=candidates.filter(m=>["approach","special"].includes(m.id));
  else if(dist<90)candidates=candidates.filter(m=>m.id!=="special");
  if(!candidates.length)candidates=[MOVES[0]];
  if(you.move?.damage>0 && state.difficulty!=="Fácil") candidates=candidates.filter(m=>["dodge","guard","jab","kick"].includes(m.id));
  return candidates[Math.floor(Math.random()*candidates.length)].id;
}