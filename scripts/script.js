let currentIndex = 0
let images = []
let galleryImages = []
let mfiritsImages = []
let filmcollagenImages = []

const projectImageSets = {}

Promise.all([
  fetch('data/images.json').then(res => res.json()),
  fetch('data/mfirits.json').then(res => res.json()),
  fetch('data/filmcollagen.json').then(res => res.json())
]).then(([gallery, mfirits, filmcollagen]) => {
  galleryImages = gallery
  mfiritsImages = mfirits
  filmcollagenImages = filmcollagen
  projectImageSets['mfirits'] = mfiritsImages
  projectImageSets['filmcollagen'] = filmcollagenImages
  images = galleryImages
  showImage(currentIndex)
})

/* Gallery Funktionen - nächtes und vorheriges Bild */

function showImage(index){
  const img = document.querySelector('.gallery__container img')
  const imgYear = document.querySelector('.gallery__info .year')
  const imgTitle = document.querySelector('.gallery__info .title')

  img.src = images[index].src
  img.alt = images[index].alt
  imgYear.textContent = images[index].year
  imgTitle.textContent = images[index].title
}

  function next() {
  currentIndex = (currentIndex + 1) % images.length
  showImage(currentIndex)
}

function prev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length
  showImage(currentIndex)
}

const gallery = document.querySelector('.gallery')

gallery.addEventListener('click', (e) => {
   if (e.clientX > window.innerWidth / 2) {
    next()
  } else {
    prev()
  }
})

/*custom cursor */
const cursor = document.querySelector('#custom-cursor')

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px'
  cursor.style.top = e.clientY + 'px'
})

const cursorImg = document.querySelector('#custom-cursor img')

gallery.addEventListener('mousemove', (e) => {
  if (e.clientX > window.innerWidth / 2) {
    cursorImg.src = 'media/cursors/cursor_right.svg'
  } else {
    cursorImg.src = 'media/cursors/cursor_left.svg'
  }
})

gallery.addEventListener('mouseleave', ()=>{
  cursorImg.src = 'media/cursors/cursor.svg'
})

/* nav functionality */

const navButton = document.querySelector('#menu-button')
const navMenu = document.querySelector('nav .menu_container')
let isAnimating = false

navButton.addEventListener('click', () => {
  if(isAnimating) return

  navButton.classList.toggle('active')
  if (navMenu.classList.contains('active')) {
    isAnimating = true
    navMenu.classList.add('closing')
    setTimeout(() => {
      navMenu.classList.remove('active', 'closing')
      isAnimating = false
    }, 1500)
  } else {
    navMenu.classList.add('active')
  }
})

/* page overlay transition */

function pageTransition() {
  const overlay = document.querySelector('.page-transition')
  const galleryImg = document.querySelector('.gallery img')

  setTimeout(() => {
    galleryImg.classList.add('transition_active')
  }, 200)

  overlay.classList.add('active')
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('active')
  }, { once: true })

  setTimeout(() => {
    galleryImg.classList.remove('transition_active')
  }, 1000)
}

document.addEventListener('DOMContentLoaded', () => {
  pageTransition()
})

/* function to switch sections */

function switchSection(target) {
  if (document.querySelector(`#${target}`).classList.contains('active')) return
  const currentSection = document.querySelector('section.active')
  pageTransition()

  setTimeout(() => {
    currentSection.classList.add('closing')
  }, 400)

  setTimeout(() => {
    currentSection.classList.remove('active', 'closing')
    document.querySelector(`#${target}`).classList.add('active')
  }, 1200)
}

function closeMenu() {
  if (!navMenu.classList.contains('active')) return
  navButton.classList.remove('active')
  navMenu.classList.add('closing')
  setTimeout(() => {
    navMenu.classList.remove('active', 'closing')
  }, 700)
}

const menuItems = document.querySelectorAll('.menu_container li')
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    closeMenu()
    switchSection(item.dataset.target)
  })
})

document.querySelector('.back-button').addEventListener('click', () => {
  images = galleryImages
  currentIndex = 0
  switchSection('gallery')
})

document.querySelectorAll('.preview, .link-button').forEach(el => {
  el.addEventListener('click', () => {
    const project = el.closest('.project')
    const key = project ? project.dataset.images : 'mfirits'
    images = projectImageSets[key] || mfiritsImages
    currentIndex = 0
    showImage(0)
    switchSection('gallery')
  })
})

/* nightmode */

const toggle = document.querySelector('#nightmode-toggle')
const root = document.documentElement

if (localStorage.getItem('theme') === 'dark') {
  root.setAttribute('data-theme', 'dark')
}

toggle.addEventListener('click', () => {
  if (root.getAttribute('data-theme') === 'dark') {
    root.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  } else {
    root.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  }
})
