import { useRef } from "react";
import useAddTodos from "./hooks/useAddTodos";



const TodoForm = () => {

  const addTodo= useAddTodos(()=>{
            if (ref.current) ref.current.value = "";
  })
  
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
