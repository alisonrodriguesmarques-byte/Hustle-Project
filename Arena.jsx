import React, {useEffect, useRef} from "react";
import Phaser from "phaser";

export default function Arena({state, onCanvasReady}) {
  const mount=useRef(null), game=useRef(null), latest=useRef(state);
  latest.current=state;
  useEffect(()=>{
    class FightScene extends Phaser.Scene {
      constructor(){super("fight");}
      create(){
        this.cameras.main.setBackgroundColor("#090a10");
        const g=this.add.graphics();
        g.lineStyle(2,0x20283a,.9);
        for(let x=0;x<1000;x+=40)g.lineBetween(x,0,x,420);
        for(let y=40;y<420;y+=40)g.lineBetween(0,y,1000,y);
        g.lineStyle(4,0xe7eaf4,1);g.lineBetween(0,330,1000,330);
        g.lineStyle(1,0x5a6680,.7);for(let x=20;x<1000;x+=80)g.lineBetween(x,330,x,345);
        this.fighters=[this.makeFighter(0x9b8cff),this.makeFighter(0xff657f)];
        this.fx=this.add.graphics(); this.labels=[this.add.text(0,0,"VANGUARD",{fontFamily:"monospace",fontSize:"13px",color:"#bdb0ff"}),this.add.text(0,0,"PHANTOM",{fontFamily:"monospace",fontSize:"13px",color:"#ff91a4"})];
        onCanvasReady?.();
      }
      makeFighter(color){
        const c=this.add.container(0,0); const gr=this.add.graphics();
        gr.fillStyle(color,1);gr.fillCircle(0,-57,12);gr.fillRoundedRect(-9,-43,18,39,5);
        gr.lineStyle(8,color,1);gr.lineBetween(-3,-10,-14,0);gr.lineBetween(3,-10,15,0);
        gr.lineBetween(-5,-36,-21,-21);gr.lineBetween(5,-36,22,-24);
        c.add(gr);c.setSize(46,80);return c;
      }
      update(){
        const s=latest.current; if(!s)return;
        this.fx.clear();
        s.fighters.forEach((f,i)=>{
          const x=f.x,y=330+f.y;
          this.fighters[i].setPosition(x,y);this.fighters[i].setScale(f.facing===1?1:-1,1);
          this.labels[i].setPosition(x-42,y-100);
          if(f.move?.damage>0 && f.moveFrame>=(f.move.activeStart||0)-2 && f.moveFrame<=(f.move.activeEnd||0)+2){
            this.fx.lineStyle(5,i===0?0x9b8cff:0xff657f,.9);
            this.fx.strokeCircle(x+f.facing*35,y-48,22+Math.random()*5);
            this.fx.lineStyle(3,0xffffff,.8);this.fx.lineBetween(x+f.facing*10,y-50,x+f.facing*(f.move.range*.5),y-50);
          }
          if(f.state==="hit"){this.fx.fillStyle(0xffffff,.8);this.fx.fillCircle(x,y-48,14);}
        });
      }
    }
    game.current=new Phaser.Game({type:Phaser.AUTO,width:1000,height:420,parent:mount.current,transparent:false,backgroundColor:"#090a10",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:FightScene,render:{antialias:false}});
    return ()=>{game.current?.destroy(true);game.current=null;};
  },[]);
  return <div className="arena-wrap"><div className="arena-tag">SIMULAÇÃO 2D <span>• QUADRO A QUADRO</span></div><div ref={mount} className="arena-canvas"/></div>;
}