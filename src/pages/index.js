import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Loader from "react-loader-spinner";
import './index.css';

const GET_BOOKMARKS = gql`
  {
    bookmarks {
      id
      title
      url
    }
  }
`;
const ADD_BOOKMARK = gql`
  mutation addBookmar($title: String!,$url: String!){
    addBookmark(title: $title,url: $url){
      id
    }
  }
`;
const IndexPage = () => {
  let titleField;
  let urlField;
  const { error, loading, data } = useQuery(GET_BOOKMARKS);
  const [addBookmark] = useMutation(ADD_BOOKMARK);

  const handleSubmit = (e) => {
    e.preventDefault();
    addBookmark({
      variables: {
        title: titleField.value,
        url: urlField.value
      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })
  }

  if (error) return <h2>{error}</h2>;
  if (loading) return <center style={{ marginTop: '40vh' }}>
    <Loader
      type="Watch"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={3000} //3 secs
    />
  </center>


  return (
    <div className='main'>
      <div className='part1'>
        <h1 style={{ position: 'absolute', top: '5%' }}>Add Bookmark</h1>

        <label>
          Enter title <br />
          <input type='text' ref={node => titleField = node} />
        </label>
        <br />
        <label>
          Enter url <br />
          <input type='text' ref={node => urlField = node} />
        </label><br />
        <button className='btn' onClick={handleSubmit}>Add Bookmark</button>
      </div>

      <div className='part2'>
        <h1 style={{ marginTop: '5%', color: '#555' }}>Bookmarks list</h1>
        {data.bookmarks.map((el, ind) => {
          return (
            <div className='list' key={ind}>
              <h3>{el.title}</h3>
              <br />
              <p>{el.url}</p>
            </div>
          )
        })}
      </div>
    </div>

  );
};

export default IndexPage;
