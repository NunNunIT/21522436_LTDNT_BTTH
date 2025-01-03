import { Redirect, router, Tabs } from "expo-router";
import React from "react";
import { Image, Platform, View } from "react-native";

// import TabBarBackground from "@/components/ui/TabBarBackground";
import {
  User,
  Home,
  MessageCircle,
  Heart,
  Bell,
  Settings,
  Settings2,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarShowLabel: false,
        // tabBarButton: HapticTab,
        tabBarActiveTintColor: "#fe183c",
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
        headerLeft: () => (
          <Image
            source={require("~/assets/images/logo.png")}
            resizeMode="cover"
            className="relative w-60 h-14 ml-2"
          />
        ),
        headerTitle: "",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home color={color} />,
          headerRight: () => (
            <View className="flex flex-row gap-3 mr-2">
              <Button
                size="icon"
                variant="ghost"
                onPress={() => router.push("/noti")}
              >
                <Bell className="size-6 text-black dark:text-white" />
              </Button>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User color={color} />,
          headerRight: () => (
            <View className="flex flex-row gap-3 mr-2">
              <Button
                size="icon"
                variant="ghost"
                onPress={() => router.push("/noti")}
              >
                <Bell className="size-6 text-black dark:text-white" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onPress={() => router.push("/settings")}
              >
                <Settings className="size-6 text-black dark:text-white" />
              </Button>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}