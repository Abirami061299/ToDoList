public with sharing class ToDoListController {
    public ToDoListController() {

    }


    @AuraEnabled
    public static void addToDo(String payload){
        try {
            ToDo payloadObj=(ToDo) JSON.deserialize(payload,ToDo.class);
            ToDo_Items__c newTodo = new ToDo_Items__c(Name=payloadObj.name,Done__c	=payloadObj.done);
            insert newTodo;
            
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateTodo(String payload){
        try {
            ToDo payloadObj=(ToDo) JSON.deserialize(payload,ToDo.class);
            ToDo_Items__c newTodo = new ToDo_Items__c(Id=payloadObj.id,Name=payloadObj.name,Done__c	=payloadObj.done);
            update newTodo;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteToDo(String toDoId){
        try {
            ToDo_Items__c newTodo = new ToDo_Items__c(Id=toDoId);
            delete newTodo;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ToDo> getAllToDos(){
        try {
            List<ToDo_Items__c> todos= [SELECT Id,Name,Done__c,CreatedDate	 FROM ToDo_Items__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC];
            return getToDos(todos);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<ToDo> getcurrentToDos(){
        try {
            List<ToDo_Items__c> todos= [SELECT Id,Name,Done__c,CreatedDate	 FROM ToDo_Items__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC];
            // return todos;
             return getToDos(todos);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

      //Wrap ToDo__c SObject into ToDo object
    public static List<ToDo> getToDos(List<ToDo_Items__c> objs) {
    List<ToDo> todos = new List<ToDo>();
    for (ToDo_Items__c obj : objs) {
      ToDo todo = new ToDo();
      todo.id = obj.Id;
      todo.name = obj.Name;
      todo.createdDate =Date.valueOf(obj.CreatedDate);
      todo.done = obj.Done__c;
      todos.add(todo);
    }

    return todos;
  }


    class ToDo{
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Boolean done;
        @AuraEnabled
        public Date createdDate;
    }
}