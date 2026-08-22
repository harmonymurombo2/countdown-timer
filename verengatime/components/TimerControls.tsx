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
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>▶ Start</Text>
        </TouchableOpacity>
      )}

      {isRunning && (
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={onPause}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>⏸ Pause</Text>
        </TouchableOpacity>
      )}

      {isPaused && (
        <TouchableOpacity
          style={[styles.button, styles.resumeButton]}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>▶ Resume</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={onReset}
        activeOpacity={0.8}
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
    gap: 12,
    marginTop: 15,
    width: '100%',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButton: {
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
  },
  pauseButton: {
    backgroundColor: '#f39c12',
    shadowColor: '#f39c12',
  },
  resumeButton: {
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    shadowColor: '#95a5a6',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
