// MatrixRain.js
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const MatrixRain = ({
  text,
  fontSize = 14,
  speed = 1,
  density = 0.5,
  color = '#0f0',
  backgroundColor = 'rgba(0, 0, 0, 0.9)',
  width = '100%',
  height = '100%',
  className = '',
  style = {},
}) => {
  const canvasRef = useRef(null);
  const [bhagavadGitaShloks, setBhagavadGitaShloks] = useState([]);

  // Default shloks from Bhagavad Gita if none are provided
  useEffect(() => {
    const defaultShloks = [
      'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
      'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।',
      'सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
      'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते।',
      'तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्॥',
      'श्री भगवानुवाच प्रजहाति यदा कामान्सर्वान्पार्थ मनोगतान्।',
      'आत्मन्येवात्मना तुष्टः स्थितप्रज्ञस्तदोच्यते॥',
    ];

    // Use provided text if available, otherwise use default shloks
    if (text && text.length > 0) {
      setBhagavadGitaShloks(Array.isArray(text) ? text : [text]);
    } else {
      setBhagavadGitaShloks(defaultShloks);
    }
  }, [text]);

  useEffect(() => {
    if (!canvasRef.current || bhagavadGitaShloks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create drops
    const drops = [];
    const columns = Math.floor(canvas.width / fontSize);
    const charPool = [];

    // Create a pool of characters from the shloks
    bhagavadGitaShloks.forEach(shlok => {
      for (let i = 0; i < shlok.length; i++) {
        charPool.push(shlok.charAt(i));
      }
    });

    // Initialize drops
    for (let i = 0; i < columns * density; i++) {
      drops.push({
        x: Math.floor(Math.random() * columns) * fontSize,
        y: Math.floor(Math.random() * -100) * fontSize,
        speed: Math.random() * 0.5 + 0.5,
        length: Math.floor(Math.random() * 15) + 5,
        chars: []
      });
      
      // Fill each drop with random characters from the shloks
      for (let j = 0; j < drops[i].length; j++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        drops[i].chars.push(charPool[randomIndex]);
      }
    }

    // Animation loop
    const draw = () => {
      // Add semi-transparent black rectangle on top of previous frame
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      // Draw each drop
      drops.forEach((drop, i) => {
        for (let j = 0; j < drop.length; j++) {
          // Set varying opacity for the characters in the drop
          const opacity = j === 0 ? 1 : 1 - j / drop.length;
          ctx.fillStyle = color.startsWith('#') 
            ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
            : color;

          // Draw character
          ctx.fillText(drop.chars[j], drop.x, drop.y - j * fontSize);
        }

        // Move drop
        drop.y += drop.speed * speed * fontSize / 4;

        // Reset drop when it goes off screen
        if (drop.y > canvas.height + drop.length * fontSize) {
          drop.y = -drop.length * fontSize;
          drop.x = Math.floor(Math.random() * columns) * fontSize;
          
          // Refresh characters in the drop
          for (let j = 0; j < drop.length; j++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            drop.chars[j] = charPool[randomIndex];
          }
        }
      });

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [bhagavadGitaShloks, fontSize, speed, density, color, backgroundColor]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

MatrixRain.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  fontSize: PropTypes.number,
  speed: PropTypes.number,
  density: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MatrixRain;