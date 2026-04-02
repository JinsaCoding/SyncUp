// Import React hook for managing state
import { useState } from 'react';

// Import React Native components
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Main screen component
export default function HomeScreen() {
  // State to control popup visibility
  const [modalVisible, setModalVisible] = useState(false);

  // State to store message shown in popup
  const [modalMessage, setModalMessage] = useState('');

  // Function to display popup with a message
  const showMessage = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <>
      {/* ScrollView allows screen to scroll on mobile */}
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* App title */}
        <Text style={styles.header}>SyncUp</Text>

        {/* Subtitle */}
        <Text style={styles.subheader}>Thursday Schedule</Text>

        {/* Timeline section showing events */}
        <View style={styles.timeline}>
          
          {/* Event 1 */}
          <Text style={styles.time}>12:00 PM</Text>
          <View style={[styles.eventCard, styles.blueCard]}>
            <Text style={styles.eventTitle}>Backend Planning</Text>
            <Text style={styles.eventText}>12:00 - 1:00</Text>
          </View>

          {/* Event 2 */}
          <Text style={styles.time}>2:00 PM</Text>
          <View style={[styles.eventCard, styles.blueCard]}>
            <Text style={styles.eventTitle}>Client Review</Text>
            <Text style={styles.eventText}>2:00 - 3:00</Text>
          </View>

          {/* Event 3 */}
          <Text style={styles.time}>3:00 PM</Text>
          <View style={[styles.eventCard, styles.grayCard]}>
            <Text style={styles.eventTitle}>1:1 with David</Text>
            <Text style={styles.eventText}>3:00 - 3:30</Text>
          </View>
        </View>

        {/* Selected event box (simulates user selecting an event) */}
        <View style={styles.selectedBox}>
          <Text style={styles.selectedTitle}>Selected Event</Text>
          <Text style={styles.selectedEvent}>Backend Planning</Text>
          <Text style={styles.selectedEventDetails}>
            12:00 PM - 1:00 PM
          </Text>
        </View>

        {/* Action buttons (main GR4 features) */}
        <View style={styles.actionRow}>

          {/* FEATURE 1: Cancel & Notify */}
          {/* Simulates canceling an event and notifying attendees */}
          <Pressable
            style={[styles.actionButton, styles.redButton]}
            onPress={() =>
              showMessage('Meeting cancelled. Attendees notified.')
            }
          >
            <Text style={styles.buttonText}>Cancel & Notify</Text>
          </Pressable>

          {/* FEATURE 2: Running Late */}
          {/* Simulates notifying next meeting of delay */}
          <Pressable
            style={[styles.actionButton, styles.orangeButton]}
            onPress={() =>
              showMessage(
                'Running late by 20 minutes. Next meeting notified.'
              )
            }
          >
            <Text style={styles.buttonText}>Running Late</Text>
          </Pressable>

          {/* EXTRA FEATURE: Open Slot */}
          {/* Simulates creating a new open time slot for events */}
          <Pressable
            style={[styles.actionButton, styles.greenButton]}
            onPress={() =>
              showMessage(
                'Open lunch slot created and friends invited.'
              )
            }
          >
            <Text style={styles.buttonText}>Open Slot</Text>
          </Pressable>

        </View>
      </ScrollView>

      {/* Modal popup (used instead of alerts for better UX) */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            
            {/* Message displayed to user */}
            <Text style={styles.modalText}>{modalMessage}</Text>

            {/* Close button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    </>
  );
}

// Styles for the UI
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f7fb',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1d3557',
  },
  subheader: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
    color: '#457b9d',
  },
  timeline: {
    marginBottom: 20,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  eventCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  blueCard: {
    backgroundColor: '#8ecae6',
  },
  grayCard: {
    backgroundColor: '#d9d9d9',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  eventText: {
    fontSize: 14,
    marginTop: 4,
    color: '#1f2937',
  },
  selectedBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dbe4ee',
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#555',
  },
  selectedEvent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  selectedEventDetails: {
    fontSize: 14,
    marginTop: 4,
    color: '#4b5563',
  },
  actionRow: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#e63946',
  },
  orangeButton: {
    backgroundColor: '#f4a261',
  },
  greenButton: {
    backgroundColor: '#2a9d8f',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', // dim background for focus
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  closeButton: {
    backgroundColor: '#1d3557',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
  },
});