import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Todo } from "./useTodos";
import  {CACHE_KEY_TODOS}  from "../constants";



interface AddTodoContext {
    previousTodos: Todo[];
  }
const useAddTodos = (onAdd:()=>void) => {
    // onAdd fx is used here to ensure separation of concerns by allowing the caller to decide what to do after the mutation is successful
    const queryClient = useQueryClient();
    // useMutation helps to perform Opmistic Update while waiting for server response
    return useMutation<Todo, Error, Todo, AddTodoContext>({
      // AddTodoContext assigns type for the returned data. If no return it returns an error( The returned data is what we use as Context in onError())
      // 1st generic-> Type of the data returned from the mutation function
      // 2nd generic-> Type of the error
      // 3rd generic-> Type of the variables passed to the mutation function
      // 4th generic-> Type of the context returned from onMutate
      mutationFn: (todo: Todo) =>
        axios
          .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
          .then((res) => res.data),
      onMutate: (newTodo: Todo) => {
        const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos=[]) => [
          newTodo,
          ...todos,
        ]);
  
        return { previousTodos };
      },
      onSuccess: (response, newTodo) => {
        // newData before being muted
        // OPTIONS TO UDATE THE LIST
        // 1. INVALIDATING THE CACHE
        // queryClient.invalidateQueries({
        //   queryKey: CACHE_KEY_TODOS
        // })
  
        // 2. UPDATING DATA IN THE CACHE
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
          todos?.map((todo) => (todo === newTodo ? response : todo))
        );
        // queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) => [
        //   response,
        //   ...(todos || []),
        // ]);

        onAdd();
      },
      onError:(error,newTodo, context)=>{
        // Rollback the optimistic update
        if(!context) return;
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS,context.previousTodos);
      }
    });
}

export default useAddTodos