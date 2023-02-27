import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';


interface Repo {
    id: string;
    name: string;
    description: string;
    url: string;
  }


const GET_REPOS = gql`
  query SearchRepositories($query: String!, $cursor: String) {
    search(query: $query, type: REPOSITORY, first: 10, after: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ... on Repository {
          id
          name
          description
          url
        }
      }
    }
  }
`;


function Repository() {
    const [searchQuery, setSearchQuery] = useState('');
    const [repos, setRepos] = useState<Repo[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [endCursor, setEndCursor] = useState<string | null>(null);
    const [error, setError] = useState(false);
 
    const [getRepos, { loading, data }] = useLazyQuery(GET_REPOS, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setRepos((prevRepos) => [...prevRepos, ...data.search.nodes]);
        setHasNextPage(data.search.pageInfo.hasNextPage);
        setEndCursor(data.search.pageInfo.endCursor);
      },
      onError: () => {
        setError(true);
      },
    });
    function searchRepos() {
        setRepos([]);
        setHasNextPage(false);
        setEndCursor(null);
        setError(false);
        getRepos({
          variables: { query: searchQuery },
        });
      }
      function loadMore() {
        getRepos({
          variables: { query: searchQuery, cursor: endCursor },
        });
      }


      return (
        <div>
          <input
          className='search'
            type='text'
            value={searchQuery}
            placeholder="Search Repositories"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchRepos}>Search</button>
          {error && <p>Error: Something went wrong.</p>}
          {loading && <p>Loading...</p>}
          <table >
            <thead>
            <tr>
      <th>Name</th>
      <th>Description</th>
      <th>URL</th>
    </tr>
  </thead>
  <tbody>
    {data?.search?.nodes?.map((repo: Repo) => (
      <tr key={repo.url}>
        <td>{repo.name}</td>
        <td>{repo.description}</td>
        <td>
          <a href={repo.url} target="_blank" rel="noopener noreferrer">
            {repo.url}
          </a>
        </td>
        </tr>
    ))}
  </tbody>
</table>
</div>
      )


   
}


// export default Repository;
export default Repository
