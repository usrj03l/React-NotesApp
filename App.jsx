import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { notesCollection, db } from "./firebase";
import { onSnapshot, doc, addDoc, deleteDoc, updateDoc, query, orderBy, getDocs } from "firebase/firestore";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");
  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setNotes(data);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  React.useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => clearTimeout(timeoutID);
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const docRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(docRef.id);
  }

  async function updateNote(text) {
    setTempNoteText(text);
    const docRef = doc(db, "Notes", currentNoteId);
    await updateDoc(docRef, { body: text, updatedAt: Date.now() });
  }

  function deleteNote(noteId) {
    deleteDoc(doc(db, "Notes", noteId));
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar notes={sortedNotes} currentNote={currentNote} setCurrentNoteId={setCurrentNoteId} newNote={createNewNote} deleteNote={deleteNote} />
          {<Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
