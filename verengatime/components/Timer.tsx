import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Vibration,
  Dimensions,
} from 'react-native';
import TimerControls from './TimerControls';

const { width } = Dimensions.get('window');

export default function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('5');
  const [progress, setProgress] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const totalSeconds = minutes * 60 + seconds;
  const isFinished = totalSeconds === 0;
  const initialTotalSeconds = minutes * 60;

  // Calculate progress
  useEffect(() => {
    if (initialTotalSeconds > 0) {
      const currentProgress = totalSeconds / initialTotalSeconds;
      setProgress(currentProgress);
      Animated.timing(progressAnim, {
        toValue: currentProgress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [totalSeconds, initialTotalSeconds]);

  // Pulse animation when running
  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  // Rotation animation for timer icon
  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isRunning]);

  const startTimer = () => {
    if (totalSeconds === 0) {
      Alert.alert('⏰ Timer Finished', 'Please reset the timer to start again.', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    // Haptic feedback
    Vibration.vibrate(50);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    Vibration.vibrate(30);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const mins = parseInt(inputMinutes) || 0;
    setMinutes(Math.max(0, mins));
    setSeconds(0);
    setProgress(1);
    progressAnim.setValue(1);
    Vibration.vibrate(20);
  };

  const setCustomTime = () => {
    const mins = parseInt(inputMinutes) || 0;
    if (mins < 0) {
      Alert.alert('Invalid Time', 'Please enter a positive number.');
      return;
    }
    if (mins > 60) {
      Alert.alert('Time Limit', 'Maximum time is 60 minutes.');
      return;
    }
    if (isRunning || isPaused) {
      Alert.alert('Timer Running', 'Please reset the timer before changing time.');
      return;
    }
    setMinutes(Math.max(0, mins));
    setSeconds(0);
    setProgress(1);
    progressAnim.setValue(1);
    // Scale animation on set
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else if (minutes > 0) {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Vibrate when timer finishes
          Vibration.vibrate([500, 300, 500]);
          Alert.alert(
            '🎉 Time\'s Up!', 
            'Your countdown has finished. Great job!',
            [{ text: 'Awesome!', style: 'default' }]
          );
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, minutes, seconds]);

  const formatTime = () => {
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');
    return `${displayMinutes}:${displaySeconds}`;
  };

  // Get color based on time remaining
  const getTimerColor = () => {
    if (isFinished) return '#e74c3c';
    if (progress > 0.5) return '#2ecc71';
    if (progress > 0.25) return '#f39c12';
    return '#e74c3c';
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header with animated icon */}
      <View style={styles.header}>
        <Animated.Text 
          style={[
            styles.icon, 
            { transform: [{ rotate: rotateInterpolate }] }
          ]}
        >
          ⏱️
        </Animated.Text>
        <Text style={styles.title}>Verenga Timer</Text>
      </View>

      {/* Timer Display with progress bar */}
      <View style={styles.timerWrapper}>
        <View style={styles.timerBackground}>
          {/* Progress bar */}
          <Animated.View 
            style={[
              styles.progressBar,
              {
                height: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: getTimerColor(),
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.timerDisplay,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
              {formatTime()}
            </Text>
            <Text style={styles.timeLabel}>Minutes:Seconds</Text>
          </Animated.View>
        </View>
      </View>

      {/* Quick preset buttons */}
      <View style={styles.presetContainer}>
        {[1, 5, 10, 15, 30].map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.presetButton,
              parseInt(inputMinutes) === preset && styles.presetActive
            ]}
            onPress={() => {
              if (!isRunning && !isPaused) {
                setInputMinutes(String(preset));
                setMinutes(preset);
                setSeconds(0);
                setProgress(1);
                progressAnim.setValue(1);
              }
            }}
            disabled={isRunning || isPaused}
          >
            <Text style={styles.presetText}>{preset}m</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom time input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Custom Time:</Text>
        <TextInput
          style={styles.input}
          value={inputMinutes}
          onChangeText={setInputMinutes}
          keyboardType="numeric"
          placeholder="Minutes"
          editable={!isRunning && !isPaused}
        />
        <TouchableOpacity 
          style={[styles.setButton, (isRunning || isPaused) && styles.disabledButton]}
          onPress={setCustomTime}
          disabled={isRunning || isPaused}
        >
          <Text style={styles.buttonText}>Set</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Controls */}
      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        isFinished={isFinished}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />

      {/* Status message */}
      <Text style={styles.statusText}>
        {isRunning && '⏳ Timer is running...'}
        {isPaused && '⏸️ Timer paused'}
        {!isRunning && !isPaused && totalSeconds > 0 && '⏱️ Ready to start'}
        {!isRunning && !isPaused && totalSeconds === 0 && '✅ Timer finished'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 1,
  },
  timerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  timerBackground: {
    width: width * 0.75,
    height: width * 0.75,
    maxWidth: 280,
    maxHeight: 280,
    borderRadius: width * 0.375,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2ecc71',
    opacity: 0.2,
  },
  timerDisplay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timerText: {
    fontSize: 52,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    letterSpacing: 1,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  presetActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    width: 70,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  setButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    marginTop: 15,
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
