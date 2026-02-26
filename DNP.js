const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 50; // Количество сегментов (длина тела)
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

for (let i = 0; i < N; i++) {
    segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };
}

// Управление для Мыши и Телфона
function updateInput(e) {
    const t = e.touches ? e.touches[0] : e;
    pointer.x = t.clientX;
    pointer.y = t.clientY;
}
window.addEventListener('mousemove', updateInput);
window.addEventListener('touchstart', (e) => { updateInput(e); }, { passive: false });
window.addEventListener('touchmove', (e) => { e.preventDefault(); updateInput(e); }, { passive: false });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Плавное следование за курсором
    segments[0].x += (pointer.x - segments[0].x) * 0.2;
    segments[0].y += (pointer.y - segments[0].y) * 0.2;

    for (let i = 1; i < N; i++) {
        const dx = segments[i-1].x - segments[i].x;
        const dy = segments[i-1].y - segments[i].y;
        segments[i].angle = Math.atan2(dy, dx);
        
        const dist = 10; // Расстояние между позвонками
        segments[i].x = segments[i-1].x - Math.cos(segments[i].angle) * dist;
        segments[i].y = segments[i-1].y - Math.sin(segments[i].angle) * dist;

        ctx.save();
        ctx.translate(segments[i].x, segments[i].y);
        ctx.rotate(segments[i].angle);

        // Цвет черной туши с прозрачностью (как в оригинале)
        const alpha = Math.max(0.1, 1 - i / N);
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.lineCap = "round";

        // --- 1. ГОЛОВА ---
        if (i === 1) {
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-5, -10);
            ctx.lineTo(-8, 0);
            ctx.lineTo(-5, 10);
            ctx.fill();
        }

        // --- 2. ПЕРЬЯ / ПЛАВНИКИ (на 10, 20 и 30 сегментах) ---
        if (i === 10 || i === 20 || i === 30) {
            ctx.lineWidth = 0.5;
            for (let j = 0; j < 14; j++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const sweep = j * 8; // Размах "перьев"
                // Верхняя часть перьев
                ctx.quadraticCurveTo(15, -35 - sweep, -50 - sweep, -75 - sweep);
                // Нижняя часть перьев
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(15, 35 + sweep, -50 - sweep, 75 + sweep);
                ctx.stroke();
            }
        }

        // --- 3. ПОЗВОНОЧНИК (Vertebrae) ---
        // Рисуем маленькие ребра на каждом сегменте
        const spineWidth = Math.max(1, 15 - i * 0.3); // Уменьшается к хвосту
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -spineWidth);
        ctx.lineTo(2, 0); // Небольшой изгиб вперед
        ctx.lineTo(0, spineWidth);
        ctx.stroke();

        // Основная кость (соединение)
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-12, 0);
        ctx.stroke();

        ctx.restore();
    }
    requestAnimationFrame(draw);
}

draw();

// Подстройка под размер экрана
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
