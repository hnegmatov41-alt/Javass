const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 50; 
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

for (let i = 0; i < N; i++) {
    segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };
}

window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Плавное следование за мышью
    segments[0].x += (pointer.x - segments[0].x) * 0.1;
    segments[0].y += (pointer.y - segments[0].y) * 0.1;

    for (let i = 1; i < N; i++) {
        const dx = segments[i-1].x - segments[i].x;
        const dy = segments[i-1].y - segments[i].y;
        segments[i].angle = Math.atan2(dy, dx);
        segments[i].x = segments[i-1].x - Math.cos(segments[i].angle) * 12;
        segments[i].y = segments[i-1].y - Math.sin(segments[i].angle) * 12;

        ctx.save();
        ctx.translate(segments[i].x, segments[i].y);
        ctx.rotate(segments[i].angle);

        // Цвет туши с прозрачностью (как на фото)
        const alpha = Math.max(0.1, 1 - i / N);
        ctx.strokeStyle = `rgba(30, 30, 30, ${alpha})`;
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`;

        if (i === 1) {
            // ГОЛОВА (черная, плотная)
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-5, -12);
            ctx.lineTo(-5, 12);
            ctx.fill();
        } 
        
        // ПЕРЬЯ / ПЛАВНИКИ (на 8, 14 и 20 сегментах)
        if (i === 8 || i === 14 || i === 20) {
            for (let j = 0; j < 15; j++) {
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                // Рисуем веер тонких линий
                const drift = j * 8;
                ctx.quadraticCurveTo(20, -40 - drift, -60 - drift, -80 - drift);
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(20, 40 + drift, -60 - drift, 80 + drift);
                ctx.stroke();
            }
        }

        // ПОЗВОНОЧНИК (основные косточки)
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -10 + i/5);
        ctx.lineTo(0, 10 - i/5);
        ctx.stroke();

        // ДОПОЛНИТЕЛЬНЫЕ ВОРСИНКИ (вдоль всего тела)
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-15, 30, -30, 45);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-15, -30, -30, -45);
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
