import deleteToDo from '@salesforce/apex/ToDoListController.deleteToDo';
import updateTodo from '@salesforce/apex/ToDoListController.updateTodo';
import { api, LightningElement } from 'lwc';
export default class ToDoItem extends LightningElement {
    @api todoId;
  @api todoName;
  @api done = false;
  @api index = -1;



    get containerClass() {
        return this.done ? "todo completed" : "todo upcoming";
      }

    get iconName(){
        return this.done ? "utility:check" : "utility:add";
    }
      updateTodoHandler(){
        const toDo={
            id:this.todoId,
            name:this.todoName,
            done:!this.done
        }
        updateTodo({payload:JSON.stringify(toDo)}).then((res)=>{
            console.log("updated successfully");
            const updateEvent=new CustomEvent('update');
            this.dispatchEvent(updateEvent);
        }).catch((error)=>{
            console.log("error in updating"+error.body.message);
        })
      }
      deleteTodoHandler(){
        deleteToDo({toDoId: this.todoId}).then((res)=>{
            console.log("deleted successfully"+res);
            const updateEvent=new CustomEvent('update');
            this.dispatchEvent(updateEvent);
        }).catch((error)=>{
            console.log("error in deleting"+error.body.message);
        })
      }
}