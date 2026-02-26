const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 50; // Длина дракона
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

for (let i = 0; i < N; i++) {
    segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };
}

function handleInput(e) {
    const t = e.touches ? e.touches[0] : e;
    pointer.x = t.clientX;
    pointer.y = t.clientY;
}
window.addEventListener('mousemove', handleInput);
window.addEventListener('touchmove', (e) => { e.preventDefault(); handleInput(e); }, { passive: false });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Плавное следование головы за курсором
    segments[0].x += (pointer.x - segments[0].x) * 0.2;
    segments[0].y += (pointer.y - segments[0].y) * 0.2;

    for (let i = 1; i < N; i++) {
        const dx = segments[i-1].x - segments[i].x;
        const dy = segments[i-1].y - segments[i].y;
        segments[i].angle = Math.atan2(dy, dx);
        
        // Соединяем сегменты в одну линию
        const dist = 10; 
        segments[i].x = segments[i-1].x - Math.cos(segments[i].angle) * dist;
        segments[i].y = segments[i-1].y - Math.sin(segments[i].angle) * dist;

        ctx.save();
        ctx.translate(segments[i].x, segments[i].y);
        ctx.rotate(segments[i].angle);

        // Стиль туши (прозрачность к хвосту)
        const alpha = Math.max(0.05, 1 - i / N);
        ctx.strokeStyle = `rgba(20, 20, 20, ${alpha})`;
        ctx.fillStyle = `rgba(20, 20, 20, ${alpha})`;

        if (i === 1) {
            // КРАСИВАЯ ГОЛОВА
            ctx.beginPath();
            ctx.moveTo(20, 0); ctx.lineTo(-10, -12); ctx.lineTo(-10, 12); ctx.fill();
            // УСЫ
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(10, -5); ctx.quadraticCurveTo(40, -30, 70, -10);
            ctx.moveTo(10, 5); ctx.quadraticCurveTo(40, 30, 70, 10);
            ctx.stroke();
        } 
        
        // ПЫШНЫЕ ПЕРЬЯ (теперь они соединены с телом)
        if (i === 7 || i === 15 || i === 23) {
            ctx.lineWidth = 0.5;
            for (let j = 0; j < 12; j++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const sweep = j * 7;
                ctx.quadraticCurveTo(20, -30 - sweep, -50 - sweep, -70 - sweep);
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(20, 30 + sweep, -50 - sweep, 70 + sweep);
                ctx.stroke();
            }
        }

        // ПОЗВОНОЧНИК (соединительная линия)
        ctx.lineWidth = Math.max(0.5, 3 - i/10);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-12, 0);
        ctx.stroke();

        ctx.restore();
    }
    requestAnimationFrame(draw);
}
draw();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
