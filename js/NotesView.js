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
                                    <div class="editor">
                                        <input type="text" class="notes-title" placeholder="Your Title...">
                                        <div class="text-body">
                                            <textarea class="notes-body" placeholder="Start writing your notes here..."></textarea>
                                        </div>
                                    </div>
                
                                    <div class="tool-bar">
                                        <button class="check-box">Check-box</button>
                                        <button class="list">List</button>
                                        <button class="image">Image</button>
                                        <button class="table">Table</button>
                                    </div>
                                </div>`

            const btnAddNote=this.root.querySelector(".addnotes");
            const btnCheckbox=this.root.querySelector(".check-box");
            const btnList=this.root.querySelector(".list");
            const btnImage=this.root.querySelector(".image");
            const btnTable=this.root.querySelector(".table");

            const editor=this.root.querySelector(".editor");
            const textbody=this.root.querySelector(".text-body");
            const inpTitle=this.root.querySelector(".notes-title");
            const inpBody=this.root.querySelector(".notes-body");
           
            btnAddNote.addEventListener("click",onNoteAdd);
            btnCheckbox.addEventListener("click",()=>{
                textbody.insertAdjacentHTML("beforeend",`
                    <div class="tool-container" id="checkbox-div">
                    ${this.ToolItemHTML["checkbox"]}
                    </div>
                `)  

                updateScroll();
            });

            btnList.addEventListener("click",()=>{
                textbody.insertAdjacentHTML("beforeend",`
                    <div class="tool-container" id="list-div">
                    ${this.ToolItemHTML["list"]}
                    </div>
                `)  

                updateScroll();
            });

            btnImage.addEventListener("click",()=>{
                textbody.insertAdjacentHTML("beforeend",`
                    <div class="tool-container" id="image-div">
                       <input type="file" id="imgInput" name="fileInput"/ style="height:0px;overflow:hidden">
                       <img id="imgOutput" width="100%" >
                    </div>`
                ) 
                //to display image 
                let outImage=this.root.querySelector("#imgOutput");
                //invisible tag to take input as an image file
                let inImage=this.root.querySelector("#imgInput");
                inImage.addEventListener("change", (e)=>{
                    //set the src tag for display img tag url 
                    outImage.src=URL.createObjectURL(e.target.files[0]); //creates a url using the object passed
                })
                //bind click on image button to input-file tag
                inImage.click();
                //to free up memory
                URL.revokeObjectURL() 

                updateScroll();
            });

            btnTable.addEventListener("click",()=>{
                editor.insertAdjacentHTML("beforeend",`
                    <div class="tool-container" id="table-div">
                    ${this.ToolItemHTML["table"]}
                    </div>
                `)  
                updateScroll();
            })

            const inpfields=[inpTitle,inpBody];// doesnt work on directly applying foreach
            inpfields.forEach(inpfield => {
                inpfield.addEventListener("blur",()=>{
                    const updatedTitle=inpTitle.value.trim();
                    const updatedBody=inpBody.value.trim();
                    this.onNoteEdit(updatedTitle,updatedBody);
                }); 
            });
            this.updateNotesPreviewVisibility(false);

    }


    updateScroll(){
        var element = document.getElementById(".editor");
        element.scrollTop = element.scrollHeight;
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

    ToolItemHTML={
        checkbox:   `<label class="form-control"> <input type="checkbox" name="checkbox" /> </label>
                     <textarea class="notes-body" placeholder="task..."></textarea>`,

        list:    `<label class="form-control"><li></li><textarea class="notes-body" placeholder="list item..."></textarea></label> `,

        table:   `<input type="checkbox" id="checkbox" value="HTML"><span class="checkmark"></span>
                     <label for="html"><textarea class="notes-body" placeholder="task..."></textarea></label>`

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