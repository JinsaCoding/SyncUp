import * as Calendar from "expo-calendar";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GlobalThemes } from "./styles";

// Controls how notifications behave when they appear on the device.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// This is the event shape used by the custom timeline UI.
// It converts raw calendar events into a simpler structure for display.
type TimelineEvent = {
  id: string;
  title: string;
  location: string;
  description: string;
  friends: string[];
  attendees: string[];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  type: "meeting" | "open";
  originalEvent?: Calendar.Event;
};

export default function Index() {
  return (
    <SafeAreaProvider>
      {/* Hides the default Expo Router header */}
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Stores the real calendar events pulled from the device.
  const [events, setEvents] = useState<Calendar.Event[]>([]);

  // Controls the bottom tab state.
  const [activeTab, setActiveTab] = useState("events");

  // Controls the event action modal (Late / Extend / Cancel).
  const [openEventOptions, setOpenEventOptions] = useState(false);

  // Controls the settings modal.
  const [openSettings, setOpenSettings] = useState(false);

  // Controls dark/light theme.
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Stores which timeline event is currently selected.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Status message shown near the bottom of the screen.
  const [status, setStatus] = useState("");

  // Pulls the correct colors from the theme object in styles.tsx.
  const colors = GlobalThemes[theme];

  // Weekday labels shown at the top.
  const days = ["Today", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Timeline layout settings.
  const timelineStartHour = 9;
  const timelineEndHour = 20;
  const hourWidth = 90;
  const timelineWidth = (timelineEndHour - timelineStartHour + 1) * hourWidth;

  // Requests calendar access, pulls all calendars, and loads the next 7 days of events.
  const syncCalendarEvents = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Calendar access was denied.");
      return;
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );

    if (calendars.length === 0) {
      Alert.alert("No Calendars", "No calendars found on this device.");
      return;
    }

    // Collect all calendar IDs so events are pulled from every available calendar.
    const calendarIds = calendars.map((cal) => cal.id);

    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);

    // Pulls events from now through the next 7 days.
    const fetchedEvents = await Calendar.getEventsAsync(calendarIds, now, end);
    setEvents(fetchedEvents);
  };

  // Runs once when the screen loads.
  // Requests calendar permission, loads events, and requests notification permission.
  useEffect(() => {
    (async () => {
      const { status: calStatus } =
        await Calendar.requestCalendarPermissionsAsync();

      if (calStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Calendar access is needed to show your events."
        );
        return;
      }

      await syncCalendarEvents();

      const { status: notifStatus } =
        await Notifications.requestPermissionsAsync();

      if (notifStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Notifications permission not granted!"
        );
      }
    })();
  }, []);

  // Triggers a local notification after an event is cancelled.
  const triggerNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissions is not granted for notifications!");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "SynchUp",
        body: "You have cancelled an event!",
      },
      trigger: null,
    });
  };

  // Converts the raw device calendar events into the custom timeline format.
  // useMemo keeps the app from recalculating this every render unless events change.
  const mappedEvents = useMemo<TimelineEvent[]>(() => {
    const converted = events
      .filter((event) => event.startDate && event.endDate)
      .map((event) => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        return {
          id: String(event.id),
          title: event.title || "Untitled Event",
          location: event.location || "No location",
          description: event.notes || "No description available.",
          friends: [],
          attendees: [],
          startHour: start.getHours(),
          startMinute: start.getMinutes(),
          endHour: end.getHours(),
          endMinute: end.getMinutes(),
          type: "meeting" as const,
          originalEvent: event,
        };
      })
      // Keeps only events that overlap the visible timeline range.
      .filter(
        (event) =>
          event.endHour >= timelineStartHour &&
          event.startHour <= timelineEndHour
      )
      // Sorts timeline events from earliest to latest.
      .sort((a, b) => {
        const aMinutes = a.startHour * 60 + a.startMinute;
        const bMinutes = b.startHour * 60 + b.startMinute;
        return aMinutes - bMinutes;
      });

    return converted;
  }, [events]);

  // Finds the currently selected event object from the selected ID.
  const selectedEvent =
    mappedEvents.find((event) => event.id === selectedId) || null;

  // Automatically selects the first event if nothing is selected yet.
  useEffect(() => {
    if (!selectedId && mappedEvents.length > 0) {
      setSelectedId(mappedEvents[0].id);
    }
  }, [mappedEvents, selectedId]);

  // Formats the timeline hour labels, such as 9:00 AM or 1:00 PM.
  const formatHourLabel = (hour: number) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display}:00 ${suffix}`;
  };

  // Formats a single time value with minutes.
  const formatTime = (hour: number, minute: number = 0) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display}:${minute.toString().padStart(2, "0")} ${suffix}`;
  };

  // Formats an event’s full time range.
  const formatRange = (
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ) => {
    return `${formatTime(startHour, startMinute)} - ${formatTime(
      endHour,
      endMinute
    )}`;
  };

  // Adds 20 minutes to the end time of an event.
  const addTwentyMinutesToEnd = (hour: number, minute: number = 0) => {
    const totalMinutes = hour * 60 + minute + 20;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return { newHour, newMinute };
  };

  // Handles the "Late" action.
  const handleLate = () => {
    if (!selectedEvent) return;

    setStatus(`${selectedEvent.title} will be running 20 minutes late.`);
    setOpenEventOptions(false);
  };

  // Handles the "Extend" action by adding 20 minutes to the event’s end time.
  const handleExtend = () => {
    if (!selectedEvent) return;

    const { newHour, newMinute } = addTwentyMinutesToEnd(
      selectedEvent.endHour,
      selectedEvent.endMinute
    );

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        String(event.id) === selectedEvent.id
          ? {
              ...event,
              endDate: new Date(
                new Date(event.endDate || new Date()).setHours(
                  newHour,
                  newMinute,
                  0,
                  0
                )
              ),
            }
          : event
      )
    );

    setStatus(`${selectedEvent.title} was extended by 20 minutes.`);
    setOpenEventOptions(false);
  };

  // Handles the "Cancel" action by removing the event from the local list
  // and sending a notification.
  const handleCancel = async () => {
    if (!selectedEvent) return;

    setEvents((prevEvents) =>
      prevEvents.filter((event) => String(event.id) !== selectedEvent.id)
    );

    setStatus(`${selectedEvent.title} was cancelled.`);
    setOpenEventOptions(false);
    setSelectedId(null);

    await triggerNotification();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <View
        style={[
          styles.phoneFrame,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header row:
            weekday tabs scroll horizontally so they do not run off-screen,
            and the settings icon stays visible on the right */}
        <View style={styles.headerRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {days.map((day) => (
              <View
                key={day}
                style={[styles.tab, { borderColor: colors.border }]}
              >
                <Text style={[styles.text, { color: colors.text }]}>{day}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.settingsTab, { borderColor: colors.border }]}
            onPress={() => setOpenSettings(true)}
          >
            <Text style={[styles.text, { color: colors.text }]}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Top timeline section */}
        <View style={styles.topTimelineWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.timelineScrollContent}
          >
            <View style={[styles.timelineOuter, { width: timelineWidth }]}>
              {/* Hour labels */}
              <View style={styles.hourRow}>
                {Array.from(
                  { length: timelineEndHour - timelineStartHour + 1 },
                  (_, i) => timelineStartHour + i
                ).map((hour) => (
                  <View key={hour} style={[styles.hourCell, { width: hourWidth }]}>
                    <Text style={[styles.hourLabel, { color: colors.text }]}>
                      {formatHourLabel(hour)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Tick marks under the hour labels */}
              <View style={[styles.tickLine, { borderTopColor: colors.border }]}>
                {Array.from(
                  { length: timelineEndHour - timelineStartHour + 1 },
                  (_, i) => timelineStartHour + i
                ).map((hour) => (
                  <View key={hour} style={[styles.tickGroup, { width: hourWidth }]}>
                    <View
                      style={[styles.tick, { backgroundColor: colors.border }]}
                    />
                  </View>
                ))}
              </View>

              {/* Event blocks placed on the timeline using start time and width */}
              <View style={styles.eventLayer}>
                {mappedEvents.length === 0 ? (
                  <Text
                    style={[
                      styles.text,
                      { color: colors.text, marginTop: 12 },
                    ]}
                  >
                    No events found for the next 7 days.
                  </Text>
                ) : (
                  mappedEvents.map((event) => {
                    const startOffsetHours =
                      event.startHour + event.startMinute / 60 - timelineStartHour;

                    const durationHours =
                      event.endHour +
                      event.endMinute / 60 -
                      (event.startHour + event.startMinute / 60);

                    const left = startOffsetHours * hourWidth + 6;
                    const width = durationHours * hourWidth - 12;

                    return (
                      <Pressable
                        key={event.id}
                        style={[
                          styles.timelineEvent,
                          {
                            left,
                            width: Math.max(width, 60),
                            borderColor: colors.border,
                            backgroundColor:
                              selectedId === event.id
                                ? theme === "dark"
                                  ? "#4a4a4a"
                                  : "#d7d7d7"
                                : "transparent",
                          },
                        ]}
                        onPress={() => setSelectedId(event.id)}
                      >
                        <Text
                          style={[styles.text, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {event.title}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Middle control buttons */}
        <View style={styles.controlWrapper}>
          <View style={[styles.control, { borderColor: colors.border }]}>
            <Pressable
              style={[styles.controlBtn, { borderRightColor: colors.border }]}
            >
              <Text style={[styles.text, { color: colors.text }]}>+</Text>
            </Pressable>

            <Pressable
              style={[styles.controlBtn, { borderRightColor: colors.border }]}
            >
              <Text style={[styles.text, { color: colors.text }]}>≡</Text>
            </Pressable>

            <Pressable
              style={styles.controlBtn}
              onPress={() => selectedEvent && setOpenEventOptions(true)}
            >
              <Text style={[styles.text, { color: colors.text }]}>💬</Text>
            </Pressable>
          </View>
        </View>

        {/* Main event details section */}
        <View
          style={[
            styles.main,
            {
              borderTopColor: colors.border,
            },
          ]}
        >
          {!selectedEvent ? (
            <Text style={[styles.bigText, { color: colors.text }]}>
              Select Meeting
            </Text>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>
                {selectedEvent.title}
              </Text>

              <Text style={[styles.smallLabel, { color: colors.text }]}>
                Location
              </Text>
              <Text style={[styles.textLine, { color: colors.text }]}>
                {selectedEvent.location}
              </Text>

              <Text style={[styles.smallLabel, { color: colors.text }]}>
                Time
              </Text>
              <Text style={[styles.textLine, { color: colors.text }]}>
                {formatRange(
                  selectedEvent.startHour,
                  selectedEvent.startMinute,
                  selectedEvent.endHour,
                  selectedEvent.endMinute
                )}
              </Text>

              <Text style={[styles.smallLabel, { color: colors.text }]}>
                Description
              </Text>
              <Text style={[styles.textLine, { color: colors.text }]}>
                {selectedEvent.description}
              </Text>

              <Text style={[styles.smallLabel, { color: colors.text }]}>
                Friends attending
              </Text>
              <View style={styles.attendeeRow}>
                {selectedEvent.friends.length > 0 ? (
                  selectedEvent.friends.map((person) => (
                    <View
                      key={person}
                      style={[styles.attendeeBox, { borderColor: colors.border }]}
                    >
                      <Text style={[styles.text, { color: colors.text }]}>
                        {person}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.text, { color: colors.text }]}>None</Text>
                )}
              </View>

              <Text style={[styles.smallLabel, { color: colors.text }]}>
                All attendees
              </Text>
              <View style={styles.attendeeRow}>
                {selectedEvent.attendees.length > 0 ? (
                  selectedEvent.attendees.map((person) => (
                    <View
                      key={person}
                      style={[styles.attendeeBox, { borderColor: colors.border }]}
                    >
                      <Text style={[styles.text, { color: colors.text }]}>
                        {person}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.text, { color: colors.text }]}>None</Text>
                )}
              </View>

              <Pressable
                style={[styles.joinBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.text, { color: colors.text }]}>Join</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Status message box */}
        {status !== "" && (
          <View style={[styles.statusBox, { borderColor: colors.border }]}>
            <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
          </View>
        )}

        {/* Bottom navigation buttons */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { borderColor: colors.border },
              activeTab === "events" && {
                backgroundColor: theme === "dark" ? "#4a4a4a" : "#d7d7d7",
              },
            ]}
            onPress={() => setActiveTab("events")}
          >
            <Text style={[styles.text, { color: colors.text }]}>📅</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { borderColor: colors.border },
              activeTab === "chat" && {
                backgroundColor: theme === "dark" ? "#4a4a4a" : "#d7d7d7",
              },
            ]}
            onPress={() => setActiveTab("chat")}
          >
            <Text style={[styles.text, { color: colors.text }]}>👥</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Event actions modal */}
      <Modal transparent visible={openEventOptions} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Pressable
              style={[styles.modalBtn, { borderColor: colors.border }]}
              onPress={handleLate}
            >
              <Text style={[styles.text, { color: colors.text }]}>Late</Text>
            </Pressable>

            <Pressable
              style={[styles.modalBtn, { borderColor: colors.border }]}
              onPress={handleExtend}
            >
              <Text style={[styles.text, { color: colors.text }]}>Extend</Text>
            </Pressable>

            <Pressable
              style={[styles.modalBtn, { borderColor: colors.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.text, { color: colors.text }]}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.closeBtn, { borderColor: colors.border }]}
              onPress={() => setOpenEventOptions(false)}
            >
              <Text style={[styles.text, { color: colors.text }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Settings modal */}
      <Modal visible={openSettings} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenSettings(false)}
        >
          <View
            style={[
              styles.modal,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingVertical: 30,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: colors.text,
                  fontSize: 20,
                  marginBottom: 20,
                  textAlign: "center",
                },
              ]}
            >
              Settings
            </Text>

            <View style={styles.settingsRow}>
              <Text style={[styles.text, { color: colors.text, fontSize: 16 }]}>
                {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </Text>

              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor="#f4f3f4"
                ios_backgroundColor="#3e3e3e"
                onValueChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                value={theme === "dark"}
              />
            </View>

            <TouchableOpacity
              onPress={() => setOpenSettings(false)}
              style={[
                styles.doneBtn,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <Text style={[styles.text, { color: "#fff" }]}>DONE</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    alignItems: "center",
  },

  phoneFrame: {
    width: 330,
    minHeight: 720,
    borderWidth: 1,
    padding: 10,
  },

  text: {
    fontSize: 14,
  },

  // Top header row that holds the scrollable weekday tabs and settings icon.
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Scroll container for the weekday buttons.
  tabsScrollContent: {
    paddingRight: 8,
  },

  tab: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },

  settingsTab: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 6,
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
    position: "relative",
  },

  hourRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  hourCell: {
    alignItems: "center",
  },

  hourLabel: {
    fontSize: 10,
  },

  tickLine: {
    flexDirection: "row",
    borderTopWidth: 1,
    height: 14,
  },

  tickGroup: {
    alignItems: "flex-start",
  },

  tick: {
    width: 1,
    height: 10,
  },

  eventLayer: {
    position: "relative",
    height: 46,
    marginTop: 10,
  },

  timelineEvent: {
    position: "absolute",
    top: 0,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },

  controlWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },

  control: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },

  controlBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRightWidth: 1,
  },

  main: {
    minHeight: 380,
    borderTopWidth: 1,
    paddingTop: 18,
    paddingHorizontal: 6,
    justifyContent: "center",
  },

  bigText: {
    fontSize: 30,
    textAlign: "center",
  },

  title: {
    fontSize: 26,
    marginBottom: 8,
  },

  smallLabel: {
    marginTop: 10,
    marginBottom: 3,
    fontSize: 12,
    opacity: 0.85,
  },

  textLine: {
    fontSize: 15,
    lineHeight: 22,
  },

  attendeeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 6,
  },

  attendeeBox: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  joinBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-end",
    marginTop: 16,
  },

  statusBox: {
    borderWidth: 1,
    padding: 8,
    marginTop: 12,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  bottomBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: 220,
    borderWidth: 1,
    padding: 18,
  },

  modalBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  closeBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },

  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  doneBtn: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
});