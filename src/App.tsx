import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import './App.css';

// Fabric texture canvas component
function FabricTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Pre-generate thread color pattern (deterministic, not random)
    const threadPattern: boolean[] = [];
    for (let i = 0; i < 1000; i++) {
      threadPattern[i] = Math.sin(i * 0.7) > 0.4; // Deterministic warm/cool pattern
    }

    let time = 0;
    let frameCount = 0;

    const drawTexture = () => {
      const { width, height } = canvas;

      // Only redraw every 3 frames for smoother performance
      if (frameCount % 3 !== 0) {
        frameCount++;
        requestAnimationFrame(drawTexture);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create subtle fabric texture - much calmer

      // Layer 1: Horizontal threads (weft) - static with very slow movement
      for (let y = 0; y < height; y += 4) {
        const isWarm = threadPattern[y % threadPattern.length];
        const color = isWarm ? 'rgba(120, 110, 100, 0.03)' : 'rgba(0, 0, 0, 0.035)';

        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;

        const offset = Math.sin(y * 0.05 + time * 0.0005) * 0.5;

        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(width, y + offset);
        ctx.stroke();
      }

      // Layer 2: Vertical threads (warp) - static with very slow movement
      for (let x = 0; x < width; x += 4) {
        const isWarm = threadPattern[(x + 333) % threadPattern.length];
        const color = isWarm ? 'rgba(120, 110, 100, 0.03)' : 'rgba(0, 0, 0, 0.035)';

        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;

        const offset = Math.sin(x * 0.05 + time * 0.0005) * 0.5;

        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, height);
        ctx.stroke();
      }

      // Layer 3: Very subtle light particles (barely visible, slow moving)
      const particleCount = 15;
      for (let i = 0; i < particleCount; i++) {
        const px = ((i * 137.5 + time * 0.2) % width);
        const py = ((i * 97.3 + time * 0.15) % height);
        const size = 0.8;
        const alpha = 0.015;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      time++;
      frameCount++;
      requestAnimationFrame(drawTexture);
    };

    drawTexture();

    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fabric-texture" />;
}


function App() {
  return (
    <div className="app">
      {/* Fabric texture background */}
      <FabricTexture />

      <div className="container">
        {/* Main content */}
        <motion.div
          className="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Wordmark */}
          <motion.div
            className="wordmark"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="title">
              <span className="title-small">THE</span>
              <span className="title-large">PRESENT</span>
            </h1>
          </motion.div>

          {/* Tagline with bars */}
          <motion.div
            className="tagline-container"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="tagline-bar" />
            <p className="tagline">By Invitation Only</p>
            <div className="tagline-bar" />
          </motion.div>

          {/* Description */}
          <motion.div
            className="description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p>We believe the best journeys are not just about where you go, but how fully you experience each moment. We work in service of this rare, but most rewarding expression of travel.</p>
          </motion.div>

          {/* Offices */}
          <motion.div
            className="offices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="offices-list">
              San Francisco · Las Vegas · Los Angeles
            </p>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="copyright"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p>© 2025 Mr. Hotel Ltd. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
