let eggs=0
let clickPower=1
let multiplier=1
let rebirth=0

const eggsEl=document.getElementById("eggs")
const epsEl=document.getElementById("eps")
const clickEl=document.getElementById("clickPower")
const rebirthEl=document.getElementById("rebirth")
const egg=document.getElementById("egg")

const buildEl=document.getElementById("buildings")
const upgradeEl=document.getElementById("upgrades")
const achEl=document.getElementById("achievements")
const popup=document.getElementById("achievementPopup")

const buildings=[

{name:"🐔 Курица",base:15,power:.1,count:0},

{name:"🐣 Инкубатор",base:100,power:1,count:0},

{name:"🏭 Ферма",base:500,power:5,count:0},

{name:"🏢 Фабрика",base:2000,power:15,count:0},

{name:"🧬 Генлаб",base:10000,power:50,count:0}

]

const upgrades=[

{name:"Сильный клик",cost:100,apply:()=>clickPower+=1},

{name:"Железные пальцы",cost:500,apply:()=>clickPower+=2},

{name:"Супер клик",cost:2000,apply:()=>clickPower+=5},

{name:"Мега клик",cost:10000,apply:()=>clickPower+=20},

{name:"Яичная экономика",cost:5000,apply:()=>multiplier*=2}

]

const achievements=[

{name:"Новичок",goal:1000,done:false},

{name:"Фермер",goal:100000,done:false},

{name:"Магнат",goal:1000000,done:false},

{name:"Яичный бог",goal:1000000000,done:false},

{name:"Первое перерождение",rebirth:1,done:false},

{name:"Мастер",rebirth:3,done:false}

]

function buildingCost(b){

return Math.floor(b.base*Math.pow(1.15,b.count))

}

function calcEPS(){

let total=0

buildings.forEach(b=>total+=b.count*b.power)

return total*multiplier

}

function showAch(text){

popup.innerText="🏆 "+text

popup.style.display="block"

setTimeout(()=>popup.style.display="none",3000)

}

function checkAch(){

achievements.forEach(a=>{

if(a.done) return

if(a.goal && eggs>=a.goal){

a.done=true

showAch(a.name)

}

if(a.rebirth && rebirth>=a.rebirth){

a.done=true

showAch(a.name)

}

})

}

function update(){

eggsEl.textContent=Math.floor(eggs)

epsEl.textContent=calcEPS().toFixed(1)

clickEl.textContent=(clickPower*multiplier).toFixed(1)

rebirthEl.textContent=rebirth

buildEl.innerHTML=""

buildings.forEach(b=>{

let btn=document.createElement("button")

let cost=buildingCost(b)

btn.textContent=b.name+" ("+b.count+") - "+cost

btn.onclick=()=>{

if(eggs>=cost){

eggs-=cost

b.count++

update()

}

}

buildEl.appendChild(btn)

})

upgradeEl.innerHTML=""

upgrades.forEach(u=>{

if(!u.bought){

let btn=document.createElement("button")

btn.textContent=u.name+" - "+u.cost

btn.onclick=()=>{

if(eggs>=u.cost){

eggs-=u.cost

u.apply()

u.bought=true

update()

}

}

upgradeEl.appendChild(btn)

}

})

achEl.innerHTML=""

achievements.forEach(a=>{

let div=document.createElement("div")

div.textContent=(a.done?"✅ ":"⬜ ")+a.name

achEl.appendChild(div)

})

checkAch()

}

egg.onclick=()=>{

eggs+=clickPower*multiplier

update()

}

setInterval(()=>{

eggs+=calcEPS()

update()

},1000)

function doRebirth(){

let cost=[5000000,10000000,15000000]

if(rebirth>=3)return

if(eggs<cost[rebirth])return

rebirth++

clickPower*=1.1

eggs=0

buildings.forEach(b=>b.count=0)

update()

}

function save(){

const data={

eggs,
clickPower,
multiplier,
rebirth,
buildings,
upgrades,
achievements

}

localStorage.setItem("eggClickerSave",JSON.stringify(data))

}

function load(){

const data=JSON.parse(localStorage.getItem("eggClickerSave"))

if(!data)return

eggs=data.eggs
clickPower=data.clickPower
multiplier=data.multiplier
rebirth=data.rebirth

data.buildings.forEach((b,i)=>{

buildings[i].count=b.count

})

data.upgrades.forEach((u,i)=>{

upgrades[i].bought=u.bought

})

data.achievements.forEach((a,i)=>{

achievements[i].done=a.done

})

}

setInterval(save,3000)

load()

update()
