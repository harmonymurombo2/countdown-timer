import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerControls({
  isRunning,
  isPaused,
  isFinished,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      {!isRunning && !isPaused && (
        <TouchableOpacity
          style={[styles.button, styles.startButton, isFinished && styles.disabledButton]}
          onPress={onStart}
          disabled={isFinished}
        >
          <Text style={styles.buttonText}>▶ Start</Text>
        </TouchableOpacity>
      )}

      {isRunning && (
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={onPause}
        >
          <Text style={styles.buttonText}>⏸ Pause</Text>
        </TouchableOpacity>
      )}

      {isPaused && (
        <TouchableOpacity
          style={[styles.button, styles.resumeButton]}
          onPress={onStart}
        >
          <Text style={styles.buttonText}>▶ Resume</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={onReset}
      >
        <Text style={styles.buttonText}>⟳ Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  pauseButton: {
    backgroundColor: '#f39c12',
  },
  resumeButton: {
    backgroundColor: '#2ecc71',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});