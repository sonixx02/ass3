const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

const numCheckpoints = 7;
let currentCheckpoint = 0;

const imageData = [
    ['images/1.png', 'images/2.png'],
    ['images/3.png', 'images/4.png', 'images/5.png'],
    ['images/13.png', 'images/14.png'],
    ['images/8.png', 'images/9.png', 'images/10.png'],
    ['images/11.png', 'images/12.png'],
    ['images/14.png', 'images/16.png'],
    ['images/17.png', 'images/21.png'],
    ['images/18.png', 'images/19.png', 'images/20.png'],
    ['images/22.png', 'images/23.png', 'images/24.png']
];

const textData = [
    'Text for checkpoint 1',
    'Text for checkpoint 2',
    'Text for checkpoint 3',
    'Text for checkpoint 4',
    'Text for checkpoint 5',
    'Text for checkpoint 6',
    'Text for checkpoint 7',
];


const colors = [
    '#3498db',
    '#e74c3c',
    '#2ecc71',
    '#f39c12',
    '#9b59b6',
    '#1abc9c',
    '#e67e22',
    '#34495e'
];

function createCheckpoints() {
    const centerX = 150;
    const centerY = 150;
    const radius = 140;
    const tiltAngle = Math.PI / -14;

    for (let i = 0; i < numCheckpoints; i++) {
        const angle = (i / (numCheckpoints - 1)) * (3 * Math.PI / 2) - (Math.PI / 2) + tiltAngle;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const checkpoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        checkpoint.setAttribute("cx", x);
        checkpoint.setAttribute("cy", y);
        checkpoint.setAttribute("r", "10");
        checkpoint.setAttribute("fill", "white");
        checkpoint.classList.add("checkpoint");
        checkpoint.id = `checkpoint-${i}`;

        checkpoint.addEventListener('click', () => moveToCheckpoint(i));

        document.querySelector('.progress-ring').appendChild(checkpoint);
    }
}

function moveToCheckpoint(index) {
    const progress = (index / (numCheckpoints - 1)) * 100;
    gsap.to(circle, {
        strokeDashoffset: circumference - progress / 100 * circumference,
        duration: 0.5,
        onComplete: () => {
            updateLeftSectionColor(index);
            displayImage(index);
            updateDynamicText(index);
        }
    });
    currentCheckpoint = index;
}



function updateLeftSectionColor(index) {
    const colorIndex = index % colors.length;
    const color = colors[colorIndex];


    const leftSection = document.querySelector('.left-section , body');
    leftSection.style.backgroundColor = color;
}

function displayImage(index) {
    const rightSection = document.querySelector('.right-section');
    rightSection.innerHTML = '';


    const images = imageData[index];


    images.forEach((imageUrl, i) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Image ${index + 1}-${i + 1}`;


        img.style.opacity = 0;


        let animationProps = {};
        if (i % 3 === 0) {

            animationProps = { opacity: 1 };
        } else if (i % 3 === 1) {

            animationProps = { opacity: 1 };
        }


        gsap.fromTo(img, {
            x: 0,
            y: 0,
            opacity: 0
        }, {
            ...animationProps,
            duration: 1,
            delay: i * 0.2,
            ease: "power3.out"
        });


        rightSection.appendChild(img);
    });
}

function updateDynamicText(index) {
    const dynamicText = document.getElementById('dynamic-text');
    dynamicText.textContent = textData[index];
}

function handleScroll(event) {
    const scrollThumb = document.querySelector('.thumb');
    const scrollPercent = scrollThumb.offsetTop / (window.innerHeight - scrollThumb.offsetHeight);
    const checkpointIndex = Math.round(scrollPercent * (numCheckpoints - 1));

    if (checkpointIndex !== currentCheckpoint) {
        moveToCheckpoint(checkpointIndex);
    }
}


createCheckpoints();
moveToCheckpoint(0);


const scrollThumb = document.querySelector('.thumb');
let isDragging = false;
let startY, startTop;

scrollThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startTop = scrollThumb.offsetTop;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const newTop = Math.min(Math.max(startTop + deltaY, 0), window.innerHeight - scrollThumb.offsetHeight);
    scrollThumb.style.top = `${newTop}px`;
    handleScroll();
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}


