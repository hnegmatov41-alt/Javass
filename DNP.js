const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// Отслеживание мыши
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Класс для сегмента тела (позвоночника)
class Segment {
    constructor(x, y, len, angle) {
        this.x = x;
        this.y = y;
        this.len = len;
        this.angle = angle;
        this.nextX = x + Math.cos(angle) * len;
        this.nextY = y + Math.sin(angle) * len;
    }

    follow(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.angle = Math.atan2(dy, dx);
        this.x = targetX - Math.cos(this.angle) * this.len;
        this.y = targetY - Math.sin(this.angle) * this.len;
    }

    update() {
        this.nextX = this.x + Math.cos(this.angle) * this.len;
        this.nextY = this.y + Math.sin(this.angle) * this.len;
    }

    show(i) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.nextX, this.nextY);
        ctx.stroke();

        // Рисуем "ребра" как на картинке
        ctx.save();
        ctx.translate(this.nextX, this.nextY);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(-15 + i, 0); // Ребра становятся короче к хвосту
        ctx.lineTo(15 - i, 0);
        ctx.stroke();
        ctx.restore();
    }
}

// Создаем "существо" из 20 сегментов
const segments = [];
for (let i = 0; i < 20; i++) {
    segments.push(new Segment(100, 100, 20, 0));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Первый сегмент следует за мышью
    segments[0].follow(mouse.x, mouse.y);
    segments[0].update();
    segments[0].show(0);

    // Остальные следуют друг за другом
    for (let i = 1; i < segments.length; i++) {
        segments[i].follow(segments[i - 1].x, segments[i - 1].y);
        segments[i].update();
        segments[i].show(i);
    }

    requestAnimationFrame(animate);
}

animate();
