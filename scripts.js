import { musicDance, skillDev, academics, fitnessWellness, instruments, home } from './data.js';

function generatePopupSection(courses) {
  let buttonsHTML = `<div id="wrapper"><h2 id="select-course">⬇️ Select your course ⬇️</h2>`;
  let popupsHTML = ``;

  for (const [id, {img_src, emoji, title, description }] of Object.entries(courses)) {
    buttonsHTML += `<p><a class="overlay-button" href="#${id}">${emoji}${title}</a></p>`;
    popupsHTML += `
      <div id="${id}" class="overlay">
        <div class="popup">
          <h2>${title}</h2>
          <a class="close" href="#">&times;</a>
          <div class="content">
            <img src="${img_src}" alt="${title} image" class="popup_image"/>
            <p>${description}</p>
          </div>
        </div>
      </div>`;
  }

  buttonsHTML += `</div>`;
  return buttonsHTML + popupsHTML;
}

const contentMap = {
  musicDance: generatePopupSection(musicDance),
  skillDev: generatePopupSection(skillDev),
  academics: generatePopupSection(academics),
  fitnessWellness: generatePopupSection(fitnessWellness),
  instruments: generatePopupSection(instruments),
  home:home,
  contact:" "
};

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNavigation = document.querySelector('.main-navigation');
  const contentSection = document.getElementById('dynamic-content');
  const logoLink = document.querySelector('.logo');

  logoLink.addEventListener('click', function (event) {
    event.preventDefault();
    contentSection.innerHTML = contentMap['home'];
    typeWriter(); 
    handleCarousel();
  })

  menuToggle.addEventListener('click', function () {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mainNavigation.classList.toggle('active');
    // Prevent scrolling when menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
    console.log('Menu toggle clicked!');
  });
  // clicking a link 
  const menuLinks = document.querySelectorAll('.menu-items a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function () {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNavigation.classList.remove('active');
      document.body.style.overflow = '';
      const contentId = link.getAttribute('data-content');
      contentSection.innerHTML = contentMap[contentId] || `<p>Welcome! Click a link to learn more.</p>`;
      if (contentId === 'home') {
        typeWriter(); 
        handleCarousel();
      }
    });
  });

  //for staggered animation of menu list items
  document.querySelectorAll('.menu-items li').forEach((item, index) => {
    item.style.setProperty('--item-index', index);
  });
  function typeWriter() {
    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const textElement = document.getElementById("typewriter-text");
      const lines = [
        "Keyboard/Piano",
        "Guitar",
        "Drums",
        "Vocal",
        "Chess",
        "Music theory",
        "Tuition 1 to 12",
      ];
      const currentLine = lines[lineIndex];
      let displayText = currentLine.substring(0, charIndex);

      textElement.textContent = displayText;

      if (!isDeleting && charIndex < currentLine.length) {
        charIndex++;
        setTimeout(type, 100);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 40);
      } else {
        if (!isDeleting) {
          isDeleting = true;
          setTimeout(type, 1200); // Pause before deleting
        } else {
          isDeleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
          setTimeout(type, 300);
        }
      }
    }
    type();
  }
  typeWriter();

  function handleCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 0;

    slides.forEach((slide, index) => {
      slide.addEventListener('touchstart', touchStart(index));
      slide.addEventListener('touchend', touchEnd);
      slide.addEventListener('touchmove', touchMove);
    });

    function touchStart(index) {
      return function (event) {
        currentIndex = index;
        startPos = event.touches[0].clientX;
        isDragging = true;

        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none'; // Turn off smooth transition while dragging
      }
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = event.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function touchEnd() {
      cancelAnimationFrame(animationID);
      isDragging = false;

      const movedBy = currentTranslate - prevTranslate;

      // Snap to next or previous slide if moved enough (50px threshold)
      if (movedBy < -50 && currentIndex < slides.length - 1) currentIndex++;
      if (movedBy > 50 && currentIndex > 0) currentIndex--;

      setPositionByIndex();
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
      currentTranslate = currentIndex * -window.innerWidth;
      prevTranslate = currentTranslate;
      track.style.transition = 'transform 0.3s ease-out'; // Smooth after snapping
      setSliderPosition();
    }

    // Optional: Prevent right-click context menu on mobile
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }
  handleCarousel();
})