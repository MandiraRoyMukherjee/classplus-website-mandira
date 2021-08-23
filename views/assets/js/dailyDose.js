let news=document.querySelector('.news')
let vocabulary=document.querySelector('.vocabulary')
let currentAffairs=document.querySelector('.currentAffairs')
let analysis=document.querySelector('.analysis')

vocabulary.style.display='none'
currentAffairs.style.display='none'
analysis.style.display='none'

document.getElementById('News').addEventListener('click',()=>{
news.style.display='block'
vocabulary.style.display='none'
currentAffairs.style.display='none'
analysis.style.display='none'
})

document.getElementById('Vocabulary').addEventListener('click',()=>{
news.style.display='none'
vocabulary.style.display='block'
currentAffairs.style.display='none'
analysis.style.display='none'
})

document.getElementById('Affairs').addEventListener('click',()=>{
news.style.display='none'
vocabulary.style.display='none'
currentAffairs.style.display='block'
analysis.style.display='none'
})

document.getElementById('Analysis').addEventListener('click',()=>{
news.style.display='none'
vocabulary.style.display='none'
currentAffairs.style.display='none'
analysis.style.display='block'
})