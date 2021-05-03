import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";

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
  mutation addBookmark($title: String!,$url: String!){
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

  const handleSubmit = () => {

    addBookmark({
      variables: {
        title: titleField.value,
        url: urlField.value
      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })
  }

  if (error) return <h2>Error</h2>;
  if (loading) return <h2>Loading...</h2>;
  console.log(data);

  return (
    <div>
      <label>
        Enter title: <br />
        <input type='text' ref={node => titleField = node} />
      </label>
      <br />
      <label>
        Enter url: <br />
        <input type='text' ref={node => urlField = node} />
      </label><br />
      <button onClick={handleSubmit}>Add Bookmark</button>
      <h1>Bookmarks</h1>

      <div>
        {data.bookmarks.map((el) => {
          return (
            <div>

              <h3>{el.title}</h3>
              <p>{el.url}</p>
            </div>
          )
        })}
      </div>
    </div>

  );
};

export default IndexPage;
