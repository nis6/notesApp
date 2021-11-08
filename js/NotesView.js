export default class NotesView{
    constructor(root, {onNoteSelect,onNoteAdd,onNoteEdit,onNoteDelete}={}/*empty obj incase no functino obj passed to the class*/ ){
            this.root=root;
            this.onNoteSelect=onNoteSelect;
            this.onNoteAdd=onNoteAdd;
            this.onNoteDelete=onNoteDelete;
            this.onNoteEdit=onNoteEdit;
            this.root.innerHTML=`<div class="notes-sidebar">
                                    <button class="addnotes" type="button">Add Notes</button>
                                    <div class="notes-list"></div>
                                </div>

                                <div class="notes-preview">
                                    <input type="text" class="notes-title" placeholder="Your Title...">
                                    <textarea class="notes-body" placeholder="Start writing your notes here..."></textarea>
                                </div>`

            const btnAddNote=this.root.querySelector(".addnotes");
            const inpTitle=this.root.querySelector(".notes-title");
            //console.log("input title"+inpTitle.value);
            const inpBody=this.root.querySelector(".notes-body");
            //console.log("input body"+inpBody.value);
            btnAddNote.addEventListener("click",()=>{
                this.onNoteAdd();
            })


            const inpfields=[inpTitle,inpBody];// doesnt work on directly applying foreach
            inpfields.forEach(inpfield => {
                inpfield.addEventListener("blur",()=>{
                    console.log("input value"+ inpTitle.value);
                    console.log("input value"+ inpBody.value);
                    const updatedTitle=inpTitle.value.trim();
                    const updatedBody=inpBody.value.trim();
                    this.onNoteEdit(updatedTitle,updatedBody);
                }); 
            });

            this.updateNotesPreviewVisibility(false);

    }

    createListItemHTML(id, title, body, updated){
        const Maxbodylength=60;
        //NOTE: note.id is embedded  an extra data- attribute inside html note-container using [data-note-id ="${id}"]
        return `
            <div class="notes-list-item"  data-note-id ="${id}">
                <div class="notes-mini-title">${title}</div>
                <div class="notes-mini-body">
                    ${body.substring(0,Maxbodylength)}
                    ${body.length> Maxbodylength? "...":""}
                </div>
                <div class="notes-mini-updated">
                    ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
                </div>
            </div>
        `
    }
    

    //pass the notes  from localstorage collected via (Notes)API 
    updateNoteList(notes){
        const notesListContainer= this.root.querySelector(".notes-list");
          
        notesListContainer.innerHTML="";

        //insert list-item in the empty html container using content from localstorage
        for(const note of notes){
            const html= this.createListItemHTML(note.id, note.title,note.body, new Date(note.updated));//optimise this and pass note instead all one at a time
            notesListContainer.insertAdjacentHTML("beforeend",html);
        }

        //Add select.delete events for each of the list item 
         notesListContainer.querySelectorAll(".notes-list-item").forEach(noteListItem => {//????try passing the onSelect function directly????
             noteListItem.addEventListener("click", ()=>{
                 //use html note-container-id [data-note-id] to apply event listeners ***************************************
                 this.onNoteSelect(noteListItem.dataset.noteId);//data attribute in HTML, attr name gets converted to camelcase
             });

             noteListItem.addEventListener("dblclick",()=> {
                 const Delete=confirm("Are you sure you want to delete this note?");
                 console.log('delete: '+Delete);
                 if(Delete){
                     this.onNoteDelete(noteListItem.dataset.noteId);//note object id not the div container id which is note.id
                 }
             })
         });


    }
    
    //to apply on selected note
    updateActiveNote(note){
        //set the preview to active note
        this.root.querySelector(".notes-title").value=note.title;
        this.root.querySelector(".notes-body").value=note.body;

        this.root.querySelectorAll(".notes-list-item").forEach(noteListItem=>{
            noteListItem.classList.remove("notes-list-item-selected");
        });
        //extract the note id from json object of note and match it with the data attribute of html note container
        this.root.querySelector(`.notes-list-item[data-note-id="${note.id}"]`).classList.add("notes-list-item-selected");
    }


    updateNotesPreviewVisibility(visible){
        this.root.querySelector(".notes-preview").style.visibility = visible ? "visible": "hidden";
    }

    

}