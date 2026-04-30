// [추가] 다크/라이트 모드 토글 JavaScript
function toggleTheme() {
const body = document.body;
const btn = document.getElementById('themeToggleBtn');
const navbar = document.querySelector('.navbar');

body.classList.toggle('light-mode');

if (body.classList.contains('light-mode')) {
btn.textContent = ' LIGHT';
navbar.classList.remove('navbar-dark', 'bg-dark');
navbar.classList.add('navbar-light', 'bg-light');
} else {
btn.textContent = ' DARK';
navbar.classList.remove('navbar-light', 'bg-light');
navbar.classList.add('navbar-dark', 'bg-dark');
}
}



function toggleTheme() {
    document.body.classList.toggle("light-mode");

    const themeButtons = document.querySelectorAll(".theme-toggle-btn");

    themeButtons.forEach(function(button) {
        if (document.body.classList.contains("light-mode")) {
            button.textContent = "LIGHT";
        } else {
            button.textContent = "DARK";
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const themeButtons = document.querySelectorAll(".theme-toggle-btn");

    themeButtons.forEach(function(button) {
        button.addEventListener("click", toggleTheme);
    });
});