/* 
Code from YouTube Video Tutorial: React Native Expo Push Notifications Tutorial (2025) - iOS & Android Setup | amplifyabhi 
By: amplifyabhi coding
https://www.youtube.com/watch?v=p4KP-hXuDyI&t=443s

Code from Youtube Video Tutorial: Modal React Native / Expo
By: Simply Native
https://www.youtube.com/watch?v=4iz_GZLtZ_o
*/

import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

  export default function App() {
    const [openModal, setOpenModal] = useState(false);

    useEffect(() =>  {
      (async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissions is not granted for notifications!");
        }
      })();
    },[]);

  const triggerNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissions is not granted for notifications!");
    
    return;
    }
  
    await Notifications.scheduleNotificationAsync({
    content: {
      title: "SynchUp",
      body: "Hello! This is a test notification!",
      },
      trigger: null,
    });  
  };

  return (
    <View style={styles.container}>
      <Modal visible={openModal} transparent={true} animationType="slide">
        <View style={styles.content}>
          <View style={styles.card}>
            <Text>Notifcation Test</Text>
            <TouchableOpacity style={styles.button} onPress={triggerNotification}>
              <Text style={styles.text}>Trigger Notification</Text>
            </TouchableOpacity>
              
            <TouchableOpacity style={styles.button} onPress={() => setOpenModal(false)}>
              <Text style={styles.text}>Close Modal</Text>
            </TouchableOpacity>
              
          </View>
        </View>
      </Modal>
      
      <StatusBar style="auto" />
      <TouchableOpacity style={styles.button} onPress={() => setOpenModal(true)}>
        <Text style={styles.text}>Show Modal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  content: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
    button: {
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  

});
