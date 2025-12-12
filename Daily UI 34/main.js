import * as THREE from 'three';

// Game State
const gameState = {
    currentCar: 1,
    currentCharacter: 'boy',
    destination: 'Home',
    isNavigating: false,
    carPosition: { x: 0, z: 0 },
    carRotation: 0,
    speed: 0,
    maxSpeed: 0.15,
    distanceTraveled: 0,
    targetDistance: 305,
    arrivalTime: null,
    hasArrived: false
};

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a2a);

const camera = new THREE.OrthographicCamera(
    -10, 10, 10, -10, 0.1, 1000
);
camera.position.set(0, 15, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ 
    antialias: false,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1); // Pixel art style
document.getElementById('game-container').appendChild(renderer.domElement);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

// Car Sprite
let carSprite = null;
let carTexture = null;

// Road Tiles
const roadTiles = [];
const tileSize = 2;
const roadWidth = 4;

// Load Car Texture
function loadCarTexture(carNumber) {
    return new Promise((resolve) => {
        textureLoader.load(
            `${carNumber}.png`,
            (texture) => {
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;
                texture.generateMipmaps = false;
                resolve(texture);
            },
            undefined,
            () => resolve(null)
        );
    });
}

// Create Car Sprite
async function createCarSprite(carNumber) {
    const texture = await loadCarTexture(carNumber);
    if (!texture) return;

    if (carSprite) {
        scene.remove(carSprite);
        carTexture.dispose();
    }

    carTexture = texture;
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
    });
    
    carSprite = new THREE.Sprite(material);
    carSprite.scale.set(2, 2, 1);
    carSprite.position.set(0, 0, 0);
    scene.add(carSprite);
}

// Load Road Tiles
let roadTile1 = null;
let roadTile2 = null;

async function loadRoadTiles() {
    return new Promise((resolve) => {
        let loaded = 0;
        
        textureLoader.load('street_tile_2.png', (texture) => {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            roadTile1 = texture;
            loaded++;
            if (loaded === 2) resolve();
        });
        
        textureLoader.load('street_tile_2_1.png', (texture) => {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            roadTile2 = texture;
            loaded++;
            if (loaded === 2) resolve();
        });
    });
}

// Create Road
function createRoad() {
    // Clear existing road
    roadTiles.forEach(tile => {
        scene.remove(tile);
        tile.geometry.dispose();
        tile.material.dispose();
    });
    roadTiles.length = 0;

    const roadLength = 100;
    const roadCenterX = 0;

    for (let z = -roadLength; z < roadLength; z += tileSize) {
        for (let x = -roadWidth; x < roadWidth; x += tileSize) {
            const geometry = new THREE.PlaneGeometry(tileSize, tileSize);
            const useTile1 = Math.random() > 0.5;
            const material = new THREE.MeshBasicMaterial({
                map: useTile1 ? roadTile1 : roadTile2,
                transparent: false
            });
            
            const tile = new THREE.Mesh(geometry, material);
            tile.rotation.x = -Math.PI / 2;
            tile.position.set(roadCenterX + x, -0.1, z);
            scene.add(tile);
            roadTiles.push(tile);
        }
    }
}

// Mini Map
const miniMapCanvas = document.getElementById('mini-map');
const miniMapCtx = miniMapCanvas.getContext('2d');
miniMapCanvas.width = 280;
miniMapCanvas.height = 180;

function drawMiniMap() {
    miniMapCtx.fillStyle = '#1a1a1a';
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

    // Draw roads
    miniMapCtx.fillStyle = '#444';
    miniMapCtx.fillRect(0, miniMapCanvas.height / 2 - 20, miniMapCanvas.width, 40);

    // Draw route
    miniMapCtx.strokeStyle = '#6c5ce7';
    miniMapCtx.lineWidth = 4;
    miniMapCtx.beginPath();
    miniMapCtx.moveTo(miniMapCanvas.width / 2, miniMapCanvas.height);
    miniMapCtx.lineTo(miniMapCanvas.width / 2, miniMapCanvas.height / 2);
    miniMapCtx.stroke();

    // Draw car position
    const carX = miniMapCanvas.width / 2;
    const carY = miniMapCanvas.height - (gameState.distanceTraveled / gameState.targetDistance) * (miniMapCanvas.height / 2);
    
    miniMapCtx.fillStyle = '#ffd700';
    miniMapCtx.beginPath();
    miniMapCtx.arc(carX, carY, 6, 0, Math.PI * 2);
    miniMapCtx.fill();
    
    miniMapCtx.strokeStyle = '#fff';
    miniMapCtx.lineWidth = 2;
    miniMapCtx.stroke();
}

// Controls
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

// Update Game
function updateGame() {
    if (!gameState.isNavigating || gameState.hasArrived) return;

    let moveX = 0;
    let moveZ = 0;
    let newRotation = gameState.carRotation;

    // Movement controls
    if (keys['w'] || keys['arrowup'] || keys['KeyW'] || keys['ArrowUp']) {
        moveZ = -gameState.speed;
        gameState.speed = Math.min(gameState.speed + 0.01, gameState.maxSpeed);
        newRotation = 0; // Forward
    } else if (keys['s'] || keys['arrowdown'] || keys['KeyS'] || keys['ArrowDown']) {
        moveZ = gameState.speed;
        gameState.speed = Math.min(gameState.speed + 0.01, gameState.maxSpeed * 0.5);
        newRotation = Math.PI; // Backward
    } else {
        gameState.speed = Math.max(gameState.speed - 0.005, 0);
    }

    if (keys['a'] || keys['arrowleft'] || keys['KeyA'] || keys['ArrowLeft']) {
        moveX = -gameState.speed;
        newRotation = Math.PI / 2; // Left
        if (moveZ === 0) {
            gameState.speed = Math.min(gameState.speed + 0.01, gameState.maxSpeed);
        }
    } else if (keys['d'] || keys['arrowright'] || keys['KeyD'] || keys['ArrowRight']) {
        moveX = gameState.speed;
        newRotation = -Math.PI / 2; // Right
        if (moveZ === 0) {
            gameState.speed = Math.min(gameState.speed + 0.01, gameState.maxSpeed);
        }
    }

    // Smooth rotation
    gameState.carRotation = newRotation;

    // Update car position
    gameState.carPosition.x += moveX;
    gameState.carPosition.z += moveZ;

    // Keep car on road
    gameState.carPosition.x = Math.max(-roadWidth + 0.5, Math.min(roadWidth - 0.5, gameState.carPosition.x));

    // Update distance (only when moving forward)
    if (moveZ < 0 || (moveZ === 0 && moveX !== 0)) {
        gameState.distanceTraveled += gameState.speed * 10;
    }

    // Update car sprite
    if (carSprite) {
        carSprite.position.set(gameState.carPosition.x, 0, gameState.carPosition.z);
        carSprite.rotation.y = gameState.carRotation;
    }

    // Update camera to follow car
    camera.position.set(gameState.carPosition.x, 15, gameState.carPosition.z + 5);
    camera.lookAt(gameState.carPosition.x, 0, gameState.carPosition.z);

    // Check arrival
    if (gameState.distanceTraveled >= gameState.targetDistance && !gameState.hasArrived) {
        gameState.hasArrived = true;
        showArrivalScene();
    }

    // Update UI
    updateNavigationUI();
}

// Update Navigation UI
function updateNavigationUI() {
    const remainingDistance = Math.max(0, gameState.targetDistance - gameState.distanceTraveled);
    const hours = Math.floor(remainingDistance / 80);
    const minutes = Math.ceil((remainingDistance % 80) / 80 * 60);
    
    document.getElementById('distance').textContent = `${Math.ceil(remainingDistance)} km`;
    document.getElementById('time').textContent = `${hours} hr ${minutes} min`;
    
    // Calculate arrival time
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + (remainingDistance / 80) * 3600000);
    const arrivalHours = arrivalDate.getHours().toString().padStart(2, '0');
    const arrivalMinutes = arrivalDate.getMinutes().toString().padStart(2, '0');
    document.getElementById('arrival').textContent = `${arrivalHours}:${arrivalMinutes}`;
    
    const speedKmh = Math.round(gameState.speed * 500);
    document.getElementById('speed-display').textContent = `${speedKmh} kmh`;
    
    // Update instruction based on movement
    if (keys['w'] || keys['arrowup'] || keys['KeyW'] || keys['ArrowUp']) {
        document.getElementById('instruction-text').textContent = 'Go straight';
    } else if (keys['a'] || keys['arrowleft'] || keys['KeyA'] || keys['ArrowLeft']) {
        document.getElementById('instruction-text').textContent = 'Turn left';
    } else if (keys['d'] || keys['arrowright'] || keys['KeyD'] || keys['ArrowRight']) {
        document.getElementById('instruction-text').textContent = 'Turn right';
    } else if (keys['s'] || keys['arrowdown'] || keys['KeyS'] || keys['ArrowDown']) {
        document.getElementById('instruction-text').textContent = 'Reverse';
    }
    
    drawMiniMap();
}

// Show Arrival Scene
function showArrivalScene() {
    const arrivalScene = document.getElementById('arrival-scene');
    const houseImage = document.getElementById('house-image');
    const arrivalCharacter = document.getElementById('arrival-character');
    const arrivalLocation = document.getElementById('arrival-location');
    
    // Random house
    const houseNumber = Math.floor(Math.random() * 4) + 9;
    houseImage.src = `${houseNumber}.png`;
    
    // Character
    arrivalCharacter.src = `${gameState.currentCharacter}.png`;
    
    // Location
    arrivalLocation.textContent = gameState.destination;
    
    arrivalScene.classList.remove('hidden');
}

// Event Listeners
document.getElementById('start-navigation').addEventListener('click', () => {
    const destination = document.getElementById('destination-input').value || 'Home';
    gameState.destination = destination;
    gameState.isNavigating = true;
    gameState.hasArrived = false;
    gameState.distanceTraveled = 0;
    gameState.arrivalTime = Date.now() + (gameState.targetDistance / 80) * 3600000;
    
    document.getElementById('destination-panel').style.display = 'none';
    document.getElementById('nav-ui').classList.add('active');
    
    updateNavigationUI();
});

document.getElementById('continue-driving').addEventListener('click', () => {
    document.getElementById('arrival-scene').classList.add('hidden');
    gameState.hasArrived = false;
    gameState.distanceTraveled = 0;
    gameState.isNavigating = true;
});

document.getElementById('close-nav').addEventListener('click', () => {
    document.getElementById('nav-ui').classList.remove('active');
});

// Car Selection
document.querySelectorAll('.car-option').forEach(option => {
    option.addEventListener('click', async () => {
        document.querySelectorAll('.car-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        const carNumber = option.dataset.car;
        gameState.currentCar = parseInt(carNumber);
        await createCarSprite(carNumber);
        
        // Hide car selector and show character selector
        document.getElementById('car-selector').style.display = 'none';
        document.getElementById('character-selector').style.display = 'block';
    });
});

// Character Selection
document.querySelectorAll('.character-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.character-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        gameState.currentCharacter = option.dataset.gender;
        
        // Hide character selector and show destination panel
        document.getElementById('character-selector').style.display = 'none';
        document.getElementById('destination-panel').style.display = 'block';
    });
});

// Initialize
async function init() {
    await loadRoadTiles();
    createRoad();
    await createCarSprite(1);
    
    // Select first car and character by default
    document.querySelector('.car-option[data-car="1"]').classList.add('selected');
    document.querySelector('.character-option[data-gender="boy"]').classList.add('selected');
    
    // Show car selector initially
    document.getElementById('car-selector').style.display = 'block';
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        updateGame();
        renderer.render(scene, camera);
    }
    
    animate();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
init();

