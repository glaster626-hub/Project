let eggs=0
let clickPower=1
let multiplier=1
let rebirth=0
let lastSave=Date.now()

const eggEl=document.getElementById("egg")
const eggsEl=document.getElementById("eggs")
const epsEl=document.getElementById("eps")
const clickEl=document.getElementById("clickPower")
const rebirthEl=document.getElementById("rebirth")
const rebirthCostEl=document.getElementById("rebirthCost")
const buildEl=document.getElementById("buildings")
const upgradeEl=document.getElementById("upgrades")
const golden=document.getElementById("golden")

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

{name:"Алмазный клик",cost:10000,apply:()=>clickPower+=10},
{name:"Титановые пальцы",cost:25000,apply:()=>clickPower+=20},
{name:"Мега клик",cost:50000,apply:()=>clickPower+=50},

{name:"Яичная экономика",cost:5000,apply:()=>multiplier*=2},
{name:"Супер экономика",cost:20000,apply:()=>multiplier*=2},
{name:"Мега экономика",cost:100000,apply:()=>multiplier*=3},

{name:"Фермы x2",cost:8000,apply:()=>buildings[2].power*=2},
{name:"Фабрики x2",cost:30000,apply:()=>buildings[3].power*=2}

]

function buildingCost(b){
return Math.floor(b.base*Math.pow(1.15,b.count))
}

function calcEPS(){

let total=0

buildings.forEach(b=>{
total+=b.count*b.power
})

return total*multiplier

}

function update(){

eggsEl.textContent=Math.floor(eggs)
epsEl.textContent=calcEPS().toFixed(1)
clickEl.textContent=(clickPower*multiplier).toFixed(1)
rebirthEl.textContent=rebirth

let costs=[5000000,10000000,15000000]

if(rebirth<3){
rebirthCostEl.textContent="Цена: "+costs[rebirth]
}else{
rebirthCostEl.textContent="Максимум перерождений"
}

buildEl.innerHTML=""

buildings.forEach(b=>{

let cost=buildingCost(b)

let btn=document.createElement("button")

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

}

eggEl.onclick=()=>{

eggEl.classList.add("crack")

setTimeout(()=>eggEl.classList.remove("crack"),200)

eggs+=clickPower*multiplier
update()

}

setInterval(()=>{
eggs+=calcEPS()
update()
},1000)

function spawnGolden(){

golden.style.left=Math.random()*80+"vw"
golden.style.display="block"

setTimeout(()=>{
golden.style.display="none"
},5000)

}

golden.onclick=()=>{

eggs+=calcEPS()*120
golden.style.display="none"
update()

}

setInterval(()=>{
if(Math.random()<0.08){
spawnGolden()
}
},10000)

function doRebirth(){

let costs=[5000000,10000000,15000000]

if(rebirth>=3){
alert("Максимум перерождений!")
return
}

if(eggs<costs[rebirth]){
alert("Нужно "+costs[rebirth]+" яиц!")
return
}

rebirth++

clickPower*=1.1

eggs=0

buildings.forEach(b=>{
b.count=0
})

update()

}

function save(){

const data={
eggs,
clickPower,
multiplier,
rebirth,
buildings,
lastSave:Date.now()
}

localStorage.setItem("eggMobileSave",JSON.stringify(data))

}

function load(){

const data=JSON.parse(localStorage.getItem("eggMobileSave"))

if(!data) return

eggs=data.eggs
clickPower=data.clickPower
multiplier=data.multiplier
rebirth=data.rebirth
lastSave=data.lastSave

data.buildings.forEach((b,i)=>{
buildings[i].count=b.count
})

let offline=(Date.now()-lastSave)/1000
eggs+=offline*calcEPS()

}

setInterval(save,3000)

load()
update()
