// popup-script.js

// Import three.js from CDN dynamically (optional, or include via script tag)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

class Popup {
  constructor(overlayId, containerId, closeBtnId, actionBtnId) {
    this.overlay = document.getElementById(overlayId);
    this.container = document.getElementById(containerId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.actionBtn = document.getElementById(actionBtnId);

    // Bind event listeners
    this.closeBtn.addEventListener('click', () => this.hide());
    this.overlay.addEventListener('click', (e) => {
      if(e.target === this.overlay) this.hide();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });

    // Initialize Three.js scene inside pop-up
    this.initThreeJS();

    // For accessibility: trap focus within pop-up when visible
    this.focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.focusTrapHandler = this.trapFocus.bind(this);
  }

  initThreeJS() {
    this.canvasContainer = this.container.querySelector('.popup-3d-wrapper');
    if (!this.canvasContainer) return;

    // Scene Setup
    this.scene = new THREE.Scene();

    // Camera Setup
    const width = this.canvasContainer.clientWidth;
    const height = this.canvasContainer.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0); // transparent background

    this.canvasContainer.appendChild(this.renderer.domElement);

    // Create a Neumorphic-ish 3D cube with soft edges (approximation)
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    // Soft material inspired by neumorphism colors
    const material = new THREE.MeshStandardMaterial({
      color: 0x5a9efc,
      roughness: 0.7,
      metalness: 0.1,
      emissive: 0x4682f4,
      emissiveIntensity: 0.2,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Lighting: soft directional and ambient
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(3, 5, 2);

    this.scene.add(this.ambientLight, this.directionalLight);

    this.animate();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    // Rotate cube gently on x and y for subtle 3D effect
    this.cube.rotation.x += 0.002;
    this.cube.rotation.y += 0.004;

    this.renderer.render(this.scene, this.camera);
  }

  show() {
    this.overlay.classList.add('visible');
    this.container.classList.add('visible');
    this.previousActiveElement = document.activeElement;
    this.setFocusTrap();
  }

  hide() {
    this.overlay.classList.remove('visible');
    this.container.classList.remove('visible');
    this.releaseFocusTrap();
    if(this.previousActiveElement) this.previousActiveElement.focus();
  }

  isVisible() {
    return this.container.classList.contains('visible');
  }

  setFocusTrap() {
    const focusableElements = this.container.querySelectorAll(this.focusableElementsString);
    if (focusableElements.length > 0) {
      this.firstFocusable = focusableElements[0];
      this.lastFocusable = focusableElements[focusableElements.length - 1];
      this.firstFocusable.focus();
      document.addEventListener('keydown', this.focusTrapHandler);
    }
  }

  releaseFocusTrap() {
    document.removeEventListener('keydown', this.focusTrapHandler);
  }

  trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else { // Tab
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }
  }
}

// Initialize after DOM content loaded
window.addEventListener('DOMContentLoaded', () => {
  window.popup = new Popup('popup-overlay', 'popup-container', 'popup-close-btn', 'popup-action-btn');

  // Example: Show popup after 1.5 second delay
  setTimeout(() => {
    window.popup.show();
  }, 1500);
});
