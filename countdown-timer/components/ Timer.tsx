import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import TimerControls from './TimerControls';

export default function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('5');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Total time in seconds
  const totalSeconds = minutes * 60 + seconds;
  const isFinished = totalSeconds === 0;

  // Start timer
  const startTimer = () => {
    if (totalSeconds === 0) {
      Alert.alert('Timer Finished', 'Please reset the timer to start again.');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsPaused(true);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset timer
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
  };

  // Set custom time
  const setCustomTime = () => {
    const mins = parseInt(inputMinutes) || 0;
    if (mins < 0) {
      Alert.alert('Invalid Time', 'Please enter a positive number.');
      return;
    }
    if (isRunning || isPaused) {
      Alert.alert('Timer Running', 'Please reset the timer before changing time.');
      return;
    }
    setMinutes(Math.max(0, mins));
    setSeconds(0);
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else if (minutes > 0) {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          Alert.alert('Time\'s Up!', 'Your countdown has finished.');
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

  // Format time display
  const formatTime = () => {
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');
    return `${displayMinutes}:${displaySeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Countdown Timer</Text>
      
      <View style={styles.timerDisplay}>
        <Text style={[styles.timerText, isFinished && styles.timerFinished]}>
          {formatTime()}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Set Minutes:</Text>
        <TextInput
          style={styles.input}
          value={inputMinutes}
          onChangeText={setInputMinutes}
          keyboardType="numeric"
          placeholder="Enter minutes"
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

      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        isFinished={isFinished}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  timerDisplay: {
    marginVertical: 20,
    padding: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontVariant: ['tabular-nums'],
  },
  timerFinished: {
    color: '#e74c3c',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    gap: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: 80,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  setButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});