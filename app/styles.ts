import { StyleSheet } from "react-native";

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
    width: '100%'
  },

  scrollContainer: {
    flex: 1,
    marginRight: 10,
  },

  scrollContent: {
    alignItems: 'center',
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
    alignSelf: 'flex-end'
  },

  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 0
  },
  calendarPlaceholder: {
    height: 120,                
    width: '100%',
    backgroundColor: '#252525',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#555',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 20,
    marginTop: 5, 
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#555',
  },
  middleTab: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  middleTabActive: {
    backgroundColor: '#555', 
  },
  middleTabText: {
    fontSize: 20,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});