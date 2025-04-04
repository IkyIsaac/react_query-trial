import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "./hooks/useTodos";
import axios from "axios";

const TodoForm = () => {
  const queryClient = useQueryClient();
  const addTodo = useMutation<Todo, Error, Todo>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((res) => res.data),
    onMutate:(newTodo: Todo)=>{
      queryClient.setQueryData<Todo[]>(['todos'],(todos)=>[
        newTodo,
        ...(todos||[])
      ])
    },
    onSuccess: (response, newTodo) => {
      // newData before being muted
      // OPTIONS TO UDATE THE LIST
      // 1. INVALIDATING THE CACHE
      // queryClient.invalidateQueries({
      //   queryKey: ['todos']
      // })

      // 2. UPDATING DATA IN THE CACHE
      queryClient.setQueryData<Todo[]>(['todos'],(todos)=>
      todos?.map((todo)=> todo===newTodo? response: todo));
      // queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
      //   response,
      //   ...(todos || []),
      // ]);
      if(ref.current) ref.current.value='';
    },
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
            <button disabled className="btn btn-primary">Adding...</button>
          ) : (
            <button className="btn btn-primary">Add</button>
          )}
        </div>
      </form>
    </>
  );
};

export default TodoForm;
