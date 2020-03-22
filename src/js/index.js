document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

var upperX = [];

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = link.href.split("#")[1];
    upperX.push({
        offsetTop: document.getElementById(id).offsetTop, link
    });
});

upperX.sort(function (left, right) {
    return left.offsetTop - right.offsetTop
});

var sectionRanges = [];
var lastTop = 0;

for (var i = 0; i < upperX.length; i++) {
    if (upperX[i + 1]) {
        sectionRanges.push(Object.assign(upperX[i], {range: [lastTop, upperX[i + 1].offsetTop]}));
        lastTop = upperX[i + 1].offsetTop;
    } else {
        sectionRanges.push(Object.assign(upperX[i], {range: [lastTop, Infinity]}));
    }
}

var activeClass = "active";

function checkNavbarStyle () {
    sectionRanges.forEach(function (section) {
        if (window.pageYOffset >= section.range[0] && window.pageYOffset < section.range[1]) {
            section.link.classList.add(activeClass);
        } else {
            section.link.classList.remove(activeClass);
        }
    })
}

window.addEventListener("scroll", checkNavbarStyle);

checkNavbarStyle();

// tab bars

function openTab(evt) {
    // Declare all variables
    var i, tabcontent, tablinks, toShow;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tab-links");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    var tabClass = evt.currentTarget.id.slice(0, -3);

    // Show the current tab, and add an "active" class to the button that opened the tab
    toShow = document.getElementsByClassName(tabClass);

    for (i = 0; i < toShow.length; i++) {
        toShow[i].style.display = "block";
    }

    evt.currentTarget.className += " active";
}
(function () {
    var hash = location.hash;

    if (hash.length > 1) {
        var clickOn = hash.substring(1) + "Tab";
        document.getElementById(clickOn).click();
    }
})();
