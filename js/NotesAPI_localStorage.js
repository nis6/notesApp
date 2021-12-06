//API communicating with local storage

export default class NotesAPI{
    //
    static getAllNotes(){
        //converts the local storage string into js object if empty then parses empty arra
        const notes=JSON.parse(localStorage.getItem("notesapp-notes")||"[]");
        console.log("notes array: "+notes)
        return notes.sort((a,b)=>{
            //sort notes array in descending order of date
            console.log(a.updated)
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(notesToSave){
        const notes=NotesAPI.getAllNotes();
        const existing=notes.find(note => note.id == notesToSave.id);

        if(existing){
            existing.title=notesToSave.title;
            existing.body=notesToSave.body;
            existing.updated=new Date().toISOString();
        }
        else{
            notesToSave.id=Math.floor(Math.random()*100000);
            notesToSave.updated=new Date().toISOString();
            notes.push(notesToSave);
        }
        
        localStorage.setItem("notesapp-notes",JSON.stringify(notes));
    }

    static deleteNote(id){
            const notes=NotesAPI.getAllNotes();
            const newNotes=notes.filter(note=>note.id!=id);

            localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
    
}
