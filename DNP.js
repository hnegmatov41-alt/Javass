const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 55; // Длина существа
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

// Инициализация сегментов
for (let i = 0; i < N; i++) {
    segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };
}

// Универсальное управление (Мышь + Тач)
function handleInput(e) {
    const t = e.touches ? e.touches[0] : e;
    pointer.x = t.clientX;
    pointer.y = t.clientY;
}
window.addEventListener('mousemove', handleInput);
window.addEventListener('touchstart', (e) => { handleInput(e); }, { passive: false });
window.addEventListener('touchmove', (e) => { e.preventDefault(); handleInput(e); }, { passive: false });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Плавное следование головы за целью
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

        // Стиль туши: черный с прозрачностью к хвосту
        const alpha = Math.max(0.1, 1 - i / N);
        ctx.strokeStyle = `rgba(15, 15, 15, ${alpha})`;
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`;

        // --- 1. ГОЛОВА (Хищная маска с белыми глазами) ---
        if (i === 1) {
            // Форма головы
            ctx.beginPath();
            ctx.moveTo(22, 0); 
            ctx.lineTo(5, -14); ctx.lineTo(-12, 0); ctx.lineTo(5, 14);
            ctx.closePath();
            ctx.fill();

            // Белые глаза
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(8, -5, 2.5, 0, Math.PI * 2);
            ctx.arc(8, 5, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Длинные усы
            ctx.strokeStyle = `rgba(20, 20, 20, 0.7)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(5, -5); ctx.bezierCurveTo(40, -40, 80, -20, 100, -50);
            ctx.moveTo(5, 5); ctx.bezierCurveTo(40, 40, 80, 20, 100, 50);
            ctx.stroke();
        }

        // --- 2. КРЫЛЬЯ (Две маленькие аккуратные пары) ---
        if (i === 10 || i === 22) {
            ctx.lineWidth = 0.5;
            for (let j = 0; j < 10; j++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const sweep = j * 6;
                // Верхнее перо (укороченное до -45)
                ctx.quadraticCurveTo(15, -25 - sweep, -45 - sweep, -60 - sweep);
                // Нижнее перо (укороченное до 45)
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(15, 25 + sweep, -45 - sweep, 60 + sweep);
                ctx.stroke();
            }
        }

        // --- 3. ПОЗВОНОЧНИК (Сегменты-позвонки) ---
        const spineSize = Math.max(1, 15 - i * 0.3); 
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -spineSize);
        ctx.lineTo(2, 0);
        ctx.lineTo(0, spineSize);
        ctx.stroke();

        // Соединительная линия тела
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-12, 0); ctx.stroke();

        ctx.restore();
    }
    requestAnimationFrame(draw);
}
draw();

// Адаптация при повороте экрана
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
