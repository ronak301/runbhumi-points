import React, { useState } from "react";

const ContactPicker = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSelectContacts = async () => {
    try {
      const contacts = await navigator.contacts.select(["name", "email"], {
        multiple: true,
      });
      setSelectedContacts(contacts);
    } catch (error) {
      console.error("Failed to select contacts:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSelectContacts}>Select Contacts</button>
      <ul>
        {selectedContacts.map((contact, index) => (
          <li key={index}>
            <strong>Name:</strong> {contact.name}
            <br />
            <strong>Email:</strong> {contact.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactPicker;
