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
import { useTheme } from './context/ThemeContext';
import { GlobalStyles } from "./styles";

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
    const insets = useSafeAreaInsets(); // used for avoiding overlap with top and bottom menus on phones
    const { colors } = useTheme();

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
        <View style={[GlobalStyles.social_page_body, { paddingBottom: insets.bottom, paddingTop: insets.top, backgroundColor: colors.background }]}>
            
            {/* Header */}
            <View style={[GlobalStyles.chatHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={GlobalStyles.chatBackBtn}>
                    <Text style={[GlobalStyles.chatBackText, { color: colors.text }]}>← Back</Text>
                </TouchableOpacity>
                <Text style={[GlobalStyles.chatHeaderTitle, { color: colors.text }]}>Social</Text>
                <View style={GlobalStyles.chatBackBtn} />
            </View>

            {/*************************** Add Contact Modal *******************************/}
            <Modal visible={openModal} transparent animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setOpenModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.modal_card, { backgroundColor: colors.card }]} activeOpacity={1}>
                        <Text style={[GlobalStyles.modal_title, { color: colors.text }]}>Add Contact</Text>
                        <TextInput style={GlobalStyles.modal_input} placeholder="Name" placeholderTextColor="#888" value={newName} onChangeText={setNewName} />
                        <TextInput style={GlobalStyles.modal_input} placeholder="Phone" placeholderTextColor="#888" value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />
                        <TextInput style={GlobalStyles.modal_input} placeholder="Email" placeholderTextColor="#888" value={newEmail} onChangeText={setNewEmail} keyboardType="email-address" />
                        <TouchableOpacity style={[GlobalStyles.modal_button, { backgroundColor: colors.accent, borderColor: colors.border }]} onPress={handleAddContact}>
                            <Text style={[GlobalStyles.modal_button_text, { color: colors.text }]}>Add Contact</Text>
                        </TouchableOpacity>
                        <Text style={GlobalStyles.modal_cancel} onPress={() => setOpenModal(false)}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Edit Contact Modal *******************************/}
            <Modal visible={showEditModal} transparent animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowEditModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.modal_card, { backgroundColor: colors.card }]} activeOpacity={1}>
                        <Text style={[GlobalStyles.modal_title, { color: colors.text }]}>Edit Contact</Text>
                        <TextInput style={GlobalStyles.modal_input} placeholder="Name" placeholderTextColor="#888" value={editedName} onChangeText={setEditedName} />
                        <TextInput style={GlobalStyles.modal_input} placeholder="Phone" placeholderTextColor="#888" value={editedPhone} onChangeText={setEditedPhone} keyboardType="phone-pad" />
                        <TextInput style={GlobalStyles.modal_input} placeholder="Email" placeholderTextColor="#888" value={editedEmail} onChangeText={setEditedEmail} keyboardType="email-address" />
                        <TouchableOpacity style={[GlobalStyles.modal_button, { backgroundColor: colors.accent, borderColor: colors.border }]} onPress={handleEditContact}>
                            <Text style={[GlobalStyles.modal_button_text, { color: colors.text }]}>Save Changes</Text>
                        </TouchableOpacity>
                        <Text style={GlobalStyles.modal_cancel} onPress={() => setShowEditModal(false)}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** 3-Dot Contact Menu *******************************/}
            <Modal visible={showMenuModal} transparent animationType="fade">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowMenuModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.menu_card, { backgroundColor: colors.card }]} activeOpacity={1}>
                        <Text style={[GlobalStyles.menu_contact_name, { color: colors.text }]}>{menuContact?.name}</Text>

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={() => menuContact && openEditContactModal(menuContact)}>
                            <Text style={[GlobalStyles.menu_option_text, { color: colors.text }]}>✏️  Edit</Text>
                        </TouchableOpacity>
                        <View style={[GlobalStyles.menu_divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={openGroupPicker}>
                            <Text style={[GlobalStyles.menu_option_text, { color: colors.text }]}>👥  Add to Group</Text>
                        </TouchableOpacity>
                        <View style={[GlobalStyles.menu_divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={handleDelete}>
                            <Text style={[GlobalStyles.menu_option_text, GlobalStyles.menu_delete_text]}>🗑️  Remove</Text>
                        </TouchableOpacity>
                        <View style={[GlobalStyles.menu_divider, { backgroundColor: colors.border }]} />

                        <Text style={GlobalStyles.modal_cancel} onPress={() => setShowMenuModal(false)}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Group Picker Modal *******************************/}
            <Modal visible={showGroupPickerModal} transparent animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowGroupPickerModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.modal_card, { backgroundColor: colors.card }]} activeOpacity={1}>
                        <Text style={[GlobalStyles.modal_title, { color: colors.text }]}>Add to Group</Text>

                        <Text style={[GlobalStyles.group_picker_label, { color: colors.text }]}>Create new group</Text>
                        <TextInput style={GlobalStyles.modal_input} placeholder="Group name" placeholderTextColor="#888" value={newGroupName} onChangeText={setNewGroupName} />
                        <TouchableOpacity style={[GlobalStyles.modal_button, { backgroundColor: colors.accent, borderColor: colors.border }]} onPress={handleCreateNewGroup}>
                            <Text style={[GlobalStyles.modal_button_text, { color: colors.text }]}>Create & Add</Text>
                        </TouchableOpacity>

                        {groups.length > 0 && (
                            <>
                                <Text style={[GlobalStyles.group_picker_label, { color: colors.text, marginTop: 16 }]}>Add to existing group</Text>
                                {groups.map(g => (
                                    <TouchableOpacity
                                        key={g.id}
                                        style={[GlobalStyles.group_picker_row, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}
                                        onPress={() => handleAddToExistingGroup(g.id)}
                                    >
                                        <Text style={[GlobalStyles.group_picker_row_text, { color: colors.text }]}>{g.name}</Text>
                                        <Text style={[GlobalStyles.group_picker_count, { color: colors.text, opacity: 0.6 }]}>{g.memberIds.length} members</Text>
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
                    <TouchableOpacity style={[GlobalStyles.menu_card, { backgroundColor: colors.card }]} activeOpacity={1}>
                        <Text style={[GlobalStyles.menu_contact_name, { color: colors.text }]}>{menuGroup?.name}</Text>
                        <View style={[GlobalStyles.menu_divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={() => menuGroup && openEditGroupModal(menuGroup)}>
                            <Text style={[GlobalStyles.menu_option_text, { color: colors.text }]}>✏️  Edit Members</Text>
                        </TouchableOpacity>
                        <View style={[GlobalStyles.menu_divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={GlobalStyles.menu_option} onPress={handleDeleteGroup}>
                            <Text style={[GlobalStyles.menu_option_text, GlobalStyles.menu_delete_text]}>🗑️  Delete Group</Text>
                        </TouchableOpacity>
                        <View style={[GlobalStyles.menu_divider, { backgroundColor: colors.border }]} />

                        <Text style={GlobalStyles.modal_cancel} onPress={() => setShowGroupMenuModal(false)}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Edit Group Modal *******************************/}
            <Modal visible={showEditGroupModal} transparent animationType="slide">
                <TouchableOpacity style={GlobalStyles.modal_content} onPress={() => setShowEditGroupModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.modal_card, { backgroundColor: colors.card }]} activeOpacity={1}>
                        <Text style={[GlobalStyles.modal_title, { color: colors.text }]}>{editingGroup?.name}</Text>
                        <Text style={[GlobalStyles.group_picker_label, { color: colors.text }]}>Tap a member to remove them</Text>

                        {editingGroup?.memberIds.length === 0 && (
                            <Text style={{ color: colors.text, opacity: 0.5, textAlign: 'center', marginVertical: 12 }}>No members in this group.</Text>
                        )}

                        {editingGroup?.memberIds.map(memberId => {
                            const contact = contacts.find(c => c.id === memberId);
                            if (!contact) return null;
                            return (
                                <TouchableOpacity
                                    key={memberId}
                                    style={[GlobalStyles.remove_member_row, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}
                                    onPress={() => {
                                        removeMemberFromGroup(editingGroup.id, memberId);
                                        setEditingGroup(prev => prev
                                            ? { ...prev, memberIds: prev.memberIds.filter(id => id !== memberId) }
                                            : prev
                                        );
                                    }}
                                >
                                    <Text style={[GlobalStyles.remove_member_name, { color: colors.text }]}>{contact.name}</Text>
                                    <Text style={GlobalStyles.remove_member_x}>✕</Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity style={[GlobalStyles.modal_button, { backgroundColor: colors.accent, borderColor: colors.border, marginTop: 16 }]} onPress={() => setShowEditGroupModal(false)}>
                            <Text style={[GlobalStyles.modal_button_text, { color: colors.text }]}>Done</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*************************** Tab Switcher *******************************/}
            <View style={[GlobalStyles.tab_switcher, { borderColor: colors.border }]}>
                <TouchableOpacity
                    style={[GlobalStyles.tab_btn, { backgroundColor: colors.background }, activeTab === 'contacts' && { backgroundColor: colors.tabActive }]}
                    onPress={() => { setActiveTab('contacts'); setSearchText(''); }}
                >
                    <Text style={[GlobalStyles.tab_btn_text, { color: colors.text }]}>Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[GlobalStyles.tab_btn, { backgroundColor: colors.background }, activeTab === 'groups' && { backgroundColor: colors.tabActive }]}
                    onPress={() => { setActiveTab('groups'); setSearchText(''); }}
                >
                    <Text style={[GlobalStyles.tab_btn_text, { color: colors.text }]}>Groups</Text>
                </TouchableOpacity>
            </View>

            {/*************************** Search Bar *******************************/}
            <View style={[GlobalStyles.search_body, { backgroundColor: colors.tabActive }]}>
                <Text style={GlobalStyles.magnif_icon}>🔍</Text>
                <TextInput
                    style={[GlobalStyles.search_box, { backgroundColor: colors.card, color: colors.text }]}
                    placeholder={activeTab === 'contacts' ? 'Search Contacts' : 'Search Groups'}
                    placeholderTextColor={colors.border}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/*************************** Contacts Tab *******************************/}
            {activeTab === 'contacts' && (
                <View style={[GlobalStyles.contacts_body, { backgroundColor: colors.tabActive }]}>
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={[GlobalStyles.contact, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <View>
                                    <Text style={[GlobalStyles.contact_name, { color: colors.text }]}>{item.name}</Text>
                                    <Text style={[GlobalStyles.contact_name, { color: colors.text, opacity: 0.6 }]}>{item.phone}</Text>
                                    <Text style={[GlobalStyles.contact_name, { color: colors.text, opacity: 0.6 }]}>{item.email}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => router.push({ pathname: "./chat", params: { name: item.name } })}>
                                        <Text style={[GlobalStyles.menu_icon, { color: colors.text }]}>💬</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => openContactMenu(item)}>
                                        <Text style={[GlobalStyles.menu_icon, { color: colors.text }]}>⋮</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                </View>
            )}

            {/*************************** Groups Tab *******************************/}
            {activeTab === 'groups' && (
                <View style={[GlobalStyles.contacts_body, { backgroundColor: colors.tabActive }]}>
                    {filteredGroups.length === 0 ? (
                        <Text style={[GlobalStyles.empty_text, { color: colors.text, opacity: 0.5 }]}>
                            No groups yet. Add a contact to a group to get started.
                        </Text>
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
                                    <View style={[GlobalStyles.contact, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                        <View style={{ flex: 1 }}>
                                            <TouchableOpacity onPress={() => toggleGroupExpand(item.id)}>
                                                <Text style={[GlobalStyles.contact_name, { color: colors.text }]}>{item.name}</Text>
                                                <Text style={[GlobalStyles.group_member_count, { color: colors.text, opacity: 0.6 }]}>
                                                    {item.memberIds.length} {item.memberIds.length === 1 ? 'member' : 'members'}  {isExpanded ? '▲' : '▼'}
                                                </Text>
                                            </TouchableOpacity>

                                            {isExpanded && (
                                                <ScrollView style={[GlobalStyles.member_dropdown, { backgroundColor: colors.background }]} nestedScrollEnabled>
                                                    {members.length === 0
                                                        ? <Text style={[GlobalStyles.empty_text, { color: colors.text, opacity: 0.5 }]}>No members.</Text>
                                                        : members.map(member => (
                                                            <Text key={member.id} style={[GlobalStyles.member_row, { color: colors.text }]}>
                                                                • {member.name}
                                                            </Text>
                                                        ))
                                                    }
                                                </ScrollView>
                                            )}
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => router.push({ pathname: "./chat", params: { name: item.name } })}>
                                                <Text style={[GlobalStyles.menu_icon, { color: colors.text }]}>💬</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => openGroupMenu(item)}>
                                                <Text style={[GlobalStyles.menu_icon, { color: colors.text }]}>⋮</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>
            )}

            {/*************************** Bottom Button *******************************/}
            <View style={GlobalStyles.buttons}>
                {activeTab === 'contacts' && (
                    <View style={[GlobalStyles.addContact_button_body, { backgroundColor: colors.background, borderColor: colors.border }]}>
                        <TouchableOpacity onPress={() => setOpenModal(true)}>
                            <Text style={[GlobalStyles.addContact_button, { color: colors.text }]}>➕ Add Contact</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

        </View>
    );

  /* ⋮  Menu Icon just in case */
}