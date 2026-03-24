import React, { useRef, useEffect } from 'react';

const LightRays = ({
  raysOrigin = 'top-center',
  raysColor = '#ffffff',
  raysSpeed = 1,
  lightSpread = 0.5,
  rayLength = 3,
  followMouse = true,
  mouseInfluence = 0.1,
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    let mouseX = canvas.width / 2;
    let mouseY = 0; // Top center default

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      if (!followMouse) {
        mouseX = canvas.width / 2;
        mouseY = raysOrigin.includes('top') ? 0 : raysOrigin.includes('bottom') ? canvas.height : canvas.height / 2;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      if (!followMouse) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const drawRays = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += raysSpeed * 0.01;

      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const startX = canvas.width / 2 + (mouseX - canvas.width / 2) * mouseInfluence;
        const startY = raysOrigin.includes('top') ? 0 : raysOrigin.includes('bottom') ? canvas.height : canvas.height / 2 + (mouseY - canvas.height / 2) * mouseInfluence;
        
        ctx.moveTo(startX, startY);
        
        // Calculate dynamic end point based on time and noise
        const angle = (i / 20) * Math.PI * lightSpread + (Math.PI / 2) * (1 - lightSpread) + Math.sin(time + i) * 0.1;
        const length = canvas.height * rayLength + Math.cos(time * 2 + i) * 100;
        
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        ctx.lineTo(endX, endY);
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, raysColor);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        
        // Need a polygon for a ray, not just a line
        const thickness = 20 * (1 + Math.sin(time + i * 2));
        ctx.lineTo(endX + thickness, endY);
        ctx.lineTo(startX + thickness/5, startY);
        
        ctx.fill();
        ctx.closePath();
      }

      animationFrameId = requestAnimationFrame(drawRays);
    };

    drawRays();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, followMouse, mouseInfluence]);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={{ opacity: 0.6, mixBlendMode: 'multiply' }} />;
};

export default LightRays;
