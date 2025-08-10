import { Stack } from 'expo-router';

export default function DiaryLayout() {
  return <Stack screenOptions={{ presentation: 'modal', headerShown: false }} />;
}