import { useQuery } from "@tanstack/react-query";
import axios from "axios"
interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

interface PostQuery{
    page?:number,
    pageSize?:number,
}

export const usePosts = (query:PostQuery) => {
    const fetchPosts=()=>axios
    .get<Post[]>('https://jsonplaceholder.typicode.com/posts',{
        params:{
            _start: ((query.page ?? 1) - 1) * (query.pageSize ?? 10),
            _limit:query.pageSize
        }
    })
    .then(res=>res.data);

    return useQuery<Post[],Error>({
        queryKey:['posts',query],
        queryFn:fetchPosts,
        staleTime:10*1000,
        keepPreviousData:true,
    })
}

