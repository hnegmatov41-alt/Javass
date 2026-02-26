const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const N = 60; // Длинный сегментированный хвост
const segments = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

for (let i = 0; i < N; i++) segments[i] = { x: pointer.x, y: pointer.y, angle: 0 };

function updateInput(e) {
    const t = e.touches ? e.touches[0] : e;
    pointer.x = t.clientX;
    pointer.y = t.clientY;
}
window.addEventListener('mousemove', updateInput);
window.addEventListener('touchmove', (e) => { e.preventDefault(); updateInput(e); }, { passive: false });

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Плавное следование за целью
    segments[0].x += (pointer.x - segments[0].x) * 0.2;
    segments[0].y += (pointer.y - segments[0].y) * 0.2;

    for (let i = 1; i < N; i++) {
        const dx = segments[i-1].x - segments[i].x;
        const dy = segments[i-1].y - segments[i].y;
        segments[i].angle = Math.atan2(dy, dx);
        segments[i].x = segments[i-1].x - Math.cos(segments[i].angle) * 11;
        segments[i].y = segments[i-1].y - Math.sin(segments[i].angle) * 11;

        ctx.save();
        ctx.translate(segments[i].x, segments[i].y);
        ctx.rotate(segments[i].angle);

        const alpha = Math.max(0.1, 1 - i / N);
        ctx.strokeStyle = `rgba(15, 15, 15, ${alpha})`;
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`;

        // --- 1. ГОЛОВА (Стилизованная маска с острыми чертами) ---
        if (i === 1) {
            ctx.beginPath();
            ctx.moveTo(22, 0); 
            ctx.lineTo(0, -14); ctx.lineTo(-12, 0); ctx.lineTo(0, 14);
            ctx.closePath();
            ctx.fill();

            // ГЛАЗА (Два светлых пятна, хищный вид)
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(8, -5, 2.5, 0, Math.PI * 2); // Левый
            ctx.arc(8, 5, 2.5, 0, Math.PI * 2);  // Правый
            ctx.fill();
        }

        // --- 2. КРЫЛЬЯ (Две пары веерообразных структур) ---
        // Первая пара на 10-м сегменте, вторая на 22-м
        if (i === 10 || i === 22) {
            ctx.lineWidth = 0.7;
            for (let j = 0; j < 12; j++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const sweep = j * 9;
                ctx.quadraticCurveTo(20, -30 - sweep, -60 - sweep, -80 - sweep);
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(20, 30 + sweep, -60 - sweep, 80 + sweep);
                ctx.stroke();
            }
        }

        // --- 3. СКЕЛЕТ / ПОЗВОНОЧНИК (Сегменты-позвонки) ---
        // ХВОСТ сужается к концу (размер уменьшается от i)
        const spineSize = Math.max(1, 16 - i * 0.3); 
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -spineSize);
        ctx.lineTo(2, 0);
        ctx.lineTo(0, spineSize);
        ctx.stroke();

        // Соединительная нить позвоночника
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-12, 0); ctx.stroke();

        ctx.restore();
    }
    requestAnimationFrame(draw);
}
draw();
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
});

