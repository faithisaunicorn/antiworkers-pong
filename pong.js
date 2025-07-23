// Game object class to handle individual floating objects
class GameObject {
    constructor(imagePath, container) {
        this.element = document.createElement('div');
        this.element.className = 'game-object';

        this.img = document.createElement('img');
        this.img.src = imagePath;
        this.img.style.width = '100px'; // Initial size
        this.img.style.height = 'auto';

        this.element.appendChild(this.img);
        container.appendChild(this.element);

        // Physics properties
        this.x = Math.random() * (window.innerWidth - 100);
        this.y = Math.random() * (window.innerHeight - 100);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }

    update() {
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Bounce off walls
        if (this.x < 0 || this.x > window.innerWidth - 100) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(this.x, window.innerWidth - 100));
        }
        if (this.y < 0 || this.y > window.innerHeight - 100) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(this.y, window.innerHeight - 100));
        }

        // Apply friction
        this.vx *= 0.9;
        this.vy *= 0.9
        this.rotationSpeed *= 0.99;

        this.updatePosition();
    }

    applyForce(fx, fy, distance) {
        const strength = Math.max(0, 1 - distance / 200);
        this.vx += fx * strength * 0.5;
        this.vy += fy * strength * 0.5;
        this.rotationSpeed += (Math.random() - 0.5) * strength * 2;
    }
}

// Main game class
class Game {
    constructor() {
        this.container = document.getElementById('gameContainer');
        this.cursor = document.getElementById('cursor');
        this.objects = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        // Create game objects
        const imageNames = Array.from({length: 12}, (_, i) => `images/IMG_0${658 + i}.PNG`);
        imageNames.forEach(imageName => {
            this.objects.push(new GameObject(imageName, this.container));
        });

        // Event listeners
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursor.style.left = `${this.mouseX}px`;
            this.cursor.style.top = `${this.mouseY}px`;
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // Ensure objects stay within bounds after resize
            this.objects.forEach(obj => {
                obj.x = Math.min(obj.x, window.innerWidth - 100);
                obj.y = Math.min(obj.y, window.innerHeight - 100);
            });
        });

        // Start game loop
        this.gameLoop();
    }

    gameLoop() {
        // Update all objects
        this.objects.forEach(obj => {
            // Calculate distance to cursor
            const dx = this.mouseX - (obj.x + 50);
            const dy = this.mouseY - (obj.y + 50);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply force from cursor
            if (distance < 200) {
                const fx = dx / distance;
                const fy = dy / distance;
                obj.applyForce(fx, fy, distance);
            }

            obj.update();
        });

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Export the Game class
export { Game };