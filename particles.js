// Interactive Particle Star Constellation Field
const canvas = document.getElementById('particles-js');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas sizes
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    let particles = [];
    const maxDistance = 110; // distance to draw connection lines
    
    // Mouse interaction states
    const mouse = {
        x: null,
        y: null,
        active: false,
        radius: 180 // interactive radius pull
    };

    // Track mouse actions
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    // Create initial stars
    const createParticles = () => {
        particles = [];
        // Adjust density depending on screen size
        let particleCount = Math.floor(canvas.width * canvas.height / 18000);
        if (particleCount > 100) particleCount = 100; // cap count for performance
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                // base velocities (slow drift)
                vx: Math.random() * 0.4 - 0.2,
                vy: Math.random() * 0.4 - 0.2,
                // actual velocities (dynamic)
                dx: 0,
                dy: 0,
                radius: Math.random() * 1.5 + 0.5,
                // twinkle properties
                alpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.01 + 0.005,
                twinkleDir: 1
            });
        }
    };

    // Function to draw a four-pointed star
    const drawStar = (x, y, radius, alpha) => {
        ctx.beginPath();
        // Drawing a neat diamond/star layout
        ctx.moveTo(x, y - radius * 2.2);
        ctx.quadraticCurveTo(x, y, x + radius * 2.2, y);
        ctx.quadraticCurveTo(x, y, x, y + radius * 2.2);
        ctx.quadraticCurveTo(x, y, x - radius * 2.2, y);
        ctx.quadraticCurveTo(x, y, x, y - radius * 2.2);
        ctx.closePath();
        ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`; // indigo-400
        ctx.fill();

        // Core highlight dot
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.2})`;
        ctx.fill();
    };

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update & Draw Particles
        particles.forEach(p => {
            // Apply slow baseline drifting
            let targetVx = p.vx;
            let targetVy = p.vy;

            // Interactive mouse attraction logic
            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Calculate pull force (stronger closer to the center)
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Add vector pull towards cursor
                    targetVx += (dx / distance) * force * 0.5;
                    targetVy += (dy / distance) * force * 0.5;
                }
            }

            // Smooth velocity dampening
            p.dx += (targetVx - p.dx) * 0.1;
            p.dy += (targetVy - p.dy) * 0.1;

            // Update positions
            p.x += p.dx;
            p.y += p.dy;

            // Bounce off boundaries
            if (p.x < 0 || p.x > canvas.width) {
                p.vx *= -1;
                p.dx *= -1;
            }
            if (p.y < 0 || p.y > canvas.height) {
                p.vy *= -1;
                p.dy *= -1;
            }

            // Clamp particle back into screen if resized
            if (p.x < 0) p.x = 0;
            if (p.x > canvas.width) p.x = canvas.width;
            if (p.y < 0) p.y = 0;
            if (p.y > canvas.height) p.y = canvas.height;

            // Twinkle brightness modulation
            p.alpha += p.twinkleSpeed * p.twinkleDir;
            if (p.alpha > 0.8 || p.alpha < 0.2) {
                p.twinkleDir *= -1;
            }

            // Draw individual star
            drawStar(p.x, p.y, p.radius, p.alpha);
        });

        // Draw connections (Constellations)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const pi = particles[i];
                const pj = particles[j];

                const dx = pi.x - pj.x;
                const dy = pi.y - pj.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    // Line opacity drops off with distance
                    let opacity = (maxDistance - distance) / maxDistance * 0.15;
                    
                    // Extra line brightness if near the active mouse pointer
                    if (mouse.active && mouse.x !== null && mouse.y !== null) {
                        const distToMouseI = Math.sqrt((mouse.x - pi.x)**2 + (mouse.y - pi.y)**2);
                        const distToMouseJ = Math.sqrt((mouse.x - pj.x)**2 + (mouse.y - pj.y)**2);
                        
                        if (distToMouseI < mouse.radius && distToMouseJ < mouse.radius) {
                            opacity += 0.1; // boost brightness
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(pi.x, pi.y);
                    ctx.lineTo(pj.x, pj.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`; // Indigo stroke link
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    createParticles();
    animate();
}
