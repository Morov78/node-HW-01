const fs = require("fs").promises;
const path = require("path");
const colors = require("colors/safe");

const contactsPath = path.normalize("./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => console.table(JSON.parse(data)))
    .catch((err) => console.log(colors.red(err.message)));
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .then((data) => {
      const contactById = data.find((contact) => contact.id === contactId);

      if (contactById) {
        console.log(colors.blue(contactById));

        return;
      }

      throw new Error("Сontact with this id not present");
    })
    .catch((err) => console.log(colors.red(err.message)));
}
function addContact(name, email, phone) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .then((data) => {
      const lastContact = data[data.length - 1];
      const id = String(Number(lastContact.id) + 1);
      const newContact = { id, name, email, phone };

      fs.writeFile(contactsPath, JSON.stringify([...data, newContact]), "utf-8")
        .then(() => console.log(colors.blue("New contact added")))
        .catch((err) => console.log(colors.red(err.message)));
    })
    .catch((err) => console.log(colors.red(err.message)));
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .then((data) => {
      const indexRemoveContact = data.findIndex(
        (contact) => contact.id === contactId
      );

      if (indexRemoveContact >= 0) {
        data.splice(indexRemoveContact, 1);

        fs.writeFile(contactsPath, JSON.stringify(data), "utf-8").then(() =>
          console.log(colors.blue(`Contact with id=${contactId} deleted`))
        );

        return;
      }

      throw new Error("Сontact with this id not present");
    })
    .catch((err) => console.log(colors.red(err.message)));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
