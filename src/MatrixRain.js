// MatrixRain.js
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const MatrixRain = ({
  text,
  minFontSize = 15,
  maxFontSize = 20,
  speed = 1.75,
  density = 0.5,
  color = '#DFC57B', // Saffron/gold color
  backgroundColor = 'rgba(0, 0, 0, 0.9)',
  width = '100%',
  height = '100%',
  className = '',
  style = {},
}) => {
  const canvasRef = useRef(null);
  const [bhagavadGitaShloks, setBhagavadGitaShloks] = useState([]);

  // Function to split Devanagari strings into individual characters
  const splitDevanagari = (text) => {
    // This regex splits on each Unicode character, keeping combined characters together
    return Array.from(text);
  };

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
    const charPool = [];

    // Create a pool of characters from the shloks
    bhagavadGitaShloks.forEach(shlok => {
      // Split the shlok into individual characters
      const chars = splitDevanagari(shlok);
      for (let i = 0; i < chars.length; i++) {
        if (chars[i].trim() !== '') {
          charPool.push(chars[i]);
        }
      }
    });

    // Calculate the number of columns based on the average font size
    const avgFontSize = (minFontSize + maxFontSize) / 2;
    const columns = Math.floor(canvas.width / avgFontSize);

    // Initialize drops
    for (let i = 0; i < columns * density; i++) {
      // Assign a random font size to each drop
      const fontSize = Math.floor(Math.random() * (maxFontSize - minFontSize)) + minFontSize;
      
      drops.push({
        x: Math.floor(Math.random() * columns) * avgFontSize,
        y: Math.floor(Math.random() * -100) * fontSize,
        speed: Math.random() * 0.5 + 0.75,
        length: Math.floor(Math.random() * 15) + 5,
        chars: [],
        fontSize: fontSize // Store the font size for this drop
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

      // Draw each drop
      drops.forEach((drop, i) => {
        for (let j = 0; j < drop.length; j++) {
          // Set font size for this drop
          ctx.font = `${drop.fontSize}px 'Noto Sans Devanagari', Arial, sans-serif`;
          
          // Set varying opacity for the characters in the drop
          const opacity = j === 0 ? 1 : 1 - j / drop.length;
          
          // Parse the color to create rgba version with proper opacity
          let r = 223, g = 197, b = 123; // Default values for #DFC57B
          if (color.startsWith('#')) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
          }
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

          // Draw character
          ctx.fillText(drop.chars[j], drop.x, drop.y - j * drop.fontSize);
        }

        // Move drop
        drop.y += drop.speed * speed * drop.fontSize / 4;

        // Reset drop when it goes off screen
        if (drop.y > canvas.height + drop.length * drop.fontSize) {
          drop.y = -drop.length * drop.fontSize;
          drop.x = Math.floor(Math.random() * columns) * avgFontSize;
          drop.fontSize = Math.floor(Math.random() * (maxFontSize - minFontSize)) + minFontSize;
          
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
  }, [bhagavadGitaShloks, minFontSize, maxFontSize, speed, density, color, backgroundColor]);

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
  minFontSize: PropTypes.number,
  maxFontSize: PropTypes.number,
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