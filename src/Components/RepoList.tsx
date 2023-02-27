import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";


interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
}


interface QueryData {
  viewer: {
    repositories: {
      nodes: Repository[];
     
    };
  };
}


interface MutationData {
  addRepository: {
    repository: Repository;
   
  };
}


const GET_REPOSITORIES = gql`
  query GetRepositories {
    viewer {
      repositories(first: 20) {
        nodes {
          id
          name
          description
          url
        }
      }
    }
  }
`;


const ADD_REPOSITORY = gql`
  mutation AddRepository($name: String!, $description: String!, $url: String!) {
    addRepository(input: { name: $name, description: $description, url: $url }) {
      repository {
        id
        name
        description
        url
      }
    }
  }
`;


function RepoList() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const { loading, error, data } = useQuery<QueryData>(GET_REPOSITORIES);
  const [addRepository] = useMutation<MutationData>(ADD_REPOSITORY)






const handleAddRepository = async () => {
    const name = 'New Repository';
    const description = 'This is a new repository';
    const url = 'https://github.com/new-repository';


    try {
      const response = await addRepository({
        variables: { name, description, url },
        refetchQueries: [{ query: GET_REPOSITORIES }],
      });
      console.log('Added repository:', response.data?.addRepository);
    } catch (error) {
      console.error('Error adding repository:', error);
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addRepository({
      variables: { name, description, url },
    });
    setName("");
    setDescription("");
    setUrl("");
  };






  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;


  return (
    <div>


        <p className="heading">ADD A NEW REPOSITORY</p>


      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="submit" onClick={handleAddRepository}>Add Repository</button>
      </form>


      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {data?.viewer?.repositories?.nodes?.map((repository) => (
            <tr key={repository.id}>
              <td>{repository.name}</td>
              <td>{repository.description}</td>
              <td>
                <a href={repository.url} target="_blank" rel="noopener noreferrer">
                  {repository.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
          }


  export default RepoList;
