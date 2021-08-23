let rightSideLi1 = document.querySelectorAll('.btn-pluss ul li .img1')
let rightSideLi2 = document.querySelectorAll('.btn-pluss ul li .img2')
let rightSideLi3 = document.querySelectorAll('.btn-pluss ul li .img3')
let dropdownContent1 = document.querySelector('.Dropdown_content1')
let dropdownContent2 = document.querySelector('.Dropdown_content2')
let dropdownContent3 = document.querySelector('.Dropdown_content3')

Array.from(rightSideLi1).forEach(element => {
    element.addEventListener('mouseover', display1)
    element.addEventListener('mouseout', display1)
})
Array.from(rightSideLi2).forEach(element => {
    element.addEventListener('mouseover', display2)
    element.addEventListener('mouseout', display2)
})
Array.from(rightSideLi3).forEach(element => {
    element.addEventListener('mouseover', display3)
    element.addEventListener('mouseout', display3)
})
let mini1 = true
let mini2 = true
let mini3 = true
function display1() {
    if (mini1) {
        dropdownContent1.style.transform = 'translateX(0)'
        mini1 = false
    } else {
        dropdownContent1.style.transform = 'translateX(150%)'
        mini1 = true
    }
}
function display2() {
    if (mini2) {
        dropdownContent2.style.transform = 'translateX(0)'
        mini2 = false
    } else {
        dropdownContent2.style.transform = 'translateX(150%)'
        mini2 = true
    }
}
function display3() {
    if (mini3) {
        dropdownContent3.style.transform = 'translateX(0)'
        mini3 = false
    } else {
        dropdownContent3.style.transform = 'translateX(150%)'
        mini3 = true
    }
}
dropdownContent1.addEventListener('mouseover',display1)
dropdownContent2.addEventListener('mouseover',display2)
dropdownContent3.addEventListener('mouseover',display3)

