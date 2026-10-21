// Interactive Particle Star Constellation Field (Optimized & Modular)
let particleAnimationId = null;
let particleMouseBound = false;

const particleMouse = {
    x: null,
    y: null,
    active: false,
    radius: 180
};

function initParticles() {
    stopParticles();
    const canvas = document.getElementById('particles-js');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    let particles = [];
    const maxDistance = 110;

    if (!particleMouseBound) {
        window.addEventListener('mousemove', (e) => {
            particleMouse.x = e.clientX;
            particleMouse.y = e.clientY;
            particleMouse.active = true;
        });

        window.addEventListener('mouseleave', () => {
            particleMouse.active = false;
            particleMouse.x = null;
            particleMouse.y = null;
        });
        particleMouseBound = true;
    }

    const createParticles = () => {
        particles = [];
        let particleCount = Math.floor(canvas.width * canvas.height / 18000);
        if (particleCount > 85) particleCount = 85;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: Math.random() * 0.4 - 0.2,
                vy: Math.random() * 0.4 - 0.2,
                dx: 0,
                dy: 0,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.01 + 0.005,
                twinkleDir: 1
            });
        }
    };

    const drawStar = (x, y, radius, alpha) => {
        ctx.beginPath();
        ctx.moveTo(x, y - radius * 2.2);
        ctx.quadraticCurveTo(x, y, x + radius * 2.2, y);
        ctx.quadraticCurveTo(x, y, x, y + radius * 2.2);
        ctx.quadraticCurveTo(x, y, x - radius * 2.2, y);
        ctx.quadraticCurveTo(x, y, x, y - radius * 2.2);
        ctx.closePath();
        ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.2})`;
        ctx.fill();
    };

    const animate = () => {
        if (!document.getElementById('particles-js')) {
            stopParticles();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            let targetVx = p.vx;
            let targetVy = p.vy;

            if (particleMouse.active && particleMouse.x !== null && particleMouse.y !== null) {
                const dx = particleMouse.x - p.x;
                const dy = particleMouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < particleMouse.radius) {
                    const force = (particleMouse.radius - distance) / particleMouse.radius;
                    targetVx += (dx / distance) * force * 0.5;
                    targetVy += (dy / distance) * force * 0.5;
                }
            }

            p.dx += (targetVx - p.dx) * 0.1;
            p.dy += (targetVy - p.dy) * 0.1;

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > canvas.width) {
                p.vx *= -1;
                p.dx *= -1;
            }
            if (p.y < 0 || p.y > canvas.height) {
                p.vy *= -1;
                p.dy *= -1;
            }

            if (p.x < 0) p.x = 0;
            if (p.x > canvas.width) p.x = canvas.width;
            if (p.y < 0) p.y = 0;
            if (p.y > canvas.height) p.y = canvas.height;

            p.alpha += p.twinkleSpeed * p.twinkleDir;
            if (p.alpha > 0.8 || p.alpha < 0.2) {
                p.twinkleDir *= -1;
            }

            drawStar(p.x, p.y, p.radius, p.alpha);
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const pi = particles[i];
                const pj = particles[j];

                const dx = pi.x - pj.x;
                const dy = pi.y - pj.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    let opacity = (maxDistance - distance) / maxDistance * 0.15;

                    if (particleMouse.active && particleMouse.x !== null && particleMouse.y !== null) {
                        const distToMouseI = Math.sqrt((particleMouse.x - pi.x) ** 2 + (particleMouse.y - pi.y) ** 2);
                        const distToMouseJ = Math.sqrt((particleMouse.x - pj.x) ** 2 + (particleMouse.y - pj.y) ** 2);

                        if (distToMouseI < particleMouse.radius && distToMouseJ < particleMouse.radius) {
                            opacity += 0.1;
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(pi.x, pi.y);
                    ctx.lineTo(pj.x, pj.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        particleAnimationId = requestAnimationFrame(animate);
    };

    const onResize = () => {
        if (!document.getElementById('particles-js')) {
            window.removeEventListener('resize', onResize);
            return;
        }
        resizeCanvas();
        createParticles();
    };
    window.addEventListener('resize', onResize);

    createParticles();
    animate();
}

function stopParticles() {
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
        particleAnimationId = null;
    }
}

window.initParticles = initParticles;
window.stopParticles = stopParticles;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}
