import { StyleSheet } from "react-native";
export const GlobalThemes = {
  light: {
    background: "#f0f0f0",
    text: "#1a1a1a",
    card: "#ffffff",
    accent: "#333333",
    border: "#cccccc",
    tabActive: "#dddddd",
  },
  dark: {
    background: "#1a1a1a",
    text: "#ffffff",
    card: "grey",
    accent: "#333333",
    border: "#444444",
    tabActive: "#555555",
  },
};
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },

  scrollContainer: {
    flex: 1,
    marginRight: 10,
  },

  scrollContent: {
    alignItems: "center",
    paddingRight: 10,
  },

  tab: {
    borderWidth: 1.5,
    borderColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 5,
  },

  tabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  settingsIcon: {
    fontSize: 24,
    alignSelf: "flex-end",
  },

  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 0,
  },
  calendarPlaceholder: {
    height: 120,
    width: "100%",
    backgroundColor: "#252525",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#555",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 20,
    marginTop: 5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#555",
  },
  tabSwitcherBottom: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 20,
    marginTop: 5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#555",
    alignContent: "flex-end",
    position: "absolute",
    bottom: 50,
  },
  middleTab: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  middleTabActive: {
    backgroundColor: "#555",
  },
  middleTabText: {
    fontSize: 20,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icons: {
    width: 24,
    height: 24,
  },
  card: {
    flex: 1,
    width: "45%",
    padding: 20,
    backgroundColor: "grey",
    borderRadius: 10,
    justifyContent: "flex-end",
    marginTop: "120%",
    marginBottom: "14%",
  },
  card_background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancel_button: {
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "lightyellow",
    padding: 10,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  eventTime: {
    fontSize: 14,
    color: "#555",
  },

  eventLocation: {
    fontSize: 12,
    color: "#888",
  },
});
