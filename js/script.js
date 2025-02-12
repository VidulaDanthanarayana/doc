document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const buttonMobile = document.getElementById('button-menu-mobile');
    const mobileMenuCloser = document.querySelector('.mobile-menu-closer');
    const leftMenu = document.querySelector('.left-menu');

    if (buttonMobile) {
        buttonMobile.addEventListener('click', function() {
            leftMenu.classList.toggle('mobile-menu-show');
        });
    }

    if (mobileMenuCloser) {
        mobileMenuCloser.addEventListener('click', function() {
            leftMenu.classList.remove('mobile-menu-show');
        });
    }

    // Nested menu functionality
    const menuItems = document.querySelectorAll('.menu-item.has-submenu');
    menuItems.forEach(item => {
        const menuLink = item.querySelector('> a'); // Direct child a element
        if (menuLink) {
            menuLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other menus
                menuItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('expanded');
                    }
                });
                
                // Toggle current menu
                item.classList.toggle('expanded');
            });
        }
    });

    // Scroll to section functionality
    const scrollLinks = document.querySelectorAll('.scroll-to-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            // Only scroll if the target element exists on the current page
            if (targetElement) {
                e.preventDefault();
                e.stopPropagation();
                
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Update active state
                scrollLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Ensure parent menu stays expanded
                const parentMenu = link.closest('.menu-item.has-submenu');
                if (parentMenu) {
                    parentMenu.classList.add('expanded');
                }
            }
        });
    });

    // Handle initial active states based on URL hash
    function setActiveStateFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetLink = document.querySelector(`[data-target="${hash}"]`);
            if (targetLink) {
                // Remove active class from all links
                scrollLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
                
                // Expand parent menu if exists
                const parentMenu = targetLink.closest('.menu-item.has-submenu');
                if (parentMenu) {
                    // Close all other menus first
                    menuItems.forEach(item => item.classList.remove('expanded'));
                    parentMenu.classList.add('expanded');
                }
            }
        }
    }

    // Set initial active states
    setActiveStateFromHash();

    // Update active states when hash changes
    window.addEventListener('hashchange', setActiveStateFromHash);
});

// Scroll tracking functionality
var elements = [];

function debounce(func) {
    var timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 100, event);
    };
}

function calculElements() {
    var totalHeight = 0;
    elements = [];
    [].forEach.call(document.querySelectorAll('.content-section'), function(div) {
        var section = {};
        section.id = div.id;
        totalHeight += div.offsetHeight;
        section.maxHeight = totalHeight - 25;
        elements.push(section);
    });
    onScroll();
}

function onScroll() {
    var scroll = window.pageYOffset;
    for (var i = 0; i < elements.length; i++) {
        var section = elements[i];
        if (scroll <= section.maxHeight) {
            var elems = document.querySelectorAll(".content-menu ul li");
            [].forEach.call(elems, function(el) {
                el.classList.remove("active");
            });
            var activeElems = document.querySelectorAll(".content-menu ul li[data-target='" + section.id + "']");
            [].forEach.call(activeElems, function(el) {
                el.classList.add("active");
                
                // Keep parent menu expanded when scrolling
                const parentMenu = el.closest('.menu-item.has-submenu');
                if (parentMenu) {
                    parentMenu.classList.add('expanded');
                }
            });
            break;
        }
    }
    if (window.innerHeight + scroll + 5 >= document.body.scrollHeight) {
        var elems = document.querySelectorAll(".content-menu ul li");
        [].forEach.call(elems, function(el) {
            el.classList.remove("active");
        });
        var activeElems = document.querySelectorAll(".content-menu ul li:last-child");
        [].forEach.call(activeElems, function(el) {
            el.classList.add("active");
            
            // Keep parent menu expanded at end of scroll
            const parentMenu = el.closest('.menu-item.has-submenu');
            if (parentMenu) {
                parentMenu.classList.add('expanded');
            }
        });
    }
}

calculElements();
window.onload = calculElements;
window.addEventListener("resize", debounce(function(e) {
    e.preventDefault();
    calculElements();
}));
window.addEventListener('scroll', function(e) {
    e.preventDefault();
    onScroll();
});