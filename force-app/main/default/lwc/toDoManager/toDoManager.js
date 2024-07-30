import addToDo from '@salesforce/apex/ToDoListController.addToDo';
import getcurrentToDos from '@salesforce/apex/ToDoListController.getcurrentToDos';
import { LightningElement, track } from 'lwc';

export default class ToDoManager extends LightningElement {
    @track time='';
    @track greeting='';
    @track task='';
    @track toDoLists=[];
    @track completedTasks=[];
    @track upcomingTasks=[];

    connectedCallback(){
       this.getTime();
       this.startTimeUpdate();
       this.fetchToDos();
    }

    disconnectedCallback() {
        this.stopTimeUpdate(); // Clear the interval when the component is removed
    }

   fetchToDos(){
    getcurrentToDos().then((result)=>{
        if(result){
            this.toDoLists=result;
            console.log(this.toDoLists);
        }
    
      
   }).catch((error)=>{
         console.log("Error in fetching todos"+error.body.message);
   });
}
 
    stopTimeUpdate() {
        // Clear the interval to stop updating when the component is removed
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    startTimeUpdate() {
        // Update time and greeting every minute
        this.intervalId = setInterval(() => {
            this.getTime();
        }, 60000); // 60000 milliseconds = 1 minute
    }
    getTime(){
        const today=new Date();
        const hour=today.getHours();
        const min=today.getMinutes();
        
        this.time=`${this.setHour(hour)}:${this.setMin(min)} ${this.setSuffix(hour)}`;
    
        this.greeting=this.setGreeting(hour);
    }

    setSuffix(hour){
        return hour>12 ? 'PM': 'AM';
    }

   
    
    setMin(min){
        return min<10 ? '0'+min:min;
    }

    setHour(hour){
        return hour ===0? 12:hour>12? hour-12:hour;
    }

  setGreeting(hour) {
        let greeting;
    
        if (hour >= 0 && hour < 12) {
            greeting = 'Good morning!';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon!';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good evening!';
        } else if (hour >= 21 && hour < 24) {
            greeting = 'Good night!';
        } else {
            greeting = 'Invalid hour!';
        }
    
        return greeting;
    }

    getTask(event){
      this.task=event.target.value;
    }
    
    addTodoHandler(){
        console.log(this.task);
        const todo={
            name:this.task,
            done:false,
        }
        addToDo({payload:JSON.stringify(todo)}).then((response)=>{
            console.log(response);
            this.fetchToDos();
        }).catch((error)=>{
            console.log("error in inserting"+ error);
        });
        // this.toDoLists.push(todo);
        this.task='';
    }

    updateTodoHandler(event){
        const index = event.target.dataset.index;
        this.toDoLists[index].done=!this.toDoLists[index].done;
    }

    deleteTodoHandler(event){
        const index = event.target.dataset.index;

        this.toDoLists.splice(index,1);
    }

    get upcomingTodos() {
        return this.toDoLists && this.toDoLists.length
          ? this.toDoLists.filter(todo => !todo.done)
          : [];
      }
    
      // get property to return completed todos
      get completedTodos() {
        return this.toDoLists && this.toDoLists.length
          ? this.toDoLists.filter(todo => todo.done)
          : [];
      }
    
}