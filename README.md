# Bhagavad Gita Matrix Rain

A React component that displays a Matrix rain effect with Bhagavad Gita shloks.

## Installation

```bash
npm install bhagavad-gita-matrix
# or
yarn add bhagavad-gita-matrix
```

## Usage

```jsx
import React from 'react';
import MatrixRain from 'bhagavad-gita-matrix';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MatrixRain 
        fontSize={16}
        speed={1.5}
        color="#00ff00"
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string or array of strings | Bhagavad Gita shloks | Custom text to display in the matrix rain |
| `fontSize` | number | 14 | Font size of the characters |
| `speed` | number | 1 | Speed of the rain (higher is faster) |
| `density` | number | 0.5 | Density of the rain (0-1) |
| `color` | string | '#0f0' | Color of the characters |
| `backgroundColor` | string | 'rgba(0, 0, 0, 0.9)' | Background color |
| `width` | string | '100%' | Width of the container |
| `height` | string | '100%' | Height of the container |
| `className` | string | '' | Additional CSS class for the container |
| `style` | object | {} | Additional inline styles for the container |

## Examples

### Custom Shloks

```jsx
const customShloks = [
  'श्रीभगवानुवाच',
  'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो',
  'लोकान्समाहर्तुमिह प्रवृत्तः।',
  'ऋतेऽपि त्वां न भविष्यन्ति सर्वे',
  'येऽवस्थिताः प्रत्यनीकेषु योधाः॥'
];

<MatrixRain 
  text={customShloks}
  fontSize={18}
  speed={1.2}
  color="#00ffaa"
/>
```

### Different Colors

```jsx
<MatrixRain 
  color="#ff9900"
  backgroundColor="rgba(0, 0, 20, 0.95)"
/>
```

## License

MIT