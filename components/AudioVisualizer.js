import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Rect, G } from 'react-native-svg';
import { useSelector } from 'react-redux';

const AudioVisualizer = ({ isPlaying }) => {
  const { visualizationData } = useSelector(state => state.audio);
  const [rotation, setRotation] = useState(0);
  const [colors, setColors] = useState(['#4cc9f0', '#f8961e', '#90be6d', '#577590']);
  const animatedScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;
  const pulseAnimations = useRef([]).current;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);

      let avg = 0;
      if (visualizationData && visualizationData.length > 0) {
        avg = visualizationData.reduce((a, b) => a + b, 0) / visualizationData.length;
      }

      // Update colors based on average amplitude
      if (avg > 60) {
        setColors(['#ff006e', '#ffbe0b', '#fb5607', '#8338ec']);
      } else if (avg > 30) {
        setColors(['#f9c74f', '#f8961e', '#90be6d', '#43aa8b']);
      } else {
        setColors(['#4cc9f0', '#4895ef', '#4361ee', '#3a0ca3']);
      }

      // Animate each circle with different sensitivity to the beat
      animatedScales.forEach((scale, index) => {
        const sensitivity = [1.2, 1.4, 1.6, 1.8][index];
        const pulse = 1 + (avg || 0) / (50 / sensitivity);
        
        Animated.spring(scale, {
          toValue: pulse,
          useNativeDriver: true,
          speed: 20 + (index * 5),
          bounciness: 10 + (index * 2),
        }).start();
      });

      // Create sudden pulse effect for high beats
      if (avg > 70) {
        animatedScales.forEach((scale, index) => {
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.5 + (index * 0.2),
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1 + (avg || 0) / (50 / (1.2 + (index * 0.2))),
              useNativeDriver: true,
              speed: 20,
              bounciness: 10,
            })
          ]).start();
        });
      }

    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, visualizationData]);

  const bars = (visualizationData || []).slice(0, 20);

  return (
    <View style={styles.container}>
      <View style={styles.circlesContainer}>
        {animatedScales.map((scale, index) => (
          <Animated.View 
            key={index}
            style={[
              styles.circleWrapper,
              { 
                transform: [{ scale }],
                zIndex: -index,
                opacity: 1 - (index * 0.2)
              }
            ]}
          >
            <Svg height="200" width="200" viewBox="0 0 100 100">
              <G transform={`rotate(${rotation * (index % 2 === 0 ? 1 : -1)}, 50, 50)`}>
                <Circle
                  cx="50"
                  cy="50"
                  r={40 - (index * 8)}
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth={4 - (index * 0.5)}
                  strokeDasharray={`${5 + index}, ${5 - index}`}
                />
                {index % 2 === 0 && (
                  <Circle
                    cx="50"
                    cy="50"
                    r={30 - (index * 6)}
                    fill="none"
                    stroke={colors[(index + 2) % colors.length]}
                    strokeWidth={3 - (index * 0.3)}
                    strokeDasharray={`${3 + index}, ${3 - index}`}
                  />
                )}
              </G>
            </Svg>
          </Animated.View>
        ))}
      </View>
      
      <Svg height="40" width="100%" style={styles.barContainer}>
        {bars.map((val, i) => (
          <Rect
            key={i}
            x={i * 5}
            y={40 - (val || 0) / 3}
            width={4}
            height={(val || 0) / 3}
            fill={colors[i % colors.length]}
            rx={2}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  circlesContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
    marginBottom: 20,
  },
  circleWrapper: {
    position: 'absolute',
  },
  barContainer: {
    marginTop: 20,
  },
});

export default AudioVisualizer;