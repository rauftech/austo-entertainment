/**
 * Main Entry Point - Setup only
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

// Register plugins globally
gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

// Import global (which handles everything else)
import './js/_global.js';

console.log('✓ Main initialized');
