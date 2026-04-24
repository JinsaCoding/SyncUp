import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import * as Notifications from "expo-notifications";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GlobalStyles, GlobalThemes } from "./styles";

import { useContacts } from './context/ContactContext';
import { useTheme } from './context/ThemeContext';

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

function AddEventForm({
  colors,
  onSave,
  onCancel,
}: {
  colors: (typeof GlobalThemes)["dark"];
  onSave: (event: {
    title: string;
    location: string;
    description: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    friends: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [friends, setFriends] = useState("");

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { contacts, addContact, deleteContact } = useContacts();

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const fieldStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 14,
  };

  const labelStyle = {
    color: colors.text,
    fontSize: 12,
    opacity: 0.85,
    marginBottom: 4,
  } as const;

  const valueStyle = {
    color: colors.text,
    fontSize: 15,
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 6,
        paddingTop: 18,
        paddingBottom: 40,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 22, marginBottom: 20 }}>
        New Event
      </Text>

      {/* Title */}
      <Text style={labelStyle}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Event title"
        placeholderTextColor={colors.border}
        style={{ ...fieldStyle, color: colors.text, fontSize: 15 }}
      />

      {/* Date */}
      <Text style={labelStyle}>Date</Text>
      <Pressable style={fieldStyle} onPress={() => setShowDatePicker(true)}>
        <Text style={valueStyle}>{formatDate(date)}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e: DateTimePickerEvent, selected?: Date) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      {/* Start / End Time */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 0 }}>
        <View style={{ flex: 1 }}>
          <Text style={labelStyle}>Start Time</Text>
          <Pressable
            style={{ ...fieldStyle }}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={valueStyle}>{formatTime(startTime)}</Text>
          </Pressable>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(e: DateTimePickerEvent, selected?: Date) => {
                setShowStartPicker(false);
                if (selected) setStartTime(selected);
              }}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={labelStyle}>End Time</Text>
          <Pressable
            style={{ ...fieldStyle }}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={valueStyle}>{formatTime(endTime)}</Text>
          </Pressable>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(e: DateTimePickerEvent, selected?: Date) => {
                setShowEndPicker(false);
                if (selected) setEndTime(selected);
              }}
            />
          )}
        </View>
      </View>

      {/* Location */}
      <Text style={labelStyle}>Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Where is it?"
        placeholderTextColor={colors.border}
        style={{ ...fieldStyle, color: colors.text, fontSize: 15 }}
      />

      {/* Description */}
      <Text style={labelStyle}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="What's happening?"
        placeholderTextColor={colors.border}
        multiline
        numberOfLines={3}
        style={{
          ...fieldStyle,
          color: colors.text,
          fontSize: 15,
          textAlignVertical: "top",
        }}
      />

      {/* Invite Friends */}
      <Text style={labelStyle}>Invite Friends</Text>
      <TextInput
        value={friends}
        onChangeText={setFriends}
        placeholder="Names or emails, comma separated"
        placeholderTextColor={colors.border}
        style={{
          ...fieldStyle,
          color: colors.text,
          fontSize: 15,
          marginBottom: 24,
        }}
      />

      {/* Buttons */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 14 }}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            onSave({
              title,
              location,
              description,
              date,
              startTime,
              endTime,
              friends,
            })
          }
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 12,
            alignItems: "center",
            backgroundColor: colors.accent,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>Save Event</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

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

  // Get theme and colors from context
  const { theme, setTheme, colors } = useTheme();

  // Stores the real calendar events pulled from the device.
  const [events, setEvents] = useState<Calendar.Event[]>([]);

  // Controls the bottom tab state.
  const [activeTab, setActiveTab] = useState("events");

  // Controls the event action modal (Late / Extend / Cancel).
  const [openEventOptions, setOpenEventOptions] = useState(false);

  // Controls the settings modal.
  const [openSettings, setOpenSettings] = useState(false);

  // Stores which timeline event is currently selected.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Status message shown near the bottom of the screen.
  const [status, setStatus] = useState("");

  // Weekday labels shown at the top.
  const [selectedDay, setSelectedDay] = useState(0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label:
        i === 0
          ? "Today"
          : d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
      date: d,
    };
  });

  const [manualEvents, setManualEvents] = useState<TimelineEvent[]>([]);

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
      Calendar.EntityTypes.EVENT,
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
          "Calendar access is needed to show your events.",
        );
        return;
      }

      await syncCalendarEvents();

      const { status: notifStatus } =
        await Notifications.requestPermissionsAsync();

      if (notifStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Notifications permission not granted!",
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
      .filter(
        (event) =>
          event.endHour >= timelineStartHour &&
          event.startHour <= timelineEndHour,
      )
      .sort((a, b) => {
        const aMinutes = a.startHour * 60 + a.startMinute;
        const bMinutes = b.startHour * 60 + b.startMinute;
        return aMinutes - bMinutes;
      });

    // Merge manually added events and re-sort
    return [...converted, ...manualEvents]
      .filter((event) => {
        const selected = days[selectedDay].date;
        // for calendar events, check the original event's date
        if (event.originalEvent?.startDate) {
          const eventDate = new Date(event.originalEvent.startDate);
          return (
            eventDate.getFullYear() === selected.getFullYear() &&
            eventDate.getMonth() === selected.getMonth() &&
            eventDate.getDate() === selected.getDate()
          );
        }
        // for manual events, always show on Today for now
        return selectedDay === 0;
      })
      .sort((a, b) => {
        const aMinutes = a.startHour * 60 + a.startMinute;
        const bMinutes = b.startHour * 60 + b.startMinute;
        return aMinutes - bMinutes;
      });
  }, [events, manualEvents, selectedDay]);

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

  // Formats an event's full time range.
  const formatRange = (
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
  ) => {
    return `${formatTime(startHour, startMinute)} - ${formatTime(
      endHour,
      endMinute,
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

    const totalMinutes = selectedEvent.startHour * 60 + selectedEvent.startMinute + 20;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        String(event.id) === selectedEvent.id
          ? {
              ...event,
              startDate: new Date(
                new Date(event.startDate || new Date()).setHours(newHour, newMinute, 0, 0)
              ),
            }
          : event,
      ),
    );

    setManualEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, startHour: newHour, startMinute: newMinute }
          : event,
      ),
    );

    setStatus(`${selectedEvent.title} start time pushed back 20 minutes.`);
    setOpenEventOptions(false);
  };

  // Handles the "Extend" action by adding 20 minutes to the event's end time.
  const handleExtend = () => {
    if (!selectedEvent) return;

    const { newHour, newMinute } = addTwentyMinutesToEnd(
      selectedEvent.endHour,
      selectedEvent.endMinute,
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
                  0,
                ),
              ),
            }
          : event,
      ),
    );

    setManualEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, endHour: newHour, endMinute: newMinute }
          : event,
      ),
    );

    setStatus(`${selectedEvent.title} was extended by 20 minutes.`);
    setOpenEventOptions(false);
  };

  // Handles the "Cancel" action by removing the event from the local list
  // and sending a notification.
  const handleCancel = async () => {
    if (!selectedEvent) return;

    setEvents((prevEvents) =>
      prevEvents.filter((event) => String(event.id) !== selectedEvent.id),
    );

    setManualEvents((prev) =>
      prev.filter((event) => event.id !== selectedEvent.id),
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
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedDay(index);
                  setSelectedId(null);
                }}
                style={[
                  styles.tab,
                  { borderColor: colors.border },
                  selectedDay === index && {
                    backgroundColor: theme === "dark" ? "#4a4a4a" : "#d7d7d7",
                  },
                ]}
              >
                <Text style={[styles.text, { color: colors.text }]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.settingsTab, { borderColor: colors.border }]}
            onPress={() => setOpenSettings(true)}
          >
            <Text style={[styles.text, { color: colors.text }]}>⚙</Text>
          </TouchableOpacity>
        </View>

        {activeTab !== "add" && (
          <>
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
                      (_, i) => timelineStartHour + i,
                    ).map((hour) => (
                      <View
                        key={hour}
                        style={[styles.hourCell, { width: hourWidth }]}
                      >
                        <Text
                          style={[styles.hourLabel, { color: colors.text }]}
                        >
                          {formatHourLabel(hour)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Tick marks under the hour labels */}
                  <View
                    style={[styles.tickLine, { borderTopColor: colors.border }]}
                  >
                    {Array.from(
                      { length: timelineEndHour - timelineStartHour + 1 },
                      (_, i) => timelineStartHour + i,
                    ).map((hour) => (
                      <View
                        key={hour}
                        style={[styles.tickGroup, { width: hourWidth }]}
                      >
                        <View
                          style={[
                            styles.tick,
                            { backgroundColor: colors.border },
                          ]}
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
                          event.startHour +
                          event.startMinute / 60 -
                          timelineStartHour;

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
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Text style={[styles.title, { color: colors.text, flex: 1 }]}>
                      {selectedEvent.title}
                    </Text>
                    <Pressable
                      onPress={() => setOpenEventOptions(true)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        marginLeft: 8,
                      }}
                    >
                      <Text style={{ color: colors.text, fontSize: 18 }}>⋮</Text>
                    </Pressable>
                  </View>

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
                      selectedEvent.endMinute,
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
                          style={[
                            styles.attendeeBox,
                            { borderColor: colors.border },
                          ]}
                        >
                          <Text style={[styles.text, { color: colors.text }]}>
                            {person}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={[styles.text, { color: colors.text }]}>
                        None
                      </Text>
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
                          style={[
                            styles.attendeeBox,
                            { borderColor: colors.border },
                          ]}
                        >
                          <Text style={[styles.text, { color: colors.text }]}>
                            {person}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={[styles.text, { color: colors.text }]}>
                        None
                      </Text>
                    )}
                  </View>

                  <Pressable
                    style={[styles.joinBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.text, { color: colors.text }]}>
                      Join
                    </Text>
                  </Pressable>
                </>
              )}
            </View>

            {/* Status message box */}
            {status !== "" && (
              <View style={[styles.statusBox, { borderColor: colors.border }]}>
                <Text style={[styles.text, { color: colors.text }]}>
                  {status}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Add Event form */}
        {activeTab === "add" && (
          <AddEventForm
            colors={colors}
            onSave={(newEvent) => {
              const newTimelineEvent: TimelineEvent = {
                id: `manual-${Date.now()}`,
                title: newEvent.title || "Untitled Event",
                location: newEvent.location || "No location",
                description:
                  newEvent.description || "No description available.",
                friends: newEvent.friends
                  ? newEvent.friends
                      .split(",")
                      .map((f) => f.trim())
                      .filter(Boolean)
                  : [],
                attendees: [],
                startHour: newEvent.startTime.getHours(),
                startMinute: newEvent.startTime.getMinutes(),
                endHour: newEvent.endTime.getHours(),
                endMinute: newEvent.endTime.getMinutes(),
                type: "meeting",
              };

              setManualEvents((prev) => [...prev, newTimelineEvent]);
              setStatus(`"${newEvent.title}" was added.`);
              setActiveTab("events");
            }}
            onCancel={() => setActiveTab("events")}
          />
        )}

        {/* Bottom navigation buttons */}
        <View style={[GlobalStyles.bottom, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              GlobalStyles.bottomBtn,
              { borderColor: colors.border },
              activeTab === "events" && {
                backgroundColor: theme === "dark" ? "#4a4a4a" : "#d7d7d7",
              },
            ]}
            onPress={() => setActiveTab("events")}
          >
            <Text style={[GlobalStyles.bottomIcon, { color: colors.text }]}>
              📅
            </Text>
            <Text style={[GlobalStyles.bottomLabel, { color: colors.text }]}>
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GlobalStyles.bottomBtn,
              { borderColor: colors.border },
              activeTab === "social" && {
                backgroundColor: theme === "dark" ? "#4a4a4a" : "#d7d7d7",
              },
            ]}
            onPress={() => {
              router.push("/social");
            }}
          >
            <Text style={[GlobalStyles.bottomIcon, { color: colors.text }]}>
              👥
            </Text>
            <Text style={[GlobalStyles.bottomLabel, { color: colors.text }]}>
              Social
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GlobalStyles.bottomBtn,
              { borderColor: colors.border },
              activeTab === "add" && {
                backgroundColor: theme === "dark" ? "#4a4a4a" : "#d7d7d7",
              },
            ]}
            onPress={() => setActiveTab("add")}
          >
            <Text style={[GlobalStyles.bottomIcon, { color: colors.text }]}>
              ➕
            </Text>
            <Text style={[GlobalStyles.bottomLabel, { color: colors.text }]}>
              Add
            </Text>
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
  },

  phoneFrame: {
    flex: 1,
    minHeight: 720,
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
