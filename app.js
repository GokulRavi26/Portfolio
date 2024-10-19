// Typing Animation for Intro Text (Including "Gokul R")
const typedText = document.querySelector('.typed-text');
const introText = ["Gokul R"];
let index = 0;
let charIndex = 0;
let currentText = '';
let isDeleting = false;

function type() {
    if (!isDeleting && charIndex < introText[index].length) {
        currentText += introText[index].charAt(charIndex);
        charIndex++;
        typedText.textContent = currentText;
        setTimeout(type, 120); // Smooth typing speed
    } else if (isDeleting && charIndex > 0) {
        currentText = currentText.slice(0, -1);
        typedText.textContent = currentText;
        charIndex--;
        setTimeout(type, 80); // Slightly faster deletion
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            index = (index + 1) % introText.length;
        }
        setTimeout(type, 1000);  // Pause before next text
    }
}

type();

// Dark Mode Toggle
const darkModeToggle = document.getElementById('toggle-dark-mode');
const body = document.body;

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
});
