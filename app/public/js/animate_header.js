document.addEventListener("scroll", () => {
    let header = document.getElementsByTagName('header')[0];
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});