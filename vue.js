Vue.filter('date',time=>moment(time).format('DD/MM/YY, HH:MM'))
var app=new Vue({
    el:".container",
    data(){
        return{
            notes:JSON.parse(localStorage.getItem('notes'))||[],
            selectedId:localStorage.getItem('selectedId')||null,
        }
    },
  
    watch:{
        notes:{
            handler:'saveNotes',
            deep:true
        },
        selectedId(val){
            return localStorage.setItem('selectedId',val)
        }
    },
    computed:{
        notePreview(){
                return this.selectedNote ? marked(this.selectedNote.content):''
        },
        notesNumber(){
            return this.notes.length
        },
        selectedNote(){
            return this.notes.find(note=>note.id===this.selectedId)
        },
        sortedNotes(){
            return this.notes.slice()
            .sort((a,b)=>a.created - b.created)
            .sort((a,b)=>(a.favorite===b.favorite)?0: a.favorite?-1:1)
        },
        linesCount(){
            if(this.selectedNote){
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },
        wordsCount(){
            if(this.selectedNote){
                var s=this.selectedNote.content
                s=s.replace(/\n/g,' ')
                s=s.replace(/(^\s*)|(\s*$)/gi,'')
                s=s.replace(/\s\s+/gi,' ')
                return s.split(' ').length
            }
        },
        charactersCount(){
            if(this.selectedNote){
                return this.selectedNote.content.split('').length
            }
        }
    },
    methods:{
        addNote(){
            const time=Date.now()
            const note={
                id:String(time),
                title:"This is note n° " + (this.notes.length+1),
                content:"Note's Content "+ (this.notes.length+1),
                created:time,
                favorite:false
            }
            this.notes.push(note)
        },
        selectId(note){
            this.selectedId=note.id
        },
        saveNotes(){
            localStorage.setItem('notes',JSON.stringify(this.notes))
        },
        removeNote(){
            if(this.selectedNote){
                const index=this.notes.indexOf(this.selectedNote)
                if(index!==-1){
                    this.notes.splice(index,1)
                    if(this.notes[0].id){
                        this.selectedId=this.notes[0].id
                    }
                }
            }
        },
        favoriteNote(){
            this.selectedNote.favorite=!this.selectedNote.favorite
        }

    }
})
