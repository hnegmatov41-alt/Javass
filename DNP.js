const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 40; // Количество сегментов
const elems = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

// 1. Инициализация (как на скрине)
for (let i = 0; i < N; i++) {
    elems[i] = { x: pointer.x, y: pointer.y, angle: 0 };
}

window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Цвет линий (темно-серый, почти черный, как тушь)
    ctx.strokeStyle = "rgba(30, 30, 30, 0.85)";
    ctx.fillStyle = "rgba(30, 30, 30, 0.9)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Движение головы за мышью
    elems[0].x = pointer.x;
    elems[0].y = pointer.y;

    for (let i = 1; i < N; i++) {
        const dx = elems[i - 1].x - elems[i].x;
        const dy = elems[i - 1].y - elems[i].y;
        elems[i].angle = Math.atan2(dy, dx);
        
        const dist = 14; // Расстояние между звеньями
        elems[i].x = elems[i - 1].x - Math.cos(elems[i].angle) * dist;
        elems[i].y = elems[i - 1].y - Math.sin(elems[i].angle) * dist;

        // РИСОВАНИЕ (Логика из вашего изображения)
        ctx.save();
        ctx.translate(elems[i].x, elems[i].y);
        ctx.rotate(elems[i].angle);

        if (i === 1) { 
            // Cabeza (Голова)
            ctx.beginPath();
            ctx.ellipse(5, 0, 18, 12, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (i === 8 || i === 14) { 
            // Aletas (Плавники) - длинные изогнутые линии
            ctx.lineWidth = 3;
            ctx.beginPath();
            // Верхний плавник
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(10, -70, -60, -110);
            // Нижний плавник
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(10, 70, -60, 110);
            ctx.stroke();
        } else {
            // Espina (Шипы/Позвоночник)
            const thickness = Math.max(1, 25 - i * 0.6); // Сужается к хвосту
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -thickness);
            ctx.lineTo(0, thickness);
            // Маленький изгиб для стиля аниме
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-10, thickness + 5, -20, thickness + 15);
            ctx.stroke();
        }
        ctx.restore();
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
