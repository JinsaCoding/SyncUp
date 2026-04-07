import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type EventItem = {
  id: number;
  title: string;
  location: string;
  description: string;
  friends: string[];
  attendees: string[];
  startHour: number;
  endHour: number;
  endMinute?: number;
  type: 'meeting' | 'open';
};

export default function HomeScreen() {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 1,
      title: 'Backend',
      location: 'Room 101',
      description: 'Regular meeting for the backend team.',
      friends: ['Jay', 'Jack', 'Jen'],
      attendees: ['Chris', 'Max', 'Ben'],
      startHour: 12,
      endHour: 13,
      endMinute: 0,
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Client',
      location: 'Conference Lab',
      description: 'Client architecture review meeting.',
      friends: ['Alex', 'Sam'],
      attendees: ['Chris', 'Mia', 'Ben'],
      startHour: 14,
      endHour: 15,
      endMinute: 0,
      type: 'meeting',
    },
    {
      id: 3,
      title: 'one on one',
      location: 'Office',
      description: 'One-on-one check-in.',
      friends: ['David'],
      attendees: ['David'],
      startHour: 15,
      endHour: 16,
      endMinute: 0,
      type: 'meeting',
    },
    {
      id: 4,
      title: 'Open Slot',
      location: 'Available',
      description: 'This time slot is currently free.',
      friends: [],
      attendees: [],
      startHour: 16,
      endHour: 17,
      endMinute: 0,
      type: 'open',
    },
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState('');

  const selectedEvent =
    events.find((event) => event.id === selectedId) || null;

  const timelineStartHour = 9;
  const timelineEndHour = 20;
  const hourWidth = 90;
  const timelineWidth = (timelineEndHour - timelineStartHour + 1) * hourWidth;

  const formatHourLabel = (hour: number) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display}:00 ${suffix}`;
  };

  const formatTime = (hour: number, minute: number = 0) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display}:${minute.toString().padStart(2, '0')} ${suffix}`;
  };

  const formatRange = (
    startHour: number,
    endHour: number,
    endMinute: number = 0
  ) => {
    return `${formatTime(startHour)} - ${formatTime(endHour, endMinute)}`;
  };

  const addTwentyMinutesToEnd = (hour: number, minute: number = 0) => {
    let totalMinutes = hour * 60 + minute + 20;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return { newHour, newMinute };
  };

  const handleLate = () => {
    if (!selectedEvent) return;
    setStatus(`${selectedEvent.title} will be running 20 minutes late.`);
    setModalVisible(false);
  };

  const handleExtend = () => {
    if (!selectedEvent) return;

    if (selectedEvent.type === 'open') {
      setStatus('Open Slot cannot be extended.');
      setModalVisible(false);
      return;
    }

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id !== selectedEvent.id) return event;

        const { newHour, newMinute } = addTwentyMinutesToEnd(
          event.endHour,
          event.endMinute || 0
        );

        return {
          ...event,
          endHour: newHour,
          endMinute: newMinute,
        };
      })
    );

    setStatus(`${selectedEvent.title} was extended by 20 minutes.`);
    setModalVisible(false);
  };

  const handleCancel = () => {
    if (!selectedEvent) return;

    if (selectedEvent.type === 'open') {
      setStatus('This slot is already open.');
      setModalVisible(false);
      return;
    }

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: 'Open Slot',
              location: 'Available',
              description: 'This time slot is currently free.',
              friends: [],
              attendees: [],
              type: 'open',
            }
          : event
      )
    );

    setSelectedId(selectedEvent.id);
    setStatus(`${selectedEvent.title} was cancelled. This slot is now open.`);
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.phoneFrame}>
          <View style={styles.tabs}>
            {['Today', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
              <View key={day} style={styles.tab}>
                <Text style={styles.text}>{day}</Text>
              </View>
            ))}
            <View style={styles.settingsTab}>
              <Text style={styles.text}>⚙</Text>
            </View>
          </View>

          <View style={styles.topTimelineWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator
              contentContainerStyle={styles.timelineScrollContent}
            >
              <View style={[styles.timelineOuter, { width: timelineWidth }]}>
                <View style={styles.hourRow}>
                  {Array.from(
                    { length: timelineEndHour - timelineStartHour + 1 },
                    (_, i) => timelineStartHour + i
                  ).map((hour) => (
                    <View key={hour} style={[styles.hourCell, { width: hourWidth }]}>
                      <Text style={styles.hourLabel}>{formatHourLabel(hour)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tickLine}>
                  {Array.from(
                    { length: timelineEndHour - timelineStartHour + 1 },
                    (_, i) => timelineStartHour + i
                  ).map((hour) => (
                    <View key={hour} style={[styles.tickGroup, { width: hourWidth }]}>
                      <View style={styles.tick} />
                    </View>
                  ))}
                </View>

                <View style={styles.eventLayer}>
                  {events.map((event) => {
                    const left =
                      (event.startHour - timelineStartHour) * hourWidth + 6;

                    const endValue =
                      (event.endHour + (event.endMinute || 0) / 60) - event.startHour;

                    const width = endValue * hourWidth - 12;

                    return (
                      <Pressable
                        key={event.id}
                        style={[
                          styles.timelineEvent,
                          { left, width: Math.max(width, 60) },
                          selectedId === event.id && styles.selectedTimelineEvent,
                        ]}
                        onPress={() => setSelectedId(event.id)}
                      >
                        <Text style={styles.text}>{event.title}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.controlWrapper}>
            <View style={styles.control}>
              <Pressable style={styles.controlBtn}>
                <Text style={styles.text}>+</Text>
              </Pressable>

              <Pressable style={styles.controlBtn}>
                <Text style={styles.text}>≡</Text>
              </Pressable>

              <Pressable
                style={styles.controlBtn}
                onPress={() => selectedEvent && setModalVisible(true)}
              >
                <Text style={styles.text}>💬</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.main}>
            {!selectedEvent ? (
              <Text style={styles.bigText}>Select Meeting</Text>
            ) : (
              <>
                <Text style={styles.title}>{selectedEvent.title}</Text>

                <Text style={styles.smallLabel}>Location</Text>
                <Text style={styles.textLine}>{selectedEvent.location}</Text>

                <Text style={styles.smallLabel}>Time</Text>
                <Text style={styles.textLine}>
                  {formatRange(
                    selectedEvent.startHour,
                    selectedEvent.endHour,
                    selectedEvent.endMinute || 0
                  )}
                </Text>

                <Text style={styles.smallLabel}>Description:</Text>
                <Text style={styles.textLine}>{selectedEvent.description}</Text>

                <Text style={styles.smallLabel}>Friends attending:</Text>
                <View style={styles.attendeeRow}>
                  {selectedEvent.friends.length > 0 ? (
                    selectedEvent.friends.map((person) => (
                      <View key={person} style={styles.attendeeBox}>
                        <Text style={styles.text}>{person}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.text}>None</Text>
                  )}
                </View>

                <Text style={styles.smallLabel}>All attendees:</Text>
                <View style={styles.attendeeRow}>
                  {selectedEvent.attendees.length > 0 ? (
                    selectedEvent.attendees.map((person) => (
                      <View key={person} style={styles.attendeeBox}>
                        <Text style={styles.text}>{person}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.text}>None</Text>
                  )}
                </View>

                {selectedEvent.type === 'meeting' && (
                  <Pressable style={styles.joinBtn}>
                    <Text style={styles.text}>Join</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>

          {status !== '' && (
            <View style={styles.statusBox}>
              <Text style={styles.text}>{status}</Text>
            </View>
          )}

          <View style={styles.bottom}>
            <View style={styles.bottomBtn}>
              <Text style={styles.text}>📅</Text>
            </View>
            <View style={styles.bottomBtn}>
              <Text style={styles.text}>👥</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Pressable style={styles.modalBtn} onPress={handleLate}>
              <Text style={styles.text}>Late</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={handleExtend}>
              <Text style={styles.text}>Extend</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={handleCancel}>
              <Text style={styles.text}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.text}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 20,
    alignItems: 'center',
  },

  phoneFrame: {
    width: 330,
    minHeight: 720,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#2f2f2f',
    padding: 10,
  },

  text: {
    color: 'white',
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tab: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },

  settingsTab: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },

  topTimelineWrapper: {
    marginTop: 10,
    marginBottom: 14,
  },

  timelineScrollContent: {
    paddingRight: 30,
  },

  timelineOuter: {
    height: 110,
    position: 'relative',
  },

  hourRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  hourCell: {
    alignItems: 'center',
  },

  hourLabel: {
    color: 'white',
    fontSize: 10,
  },

  tickLine: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'white',
    height: 14,
  },

  tickGroup: {
    alignItems: 'flex-start',
  },

  tick: {
    width: 1,
    height: 10,
    backgroundColor: 'white',
  },

  eventLayer: {
    position: 'relative',
    height: 46,
    marginTop: 10,
  },

  timelineEvent: {
    position: 'absolute',
    top: 0,
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'center',
  },

  selectedTimelineEvent: {
    backgroundColor: '#4a4a4a',
  },

  controlWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },

  control: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },

  controlBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRightWidth: 1,
    borderRightColor: 'white',
  },

  main: {
    minHeight: 380,
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingTop: 18,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },

  bigText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },

  title: {
    color: 'white',
    fontSize: 26,
    marginBottom: 8,
  },

  smallLabel: {
    color: '#d8d8d8',
    marginTop: 10,
    marginBottom: 3,
    fontSize: 12,
  },

  textLine: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
  },

  attendeeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },

  attendeeBox: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  joinBtn: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 16,
  },

  statusBox: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    marginTop: 12,
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  bottomBtn: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: 220,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#2b2b2b',
    padding: 18,
  },

  modalBtn: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  closeBtn: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
});