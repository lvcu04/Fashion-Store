import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated === undefined) return null;
//   if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="myOrder"
        options={{
          title: 'My Order',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: 'Favourite',
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#000"
              style={{ marginRight: 15 }}
            />
          ),
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
