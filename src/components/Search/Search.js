import React, { Component } from 'react'
import { Input as AntdInput,  Modal as AntdModal, Button as AntdButton } from 'antd'
import { Index } from 'elasticlunr'
import { Link } from 'gatsby'

const AntdSearch = AntdInput.Search;

// Search component
class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ``,
      results: [],
      loading: false,
      visible: false
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    // eslint-disable-next-line react/destructuring-assignment
    console.log(this.state.results)
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  getOrCreateIndex = () =>
    this.index
      ? this.index
      : // Create an elastic lunr index and hydrate with graphql query results
      // eslint-disable-next-line react/destructuring-assignment
      Index.load(this.props.searchIndex)

  search = evt => {
  const query = evt.target.value
  this.index = this.getOrCreateIndex()
  this.setState({
    query,
    // Query the index with search string to get an [] of IDs
    results: this.index
      .search(query, { expand: true }) // Accept partial matches
      // Map over each ID and return the full document
      .map(({ ref }) => this.index.documentStore.getDoc(ref)),
  })
  }

  render() {
  	const { visible, loading } = this.state;
    return (
      <div>
                  <AntdSearch
                      placeholder="type search text"
                      // eslint-disable-next-line react/destructuring-assignment
                      value={this.state.query}
                      // eslint-disable-next-line react/destructuring-assignment
                      onSearch={this.showModal}
                      // eslint-disable-next-line react/destructuring-assignment
                      onChange={this.search}
                      enterButton
                    />

      <div>
        <AntdModal
          visible={visible}
          title="Search Results"
          onCancel={this.handleCancel}
          footer={[
            <AntdButton key="back" onClick={this.handleCancel}>Close</AntdButton>,
               // eslint-disable-next-line react/destructuring-assignment
            <Link to='/searchresults' state={{ search: this.state.results }} key="submit"><AntdButton type='primary' >
              Show More
            </AntdButton></Link>,
          ]}>
                    <ul>
                      {/* eslint-disable-next-line react/destructuring-assignment */}
                        {this.state.results.slice(0, 5).map(page => (
                            <li key={page.id}>
                           {/* eslint-disable-next-line prefer-template, react/destructuring-assignment */}
                                <Link to={'/' + page.path} >{page.title}</Link>
                            </li>
                        ))}
                    </ul>
        </AntdModal>
      </div>
      </div>
    )
  }

}

export default Search
