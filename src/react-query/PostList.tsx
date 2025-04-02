import axios from 'axios';
import { useEffect, useState } from 'react';
import { usePosts } from './hooks/usePosts';



const PostList = () => {
  const [page,setPage]=useState(1);
  const pageSize =10;
  const {data:posts,error,isLoading}=usePosts({page, pageSize});


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
    <ul className="list-group">
      {posts?.map((post) => (
        <li key={post.id} className="list-group-item">
          {post.title}
        </li>
      ))}
    </ul>
    <button className="btn btn-primary mt-3" disabled={page===1} onClick={()=>setPage(page-1)}>Previous</button>
    <span className="mx-2 mt-3">{page}</span>
    <button className="btn btn-primary mt-3" onClick={()=>setPage(page+1)}>Next</button>
    </>
  );
};

export default PostList;
