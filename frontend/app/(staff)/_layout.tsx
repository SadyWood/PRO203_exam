import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function StaffTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBackground,
          borderTopWidth: 0,
          height: 70,
        },
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIcon,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="employee-home"
        options={{
          title: "Hjem",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="employee-posts"
        options={{
          title: "Blogg",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="employee-calendar"
        options={{
          title: "Kalender",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="employee-profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="employee-checkin"
        options={{
          href: null, 
        }}
      />
      <Tabs.Screen
        name="employee-messages"
        options={{  
            href: null,         
          }}
        />

      <Tabs.Screen
        name="employee-messages/[id]"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}
