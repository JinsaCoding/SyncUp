import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalThemes } from './styles';

type Contact = {
    id: string;
    name: string;
    phone: string;
    email: string;

}

type ContactsContextType = {
    contacts: Contact[];
    addContact: (contact: Omit<Contact, 'id'>) => void;
    deleteContact: (id: string) => void;
    editContact: (id: string, updated: Omit<Contact, 'id'>) => void;
}

const ContactsContext = createContext<ContactsContextType | null>(null);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
    const [contacts, setContacts] = useState<Contact[]> ([
        { id: '1', name: 'Alice Smith',    phone: '555-1234', email: 'alice@email.com' },
        { id: '2', name: 'Bob Jones',      phone: '555-5678', email: 'bob@email.com'   },
        { id: '3', name: 'Clara Lee',      phone: '555-9012', email: 'clara@email.com' },
        { id: '4', name: 'David Martinez', phone: '555-3456', email: 'david@email.com' },
    ]);

    const addContact = (contact: Omit<Contact, 'id'>) => {
        setContacts(prev => [...prev, { ...contact, id: Date.now().toString() }]);
    };

    const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    };

    const editContact = (id: string, updated: Omit<Contact, 'id'>) => {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    };

    return (
        <ContactsContext.Provider value={{ contacts, addContact, deleteContact, editContact }}>
        {children}
        </ContactsContext.Provider>
    );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (!context){
    throw new Error('useContacts must be used within a ContactsProvider');
  } 
  return context;
}



export default function SocialScreen() {
    const { contacts, addContact, editContact } = useContacts();
    const router = useRouter();

    const [openModal, setOpenModal] = useState(false);

    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);

    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedPhone, setEditedPhone] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    const [searchText, setSearchText] = useState('');

    const insets = useSafeAreaInsets();
    const colors = GlobalThemes['dark'];

    // Filter contacts based on search text either matching name, phone, or email
    const fileredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.phone.includes(searchText) ||
        c.email.toLowerCase().includes(searchText.toLowerCase())
    );

    function openEditModal(contact: Contact) {
        setEditingContact(contact);
        setEditedName(contact.name);
        setEditedPhone(contact.phone);
        setEditedEmail(contact.email);
        setShowEditModal(true);
    }

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

    function handleEditContact() {
        if (!editingContact || !editedName.trim()) {
            return;
        }

        editContact(editingContact.id, {
             name: editedName,
             phone: editedPhone,
             email: editedEmail
        });

        setShowEditModal(false);
    }

    /* ➕ */

    return (
        <View style={[styles.body, { paddingBottom: insets.bottom }, { backgroundColor: colors.background }]}>
            {/* <Text style={styles.header_text}>
                Work In Progress!
            </Text>
            <View style={styles.header}>
                
            </View> */}

            {/* <View style={styles.modal_container}> */}
                {/*************************** Add Contact Modal *******************************/}
                <Modal visible={openModal} transparent={true} animationType="slide">
                    <TouchableOpacity style={styles.modal_content} onPress={() => setOpenModal(false)}>

                        <TouchableOpacity style={styles.modal_card} activeOpacity={1}>
                            <Text style={styles.modal_title}>Add Contact</Text>

                            <TextInput
                                style={styles.modal_input}
                                placeholder="Name"
                                value={newName}
                                onChangeText={setNewName}
                            />
                            <TextInput
                                style={styles.modal_input}
                                placeholder="Phone"
                                value={newPhone}
                                onChangeText={setNewPhone}
                            />
                            <TextInput
                                style={styles.modal_input}
                                placeholder="Email"
                                value={newEmail}
                                onChangeText={setNewEmail}
                            />
                            <TouchableOpacity style={styles.modal_button} onPress={handleAddContact}>
                                <Text style={styles.modal_button_text}>Add Contact</Text>
                            </TouchableOpacity>
                            <Text style={styles.modal_cancel} onPress={() => setOpenModal(false)}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        
                    </TouchableOpacity>
                </Modal>
                {/*************************** Edit Contact Modal *******************************/}
                <Modal visible={showEditModal} transparent={true} animationType="slide">
                    <TouchableOpacity style={styles.modal_content} onPress={() => setShowEditModal(false)}>
                        <TouchableOpacity style={styles.modal_card} activeOpacity={1}>
                            <Text style={styles.modal_title}>Edit Contact</Text>

                            <TextInput
                                style={styles.modal_input}
                                placeholder="Name"
                                value={editedName}
                                onChangeText={setEditedName}
                            />
                            <TextInput
                                style={styles.modal_input}
                                placeholder="Phone"
                                value={editedPhone}
                                onChangeText={setEditedPhone}
                            />
                            <TextInput
                                style={styles.modal_input}
                                placeholder="Email"
                                value={editedEmail}
                                onChangeText={setEditedEmail}
                            />
                            <TouchableOpacity style={styles.modal_button} onPress={handleEditContact}>
                                <Text style={styles.modal_button_text}>Save Changes</Text>
                            </TouchableOpacity>
                            <Text style={styles.modal_cancel} onPress={() => setShowEditModal(false)}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            {/*********************** Search Bar ***********************/}
            <View style={styles.search_body}>
                <Text style={styles.magnif_icon}>🔍</Text>
                <TextInput style={styles.search_box}
                placeholder='Search Contacts'
                value={searchText}
                onChangeText={setSearchText}
                />
            </View>
            {/********************* Contact List ***********************/}
            <View style={styles.contacts_body}>
                <FlatList
                    data={fileredContacts}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index}) => {
                        return (
                            <View style={styles.contact}>
                                <View>
                                    <Text>{item.name}</Text>
                                    <Text>{item.phone}</Text>
                                    <Text>{item.email}</Text>
                                </View>
                                {/* <Text style={styles.menu_icon}>💬</Text> */}

                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => openEditModal(item)}>
                                        <Text style={styles.menu_icon}>✏️</Text>
                                    </TouchableOpacity>
                                    {/* Should open a new screen for text messages */}
                                    <TouchableOpacity>
                                        <Text style={styles.menu_icon}>💬</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>

            <View style={styles.buttons}> 
                <View style={{backgroundColor: 'lightgrey', padding: 10, borderRadius: 10}}>
                    <TouchableOpacity onPress={() => setOpenModal(true)}>
                        <Text style={{fontSize: 18}}>➕ Add Contact</Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity>
                    <Text style={{fontSize: 18, color: 'blue'}}>✏️ Edit Contact</Text>
                </TouchableOpacity> */}

            </View>
        </View>
        
    );

    /* ⋮  Menu Icon just in case */
}
// All styles as of now are just for testing... I am no where near done
const styles = StyleSheet.create({
    header: {
        backgroundColor: 'lightgrey',
        margin: 5
    },

    search_body: {
        marginTop: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    magnif_icon: {
        fontSize: 18,
        margin: 8,
    },

    search_box: {
        flex: 1,
        flexShrink: 1,
        backgroundColor: "grey",
    },

    header_text: {
        flex: 2,
        fontSize: 24,
    },

    contacts_body: {
        margin: 10,
        backgroundColor: "grey",
        height: "80%",
    },

    contact: {
        backgroundColor: "darkgrey",
        margin: 5,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    menu_icon: {
        fontSize: 32,
        margin: 8
    }, 

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },

    body: {
        backgroundColor: "beige",
        height: "100%"
    },

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
        fontSize: 15,
        marginTop: 4,
    },
    

})