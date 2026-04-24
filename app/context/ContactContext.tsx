import React, { createContext, useContext, useState } from 'react';

/* Used for managing contact and group data for other screens to access */

type Contact = {
    id: string;
    name: string;
    phone: string;
    email: string;
}

type Group = {
    id: string;
    name: string;
    memberIds: string[]; // stores contact ids
}


type ContactsContextType = {
    // Single Contacts
    contacts: Contact[];
    addContact: (contact: Omit<Contact, 'id'>) => void;
    deleteContact: (id: string) => void;
    editContact: (id: string, updated: Omit<Contact, 'id'>) => void;
    // Groups of contacts
    groups: Group[];
    addGroup: (name: string, memberIds: string[]) => void;
    deleteGroup: (id: string) => void;
    addToGroup: (groupId: string, contactId: string) => void;
    removeMemberFromGroup: (groupId: string, contactId: string) => void;
}

const ContactsContext = createContext<ContactsContextType | null>(null);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
    const [contacts, setContacts] = useState<Contact[]> ([
        { id: '1', name: 'Bhaarat Mohanta', phone: '555-3215', email: 'Bhamoh321@email.com'},
        { id: '2', name: 'Daniel Martinez', phone: '555-1524', email: 'danmar123@email.com'},
        { id: '3', name: 'Gabe Lemus', phone: '555-9210', email: 'gablem22@email.com'},
        { id: '4', name: 'Jason Insalaco', phone: '555-8845', email: 'jasins92@email.com'},
        { id: '5', name: 'Justin Leon', phone: '555-9574', email: 'jusleo25@email.com'},
        { id: '6', name: 'Alice Smith',    phone: '555-1234', email: 'alice@email.com' },
        { id: '7', name: 'Bob Jones',      phone: '555-5678', email: 'bob@email.com'   },
        { id: '8', name: 'Clara Lee',      phone: '555-9012', email: 'clara@email.com' },
        { id: '9', name: 'David Martinez', phone: '555-3456', email: 'david@email.com' },
    ]);

    const [groups, setGroups] = useState<Group[]>([]);

    const addContact = (contact: Omit<Contact, 'id'>) => {
        setContacts(prev => [...prev, { ...contact, id: Date.now().toString() }]);
    };

    const deleteContact = (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id));
        // Also remove this contact from any groups they were in
        setGroups(prev => prev.map(g => ({
            ...g,
            memberIds: g.memberIds.filter(mid => mid !== id)
        })));
    };
    
    const editContact = (id: string, updated: Omit<Contact, 'id'>) => {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    };

    /******************************* Contact Groups *******************************/
    const addGroup = (name: string, memberIds: string[]) => {
        setGroups(prev => [...prev, { id: Date.now().toString(), name, memberIds }]);
    };

    const deleteGroup = (id: string) => {
        setGroups(prev => prev.filter(g => g.id !== id));
    };

    const addToGroup = (groupId: string, contactId: string) => {
        setGroups(prev => prev.map(g =>
            g.id === groupId && !g.memberIds.includes(contactId)
                ? { ...g, memberIds: [...g.memberIds, contactId] }
                : g
        ));
    };

    const removeMemberFromGroup = (groupId: string, contactId: string) => {
        setGroups(prev => prev.map(g =>
            g.id === groupId
                ? { ...g, memberIds: g.memberIds.filter(id => id !== contactId) }
                : g
        ));
    };

    return (
        <ContactsContext.Provider value={{ 
            contacts,
            addContact,
            deleteContact,
            editContact,
            groups,
            addGroup,
            deleteGroup,
            addToGroup,
            removeMemberFromGroup }}>
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

export type { Contact, Group };

