import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Verenga Time',
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }} 
        />
      </Stack>
    </>
  );
}