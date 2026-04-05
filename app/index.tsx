import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { GlobalStyles as styles } from "./styles";
import {useState} from 'react';
import { Stack } from "expo-router";
export default function Index() {
  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} /> {/*Hides Expo Default Header*/}
      <HomeScreen />
    </SafeAreaProvider>
  );
}

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const days   = ["Today", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [activeTab, setActiveTab] = useState("events")

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/*The Header Section (TOP) */}
      <View style={styles.header}>
        <View style={styles.scrollContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {days.map((day) => (
              <TouchableOpacity key={day} style={styles.tab}>
                <Text style={styles.tabText}>{day}</Text>
              </TouchableOpacity>))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => alert('Settings Pressed!')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      {/*The Timeline Section (Middle) */}
      <View style={styles.calendarPlaceholder}>
        <Text style={styles.placeholderText}>Timeline Section Here</Text>
      </View>

      {/*The Content Area (Bottom) */}
      <View style={styles.body}>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity 
            style={[styles.middleTab, activeTab === "events" && styles.middleTabActive]}
            onPress={() => setActiveTab("events")}>
            <Text style={styles.middleTabText}>📄</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.middleTab, activeTab === "chat" && styles.middleTabActive]}
            onPress={() => setActiveTab("chat")}>
            <Text style={styles.middleTabText}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
