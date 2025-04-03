import axios from 'axios';
import {useQuery} from '@tanstack/react-query';


export interface Todo {
    id: number;
    title: string;
    userId: number;
    completed: boolean;
  }
  interface TodoQuery{
    page?:number,
    pageSize?:number,
  }

export const useTodos = (query:TodoQuery) => {
    const fetchTodos=()=>axios
    .get<Todo[]>('https://jsonplaceholder.typicode.com/todos',
      {
        params:{
          _start:((query.page ?? 1) - 1)*(query.pageSize?? 10),
          _limit:query.pageSize,
        }
      }
    )
    .then(res=>res.data);

    return useQuery<Todo[],Error>({
        queryKey:['todos'],
        queryFn:fetchTodos,
        staleTime:10*1000,
    }
      );
}

