import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarStyle: { backgroundColor: '#282c34' }, headerStyle: { backgroundColor: '#282c34' }, headerTitleStyle: { color: 'white' } }}>
      <Tabs.Screen
        name="index" // `app/(tabs)/index.tsx` を指す
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar" // `app/(tabs)/calendar.tsx` を指す
        options={{
          title: 'カレンダー',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="coach" //`app/(tabs)/coach.tsx` を指す
        options={{
          title: 'コーチ',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="profile" // (tabs)/profile.tsx を指す
        options={{
          title: 'プロフィール',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}