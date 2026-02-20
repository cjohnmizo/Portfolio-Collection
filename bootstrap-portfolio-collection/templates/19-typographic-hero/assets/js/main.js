// Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');

if (dot) {
    document.addEventListener('mousemove', (e) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    });

    // Scale dot on hover
    const hoverElements = document.querySelectorAll('.hover-outline, .hover-primary, a');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.width = '30px';
            dot.style.height = '30px';
            dot.style.mixBlendMode = 'normal';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.width = '12px';
            dot.style.height = '12px';
            dot.style.mixBlendMode = 'difference';
        });
    });
}

console.log("Typographic Hero loaded.");
