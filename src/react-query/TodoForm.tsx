import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "./hooks/useTodos";
import axios from "axios";

interface AddTodoContext {
  previousTodos: Todo[];
}

const TodoForm = () => {
  const queryClient = useQueryClient();
  // useMutation helps to perform Opmistic Update while waiting for server response
  const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
    // AddTodoContext assigns type for the returned data. If no return it returns an error( The returned data is what we use as Context in onError())
    // 1st generic-> Type of the data returned from the mutation function
    // 2nd generic-> Type of the error
    // 3rd generic-> Type of the variables passed to the mutation function
    // 4th generic-> Type of the context returned from onMutate
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todosa", todo)
        .then((res) => res.data),
    onMutate: (newTodo: Todo) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        newTodo,
        ...(todos || []),
      ]);

      return { previousTodos };
    },
    onSuccess: (response, newTodo) => {
      // newData before being muted
      // OPTIONS TO UDATE THE LIST
      // 1. INVALIDATING THE CACHE
      // queryClient.invalidateQueries({
      //   queryKey: ['todos']
      // })

      // 2. UPDATING DATA IN THE CACHE
      queryClient.setQueryData<Todo[]>(["todos"], (todos) =>
        todos?.map((todo) => (todo === newTodo ? response : todo))
      );
      // queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
      //   response,
      //   ...(todos || []),
      // ]);
      if (ref.current) ref.current.value = "";
    },
    onError:(error,newTodo, context)=>{
      // Rollback the optimistic update
      if(!context) return;
      queryClient.setQueryData<Todo[]>(['todos'],context.previousTodos);
    }
  });
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      {addTodo.error && (
        <div className="alert alert-danger">{addTodo.error.message}</div>
      )}
      <form
        className="row mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (ref.current && ref.current.value)
            addTodo.mutate({
              id: 0,
              title: ref.current?.value,
              completed: false,
              userId: 1,
            });
        }}
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          {addTodo.isLoading ? (
            <button disabled className="btn btn-primary">
              Adding...
            </button>
          ) : (
            <button className="btn btn-primary">Add</button>
          )}
        </div>
      </form>
    </>
  );
};

export default TodoForm;
