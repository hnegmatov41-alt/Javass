const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 50; 
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

for (let i = 0; i < N; i++) segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };

// ФУНКЦИЯ ДЛЯ ТЕЛЕФОНА И МЫШКИ
function updatePos(e) {
    let x, y;
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    pointer.x = x;
    pointer.y = y;
}

window.addEventListener('mousemove', updatePos);
window.addEventListener('touchmove', (e) => { e.preventDefault(); updatePos(e); }, { passive: false });
window.addEventListener('touchstart', updatePos, { passive: false });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < N; i++) {
        const dx = (i === 1 ? pointer.x : segments[i-1].x) - segments[i].x;
        const dy = (i === 1 ? pointer.y : segments[i-1].y) - segments[i].y;
        segments[i].angle = Math.atan2(dy, dx);
        segments[i].x = (i === 1 ? pointer.x : segments[i-1].x) - Math.cos(segments[i].angle) * 12;
        segments[i].y = (i === 1 ? pointer.y : segments[i-1].y) - Math.sin(segments[i].angle) * 12;

        ctx.save();
        ctx.translate(segments[i].x, segments[i].y);
        ctx.rotate(segments[i].angle);
        const alpha = Math.max(0.1, 1 - i / N);
        ctx.strokeStyle = `rgba(30, 30, 30, ${alpha})`;
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`;

        if (i === 1) { // Голова
            ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(-10, -12); ctx.lineTo(-10, 12); ctx.fill();
        } 
        if (i === 8 || i === 15) { // Перья
            for (let j = 0; j < 8; j++) {
                ctx.beginPath(); ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(20, -40 - j*8, -60 - j*8, -80 - j*8);
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(20, 40 + j*8, -60 - j*8, 80 + j*8);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
    requestAnimationFrame(draw);
}
draw();
