// Dropdown open/close behavior
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', e => {
        const dropdown = e.target.closest('.dropdown');
        const isActive = dropdown.classList.contains('active');

        // Close all dropdowns first
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));

        // Then open the one that was clicked (if it wasn’t already open)
        if (!isActive) {
            dropdown.classList.add('active');
        }
    });
});

// Close dropdowns if clicked outside
document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    }
});
