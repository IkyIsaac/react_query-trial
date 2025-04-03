import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTodos} from './hooks/useTodos';



const TodoList = () => {
  const pageSize=10;
  const [page,setPage]=useState(1);

  const {data:todos, error,isLoading} = useTodos({page,pageSize});


  if(isLoading) return <p>Loading...</p>;
  if(error) return<p>{error.message}</p>;

  return (
    <ul className="list-group">
      {todos?.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;


