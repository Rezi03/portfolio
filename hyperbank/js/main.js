const OFFSET_SOL = -20; 
const JUMP_COOLDOWN = 150; 
const CROUCH_ANIM_TIME = 300; 

const player = document.getElementById('ray');
const groundHeight = 80;

let x = 100;
let y = 0; 
let vy = 0;
const gravity = 0.8;
const jumpForce = 15;
const speed = 5; 

let state = 'idle';
let direction = 'east';
let isGrounded = true;

let landTime = 0;        
let crouchStartTime = 0; 

const keys = {};

// --- PRECHARGEMENT DES IMAGES ---
// Ajoute ici tes images de ramassage pour éviter les bugs d'affichage
const preloadImages = [
    'assets/ray/crouching_east_ray_fixe.png',
    'assets/ray/crouching_west_ray_fixe.png',
    'assets/ray/crouching_east_ray.gif',
    'assets/ray/crouching_west_ray.gif',
    'assets/ray/picking_up_east_ray.gif', // Assure-toi que ce fichier existe !
    'assets/ray/picking_up_west_ray.gif'  // Celui-là aussi !
];
preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

document.addEventListener('keydown', e => {
    if(e.code === "Space" || e.code === "ArrowDown") e.preventDefault();
    keys[e.code] = true;
});

document.addEventListener('keyup', e => {
    keys[e.code] = false;
    if(e.code === "ArrowDown") {
        crouchStartTime = 0;
    }
});

function gameLoop() {
    handleInput();
    applyPhysics();
    updateAnimState();

    player.style.left = x + "px";
    player.style.bottom = (groundHeight + y + OFFSET_SOL) + "px";

    requestAnimationFrame(gameLoop);
}

function handleInput() {
    const now = Date.now();

    // --- ACTIONS SPECIALES ---
    
    // Touche A pour BOIRE
    if (keys.KeyA) { 
        state = 'drinking'; 
        return; // On empêche de bouger pendant qu'on boit
    }
    
    // Touche Z pour RAMASSER (Picking Up)
    // ATTENTION: Il faut maintenir Z pour voir l'animation
    if (keys.KeyZ) { 
        state = 'picking_up'; 
        return; // On empêche de bouger pendant qu'on ramasse
    }

    // J'ai retiré le "cross_punch" (Touche X) comme demandé

    // --- ACCROUPISSEMENT ---
    if (keys.ArrowDown && isGrounded) {
        if (crouchStartTime === 0) {
            crouchStartTime = now;
            state = 'crouching'; 
        } else if (now - crouchStartTime > CROUCH_ANIM_TIME) {
            state = 'crouching_fixe'; 
        } else {
            state = 'crouching'; 
        }

        if(keys.ArrowRight) direction = 'east';
        if(keys.ArrowLeft) direction = 'west';
        return; 
    } else {
        crouchStartTime = 0;
    }

    // --- MOUVEMENT ---
    if (keys.ArrowRight) {
        x += speed;
        direction = 'east';
        state = 'running';
    } else if (keys.ArrowLeft) {
        x -= speed;
        direction = 'west';
        state = 'running';
    } else {
        state = 'idle';
    }

    // --- SAUT ---
    if (keys.Space && isGrounded) {
        if (now > landTime + JUMP_COOLDOWN) {
            vy = jumpForce;
            isGrounded = false;
        }
    }
}

function applyPhysics() {
    y += vy;
    if (!isGrounded) {
        vy -= gravity;
        // Si on est en l'air, on ne peut pas boire ou ramasser
        if(!['drinking', 'picking_up'].includes(state)) {
            state = (keys.ArrowRight || keys.ArrowLeft) ? 'running_jump' : 'jumping';
        }
    }
    if (y <= 0) {
        if (!isGrounded) {
            isGrounded = true;
            landTime = Date.now(); 
        }
        y = 0;
        vy = 0;
    }
}

let lastPath = "";

function updateAnimState() {
    let name = "";
    
    // Gestion spéciale pour l'image fixe accroupie
    if (state === 'crouching_fixe') {
        name = `crouching_${direction}_ray_fixe.png`;
    } 
    // Gestion spéciale pour le GIF accroupi
    else if (state === 'crouching') {
        name = `crouching_${direction}_ray.gif`;
    } 
    // Gestion pour TOUT LE RESTE (idle, running, drinking, picking_up)
    else {
        // C'est ici que le nom se construit automatiquement
        // Exemple: "picking_up" + "_" + "east" + "_ray.gif"
        name = `${state}_${direction}_ray.gif`;
    }

    let path = `assets/ray/${name}`;

    if (path !== lastPath) {
        player.src = path;
        lastPath = path;
        
        // Force le rechargement du GIF pour les animations 'one-shot'
        if (state === 'crouching' || state === 'picking_up' || state === 'drinking') {
             player.src = path; 
        }
    }
}

// Debug : Affiche une erreur dans la console (F12) si l'image n'existe pas
player.onerror = function() {
    console.error("Image introuvable : " + this.src);
    console.log("Vérifie que le fichier existe bien dans le dossier assets/ray/");
};

requestAnimationFrame(gameLoop);