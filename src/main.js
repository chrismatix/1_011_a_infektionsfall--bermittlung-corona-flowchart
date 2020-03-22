document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

var navLinks = document.querySelectorAll('a[href^="#"]');

var upperX = [];

navLinks.forEach(function (link) {
    console.debug(link.href);
    var id = link.href.split("#")[1];
    console.log("id :" + id);
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

console.debug('sectionRanges', sectionRanges);

function checkNavbarStyle () {
    sectionRanges.forEach(function (section) {
        if (window.pageYOffset >= section.range[0] && window.pageYOffset < section.range[1]) {
            section.link.classList.add("bold");
        } else {
            section.link.classList.remove("bold");
        }
    })
}

window.addEventListener("scroll", checkNavbarStyle);

checkNavbarStyle();
