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
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    borderTopWidth: 1,
    paddingTop: 10,
  },

  bottomBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderRadius: 8,
  },

  bottomIcon: {
    fontSize: 20,
  },

  bottomLabel: {
    fontSize: 11,
    marginTop: 3,
  },
  chatContainer: {
  flex: 1,
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  chatBackBtn: {
    width: 60,
  },

  chatBackText: {
    fontSize: 15,
  },

  chatHeaderTitle: {
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },

  chatMessageList: {
    padding: 16,
    gap: 10,
  },

  chatBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  chatBubbleMe: {
    alignSelf: "flex-end",
  },

  chatBubbleThem: {
    alignSelf: "flex-start",
  },

  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },

  chatTimestamp: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 4,
    textAlign: "right",
  },

  chatQuickReplyWrapper: {
    borderTopWidth: 1,
    padding: 12,
  },

  chatQuickReplyLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 8,
  },

  chatQuickReplyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chatQuickReplyBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  chatQuickReplyText: {
    fontSize: 13,
  },

  /* Social Page Styling */
  social_page_body: {
      backgroundColor: "#1a1a1a",
      height: "100%"
  },

    tab_switcher: {
      flexDirection: 'row',
      margin: 10,
      marginBottom: 4,
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#333333',
  },
  tab_btn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
  },
  tab_btn_active: {
      backgroundColor: '#333333',
  },
  tab_btn_text: {
      color: '#f0f0f0',
      fontSize: 15,
      fontWeight: '500',
  },

  search_body: {
      marginTop: 10,
      marginRight: 10,
      marginLeft: 10,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333333',
      borderRadius: 10,
  },

  magnif_icon: {
      fontSize: 22,
      margin: 8,
  },

  search_box: {
      flex: 1,
      flexShrink: 1,
      backgroundColor: "#555555",
      color: 'white',
      borderRadius: 10,
  },

  contacts_body: {
      marginTop: 10,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 10,
      backgroundColor: "#333333",
      height: "65%",
      borderRadius: 10,
  },

  contact: {
      backgroundColor: "#555555",
      margin: 5,
      padding: 10,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },

  contact_name: {
      color: '#f0f0f0',
  },

  group_member_count: {
      color: '#aaa',
      fontSize: 12,
      marginTop: 3,
  },
  member_dropdown: {
      marginTop: 8,
      maxHeight: 120,         // limits height so it scrolls rather than pushing everything down
      backgroundColor: '#444',
      borderRadius: 6,
      padding: 6,
  },
  member_row: {
      color: '#f0f0f0',
      paddingVertical: 4,
      fontSize: 13,
  },
  empty_text: {
      color: '#888',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 13,
  },


  menu_icon: {
      fontSize: 32,
      margin: 8,
      color: '#f0f0f0',
  },

  addContact_button_body: {
      backgroundColor: '#1a1a1a',
      padding: 10,
      borderRadius: 10,
      borderColor: '#333333',
      borderWidth: 1.5,
  },

  addContact_button: {
      fontSize: 18,
      color: 'white',
      fontWeight: '500',
  },

  buttons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      margin: 10,
  },
  /*********************** Modals **************************/
  modal_container: {
      flex: 1,
      backgroundColor: 'grey',
      alignItems: 'center',
      justifyContent: 'center',
  },

  modal_content: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
  },

  modal_card: {
      width: "90%",
      padding: 20,
      backgroundColor: "lightgrey",
      borderRadius: 10,
  },

  modal_title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
  },

  modal_input: {
      backgroundColor: 'white',
      borderRadius: 6,
      padding: 10,
      marginBottom: 10,
      fontSize: 15,
  },

  modal_button: {
      backgroundColor: 'gray',
      borderRadius: 6,
      padding: 12,
      alignItems: 'center',
      marginTop: 4,
      marginBottom: 10,
  },
  modal_button_text: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
  },
  modal_cancel: {

      color: 'red',
      textAlign: 'center',
      fontSize: 22,
      marginTop: 8,
  },

  /************** Group Picker Modal *****************/

  group_picker_label: {
      fontSize: 13,
      color: '#444',
      marginBottom: 6,
      fontWeight: '500',
  },
  group_picker_row: {
      backgroundColor: 'white',
      borderRadius: 6,
      padding: 10,
      marginBottom: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  group_picker_row_text: {
      fontSize: 15,
      color: '#111',
  },
  group_picker_count: {
      fontSize: 16,
      color: '#888',
  },

  /**************** Edit Group Modal (remove members) ****************/
  remove_member_row: {
      backgroundColor: 'white',
      borderRadius: 6,
      padding: 10,
      marginBottom: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  remove_member_name: {
      fontSize: 15,
      color: '#111',
  },
  remove_member_x: {
      fontSize: 16,
      color: 'red',
  },

  /******************* 3-Dot Menu *******************/
  menu_card: {
      width: '70%',
      backgroundColor: 'lightgrey',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 0,
      overflow: 'hidden',
  },
  menu_contact_name: {
      fontSize: 20,
      color: '#555',
      textAlign: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
  },
  menu_divider: {
      height: 0.5,
      backgroundColor: '#bbb',
      marginHorizontal: 0,
  },
  menu_option: {
      paddingVertical: 14,
      paddingHorizontal: 20,
  },
  menu_option_text: {
      fontSize: 16,
      color: '#111',
  },
  menu_delete_text: {
      color: 'red',
  },
    

});
