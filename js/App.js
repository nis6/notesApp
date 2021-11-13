import NotesView from "./NotesView.js"
import NotesAPI from "./NotesAPI.js";

export default class App{

    constructor(root){
        
        //assign properties to app object
        this.notes=[];
        this.activeNote=null;
        //assign View instance to the app object
        this.view= new NotesView(root,this.handlers());//why passing a function instead of an object/collection of functions- just to make the call shorter- same thing!
        //make an API call to local storage and store the notes as app object's property
        this.refreshNotes();
    }

    refreshNotes(){
        const notes = NotesAPI.getAllNotes();
        //set up notes in app object from local storage
        this.setNotes(notes);
        if(notes.length > 0){
            this.setActiveNote(notes[0]);
        }
    }

    setNotes(notes){
        this.notes=notes;//assign notes to app object
        this.view.updateNoteList(notes);//set up the notes in DOM and add event listeners
        this.view.updateNotesPreviewVisibility(notes.length>0);//only show previwew if there is at least one note
    }

    setActiveNote(note){
        this.activeNote= note;
        this.view.updateActiveNote(note);//visible note-selection in side-bar and set the preview to Active note
    }

    handlers(){
        return{
            //arrow function doesn't have its own binding for 'this'
            //so this retains the value of enclosing lexical context's this 
            onNoteSelect: noteId=>{
                const selectedNote=this.notes.find(note=>note.id==noteId);
                this.setActiveNote(selectedNote);
            },

            onNoteAdd: ()=>{
               const newNote= {
                   title:"New Note",
                   body: "Take a Note"
               }

               NotesAPI.saveNote(newNote);
               this.refreshNotes();
            },

            onNoteEdit: (title,body)=>{
               NotesAPI.saveNote({
                 id: this.activeNote.id,
                 title,
                 body  
               });
               this.refreshNotes();
               const note=this.notes.find(note=>note.id==this.activeNote.id);
               this.view.moveEditedNote(note);
            },
            onNoteDelete: noteId=>{
                NotesAPI.deleteNote(noteId);
                this.refreshNotes();
            }
        }
    }
}
    