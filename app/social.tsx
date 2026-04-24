import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Contact, Group } from './context/ContactContext';
import { useContacts } from './context/ContactContext';
import { GlobalStyles, GlobalThemes } from "./styles";

export default function SocialScreen() {
    const { contacts,
        addContact,
        editContact,
        deleteContact,
        groups,
        addGroup,
        deleteGroup,
        addToGroup,
        removeMemberFromGroup
    } = useContacts();

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colors = GlobalThemes['dark'];

    const [activeTab, setActiveTab] = useState<'contacts' | 'groups'>('contacts');

  const [openModal, setOpenModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const [searchText, setSearchText] = useState("");

    const [menuContact, setMenuContact] = useState<Contact | null>(null);
    const [showMenuModal, setShowMenuModal] = useState(false);

    /*********************** Grouped Contacts ***********************/
    const [showGroupPickerModal, setShowGroupPickerModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const [menuGroup, setMenuGroup] = useState<Group | null>(null);
    const [showGroupMenuModal, setShowGroupMenuModal] = useState(false);


    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    // Tracks which group id is currently expanded to show members
    const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

    function openGroupPicker() {
        setShowMenuModal(false); // close the contact 3-dot menu
        setNewGroupName('');
        setShowGroupPickerModal(true);
    }

    function handleAddToExistingGroup(groupId: string) {
        if (!menuContact) return;
        addToGroup(groupId, menuContact.id);
        setShowGroupPickerModal(false);
    }

    function handleCreateNewGroup() {
        if (!newGroupName.trim() || !menuContact) return;
        addGroup(newGroupName.trim(), [menuContact.id]);
        setNewGroupName('');
        setShowGroupPickerModal(false);
    }
    
    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(searchText.toLowerCase())
    );

    function openGroupMenu(group: Group) {
        setMenuGroup(group);
        setShowGroupMenuModal(true);
    }

    function openEditGroupModal(group: Group) {
        setEditingGroup(group);
        setShowGroupMenuModal(false);
        setShowEditGroupModal(true);
    }

    function handleDeleteGroup() {
        if (!menuGroup) return;
        deleteGroup(menuGroup.id);
        setShowGroupMenuModal(false);
    }

    function toggleGroupExpand(groupId: string) {
        setExpandedGroupId(prev => prev === groupId ? null : groupId);
    }

    /***************************************************************/

    /*********************** Single Contacts ***********************/


    function openContactMenu(contact: Contact) {
        setMenuContact(contact);
        setShowMenuModal(true);
    }

    function openEditContactModal(contact: Contact) {
        setEditingContact(contact);
        setEditedName(contact.name);
        setEditedPhone(contact.phone);
        setEditedEmail(contact.email);
        setShowMenuModal(false);
        setShowEditModal(true);
    }

    // Filter contacts based on search text either matching name, phone, or email
    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.phone.includes(searchText) ||
        c.email.toLowerCase().includes(searchText.toLowerCase())
    );


  function handleAddContact() {
    if (!newName.trim()) {
      return;
    }

    addContact({ name: newName, phone: newPhone, email: newEmail });

        setNewName('');
        setNewPhone('');
        setNewEmail('');
        setOpenModal(false);
    }

    function handleDelete() {
        if (!menuContact) return;
        deleteContact(menuContact.id);
        setShowMenuModal(false);
    }

  function handleEditContact() {
    if (!editingContact || !editedName.trim()) {
      return;
    }

    editContact(editingContact.id, {
      name: editedName,
      phone: editedPhone,
      email: editedEmail,
    });

        setShowEditModal(false);
    }

    /***************************************************************/


  /* ➕ */

    return (
        <View style={[GlobalStyles.social_page_body, { paddingBottom: insets.bottom }]}>


            {/*************************** Add Contact Modal *******************************/}
            <Modal visible={openModal} transparent={true} animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setOpenModal(false)}>

                    <TouchableOpacity style={GlobalStyles.modal_card} activeOpacity={1}>0
                        <Text style={GlobalStyles.modal_title}>Add Contact</Text>

                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Name"
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Phone"
                            value={newPhone}
                            onChangeText={setNewPhone}
                        />
                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Email"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                        <TouchableOpacity style={GlobalStyles.modal_button} onPress={handleAddContact}>
                            <Text style={GlobalStyles.modal_button_text}>Add Contact</Text>
                        </TouchableOpacity>
                        <Text style={GlobalStyles.modal_cancel} onPress={() => setOpenModal(false)}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    
                </TouchableOpacity>
            </Modal>
            
            {/*************************** Edit Contact Modal *******************************/}
            <Modal visible={showEditModal} transparent={true} animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowEditModal(false)}>
                    <TouchableOpacity style={GlobalStyles.modal_card} activeOpacity={1}>
                        <Text style={GlobalStyles.modal_title}>Edit Contact</Text>

                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Name"
                            value={editedName}
                            onChangeText={setEditedName}
                        />
                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Phone"
                            value={editedPhone}
                            onChangeText={setEditedPhone}
                        />
                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Email"
                            value={editedEmail}
                            onChangeText={setEditedEmail}
                        />
                        <TouchableOpacity style={GlobalStyles.modal_button} onPress={handleEditContact}>
                            <Text style={GlobalStyles.modal_button_text}>Save Changes</Text>
                        </TouchableOpacity>
                        <Text style={GlobalStyles.modal_cancel} onPress={() => setShowEditModal(false)}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/********************************* 3-Dot Contact Menu *********************************/}
            <Modal visible={showMenuModal} transparent animationType="fade">
                {/* Tap outside the menu card to close it */}
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowMenuModal(false)}>
                    <TouchableOpacity style={GlobalStyles.menu_card} activeOpacity={1}>

                        {/* Shows the contact's name at the top so the user knows who they're acting on */}
                        <Text style={GlobalStyles.menu_contact_name}>{menuContact?.name}</Text>
                        {/* Edit Contact */}
                        <TouchableOpacity
                            style={GlobalStyles.menu_option}
                            onPress={() => menuContact && openEditContactModal(menuContact)}
                        >
                            <Text style={GlobalStyles.menu_option_text}>✏️  Edit</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.menu_divider} />

                        {/* Add to Group */}
                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={openGroupPicker}>
                            <Text style={GlobalStyles.menu_option_text}>👥  Add to Group</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.menu_divider} />

                        {/* Delete Contact */}
                        <TouchableOpacity
                            style={GlobalStyles.menu_option}
                            onPress={handleDelete}
                        >
                            <Text style={[GlobalStyles.menu_option_text, GlobalStyles.menu_delete_text]}>🗑️  Remove</Text>
                        </TouchableOpacity>

                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Group Picker Modal *******************************/}
            <Modal visible={showGroupPickerModal} transparent animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowGroupPickerModal(false)}>
                    <TouchableOpacity style={GlobalStyles.modal_card} activeOpacity={1}>
                        <Text style={GlobalStyles.modal_title}>Add to Group</Text>

                        {/* Create a brand new group */}
                        <Text style={GlobalStyles.group_picker_label}>Create new group</Text>
                        <TextInput
                            style={GlobalStyles.modal_input}
                            placeholder="Group name"
                            placeholderTextColor="#888"
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                        />
                        <TouchableOpacity style={GlobalStyles.modal_button} onPress={handleCreateNewGroup}>
                            <Text style={GlobalStyles.modal_button_text}>Create & Add</Text>
                        </TouchableOpacity>

                        {/* Or pick an existing group */}
                        {groups.length > 0 && (
                            <>
                                <Text style={[GlobalStyles.group_picker_label, { marginTop: 16 }]}>Add to existing group</Text>
                                {groups.map(g => (
                                    <TouchableOpacity
                                        key={g.id}
                                        style={GlobalStyles.group_picker_row}
                                        onPress={() => handleAddToExistingGroup(g.id)}
                                    >
                                        <Text style={GlobalStyles.group_picker_row_text}>{g.name}</Text>
                                        <Text style={GlobalStyles.group_picker_count}>{g.memberIds.length} members</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                        <Text style={GlobalStyles.modal_cancel} onPress={() => setShowGroupPickerModal(false)}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Group 3-Dot Menu *******************************/}
            <Modal visible={showGroupMenuModal} transparent animationType="fade">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowGroupMenuModal(false)}>
                    <TouchableOpacity style={GlobalStyles.menu_card} activeOpacity={1}>
                        <Text style={GlobalStyles.menu_contact_name}>{menuGroup?.name}</Text>
                        <View style={GlobalStyles.menu_divider} />

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={() => menuGroup && openEditGroupModal(menuGroup)}>
                            <Text style={GlobalStyles.menu_option_text}>✏️  Edit Members</Text>
                        </TouchableOpacity>
                        <View style={GlobalStyles.menu_divider} />

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={handleDeleteGroup}>
                            <Text style={[GlobalStyles.menu_option_text, GlobalStyles.menu_delete_text]}>🗑️  Delete Group</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Edit Group Modal (remove members) *******************************/}
            <Modal visible={showEditGroupModal} transparent animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowEditGroupModal(false)}>
                    <TouchableOpacity style={GlobalStyles.modal_card} activeOpacity={1}>
                        <Text style={GlobalStyles.modal_title}>{editingGroup?.name}</Text>
                        <Text style={GlobalStyles.group_picker_label}>Tap a member to remove them</Text>

                        {editingGroup?.memberIds.length === 0 && (
                            <Text style={{ color: '#888', textAlign: 'center', marginVertical: 12 }}>No members in this group.</Text>
                        )}

                        {editingGroup?.memberIds.map(memberId => {
                            const contact = contacts.find(c => c.id === memberId);
                            if (!contact) return null;
                            return (
                                <TouchableOpacity
                                    key={memberId}
                                    style={GlobalStyles.remove_member_row}
                                    onPress={() => {
                                        removeMemberFromGroup(editingGroup.id, memberId);
                                        // Update the local editingGroup state so the list updates instantly
                                        setEditingGroup(prev => prev
                                            ? { ...prev, memberIds: prev.memberIds.filter(id => id !== memberId) }
                                            : prev
                                        );
                                    }}
                                >
                                    <Text style={GlobalStyles.remove_member_name}>{contact.name}</Text>
                                    <Text style={GlobalStyles.remove_member_x}>✕</Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity style={[GlobalStyles.modal_button, { marginTop: 16 }]} onPress={() => setShowEditGroupModal(false)}>
                            <Text style={GlobalStyles.modal_button_text}>Done</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Tab Switcher *******************************/}
            <View style={GlobalStyles.tab_switcher}>
                <TouchableOpacity
                    style={[GlobalStyles.tab_btn, activeTab === 'contacts' && GlobalStyles.tab_btn_active]}
                    onPress={() => { setActiveTab('contacts'); setSearchText(''); }}
                >
                    <Text style={GlobalStyles.tab_btn_text}>Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[GlobalStyles.tab_btn, activeTab === 'groups' && GlobalStyles.tab_btn_active]}
                    onPress={() => { setActiveTab('groups'); setSearchText(''); }}
                >
                    <Text style={GlobalStyles.tab_btn_text}>Groups</Text>
                </TouchableOpacity>
            </View>

            {/*********************** Search Bar ***********************/}
            <View style={GlobalStyles.search_body}>
                <Text style={GlobalStyles.magnif_icon}>🔍</Text>
                <TextInput style={GlobalStyles.search_box}
                placeholder={activeTab === 'contacts' ? 'Search Contacts' : 'Search Groups'}
                placeholderTextColor="white"
                value={searchText}
                onChangeText={setSearchText}
                />
            </View>
            
            {/*************************** Contacts Tab *******************************/}
            {activeTab === 'contacts' && (
                <View style={GlobalStyles.contacts_body}>
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={GlobalStyles.contact}>
                                <View>
                                    <Text style={GlobalStyles.contact_name}>{item.name}</Text>
                                    <Text style={GlobalStyles.contact_name}>{item.phone}</Text>
                                    <Text style={GlobalStyles.contact_name}>{item.email}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "./chat",
                                                params: { name: item.name },
                                            })
                                        }
                                                        >
                                        <Text style={GlobalStyles.menu_icon}>💬</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => openContactMenu(item)}>
                                        <Text style={GlobalStyles.menu_icon}>⋮</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                </View>
            )}

            {/*************************** Groups Tab *******************************/}
            {activeTab === 'groups' && (
                <View style={GlobalStyles.contacts_body}>
                    {filteredGroups.length === 0 ? (
                        <Text style={GlobalStyles.empty_text}>No groups yet. Add a contact to a group to get started.</Text>
                    ) : (
                        <FlatList
                            data={filteredGroups}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                const isExpanded = expandedGroupId === item.id;
                                const members = item.memberIds
                                    .map(id => contacts.find(c => c.id === id))
                                    .filter(Boolean) as Contact[];

                                return (
                                    <View style={GlobalStyles.contact}>
                                        <View style={{ flex: 1 }}>

                                            {/* Tapping the group name/count toggles the member dropdown */}
                                            <TouchableOpacity onPress={() => toggleGroupExpand(item.id)}>
                                                <Text style={GlobalStyles.contact_name}>{item.name}</Text>
                                                <Text style={GlobalStyles.group_member_count}>
                                                    {item.memberIds.length} {item.memberIds.length === 1 ? 'member' : 'members'}  {isExpanded ? '▲' : '▼'}
                                                </Text>
                                            </TouchableOpacity>

                                            {/* Dropdown — only visible when this group is expanded */}
                                            {isExpanded && (
                                                <ScrollView style={GlobalStyles.member_dropdown} nestedScrollEnabled>
                                                    {members.length === 0
                                                        ? <Text style={GlobalStyles.empty_text}>No members.</Text>
                                                        : members.map(member => (
                                                            <Text key={member.id} style={GlobalStyles.member_row}>
                                                                • {member.name}
                                                            </Text>
                                                        ))
                                                    }
                                                </ScrollView>
                                            )}
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                router.push({
                                                    pathname: "./chat",
                                                    params: { name: item.name },
                                                })
                                            }>
                                                <Text style={GlobalStyles.menu_icon}>💬</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => openGroupMenu(item)}>
                                                <Text style={GlobalStyles.menu_icon}>⋮</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>
            )}

            <View style={GlobalStyles.buttons}> 
                <View style={GlobalStyles.addContact_button_body}>
                    <TouchableOpacity onPress={() => setOpenModal(true)}>
                        <Text style={GlobalStyles.addContact_button}>➕ Add Contact</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
    );

  /* ⋮  Menu Icon just in case */
}