import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'


const SearchResults = ({location}) => {
 if (location.state.search) {
    return ( 
    	<Layout> 
    	<h1>Search Results</h1>  
    	 <ul>
                      {/* eslint-disable-next-line react/destructuring-assignment */}
                        {location.state.search.map(page => (
                            <li key={page.id}>
                           {/* eslint-disable-next-line prefer-template, react/destructuring-assignment */}
                                <Link to={'/' + page.path} >{page.title}</Link>
                            </li>
                        ))}
                    </ul>
    	</Layout>)
  } 
   return (  
    <Layout>
    <h1>Search Results</h1>
    <p>No search was made</p>
    </Layout>
  )

}

export default SearchResults
