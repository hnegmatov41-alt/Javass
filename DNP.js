const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 65; // Длинное тело дракона
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

for (let i = 0; i < N; i++) {
    segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };
}

window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

function drawDragon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Цвета туши: почти черный и темно-серый
    ctx.strokeStyle = "rgba(20, 20, 20, 0.9)"; 
    ctx.fillStyle = "rgba(20, 20, 20, 1)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. Движение (плавное следование)
    segments[0].x += (pointer.x - segments[0].x) * 0.15;
    segments[0].y += (pointer.y - segments[0].y) * 0.15;

    for (let i = 1; i < N; i++) {
        const dx = segments[i-1].x - segments[i].x;
        const dy = segments[i-1].y - segments[i].y;
        segments[i].angle = Math.atan2(dy, dx);
        
        const dist = 10; // Расстояние между позвонками
        segments[i].x = segments[i-1].x - Math.cos(segments[i].angle) * dist;
        segments[i].y = segments[i-1].y - Math.sin(segments[i].angle) * dist;

        // 2. Рисование дракона
        ctx.save();
        ctx.translate(segments[i].x, segments[i].y);
        ctx.rotate(segments[i].angle);

        if (i === 1) { 
            // ГОЛОВА ДРАКОНА
            ctx.beginPath();
            ctx.ellipse(10, 0, 22, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // УСЫ (Длинные, извивающиеся)
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(15, -5); ctx.bezierCurveTo(40, -30, 60, -10, 90, -40);
            ctx.moveTo(15, 5); ctx.bezierCurveTo(40, 30, 60, 10, 90, 40);
            ctx.stroke();

            // РОГА
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -8); ctx.lineTo(-15, -30); ctx.lineTo(-5, -40);
            ctx.moveTo(0, 8); ctx.lineTo(-15, 30); ctx.lineTo(-5, 40);
            ctx.stroke();
            
        } else if (i % 20 === 0 && i < 50) { 
            // ЛАПЫ С КОГТЯМИ
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.quadraticCurveTo(15, 35, 30, 40); 
            ctx.moveTo(0, 0); ctx.quadraticCurveTo(15, -35, 30, -40);
            ctx.stroke();
        } else {
            // ТЕЛО И ГРИВА
            const size = Math.max(1, 22 - i * 0.35); 
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(-12, 0);
            ctx.stroke();

            // ГРИВА (шерсть на спине)
            if (i % 2 === 0) {
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -size/2);
                ctx.quadraticCurveTo(-10, -size - 12, -18, -size - 2);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
    requestAnimationFrame(drawDragon);
}

drawDragon();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
