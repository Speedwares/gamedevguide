import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { Layout as AntdLayout } from 'antd'
import Header from '../Header'
import siteCfg from '../../../SiteCfg'

import SidebarContents from '../SidebarContents'
import TableOfContents from '../TableOfContents'

const { Content: AntdContent } = AntdLayout

class RootLayout extends Component {
  state = {
    collapsed: false,
    leftMargin: 0,
    sidebarActive: true
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
        // eslint-disable-next-line react/destructuring-assignment
     if (this.state.sidebarActive === false){
      this.setState({
        leftMargin: 0
      });
    }
  }


  toggle = (collapsedState) => {
    this.setState({
      collapsed: collapsedState,
    });
       // eslint-disable-next-line react/destructuring-assignment
    if (collapsedState || this.state.sidebarActive === false){
      this.setState({
        leftMargin: 0
      });
       // eslint-disable-next-line react/destructuring-assignment
    } else if((!collapsedState) && (window.innerWidth > 620) && (this.state.sidebarActive === true)) {
      // eslint-disable-next-line react/destructuring-assignment
      console.log(this.state.sidebarActive)
      this.setState({
        leftMargin: siteCfg.theme.sidebarMenuWidth
      });
    } else {
    	this.setState({
        leftMargin: 250
      });
    }
  }

  hideSidebar = (sidebarState) =>{
    console.log('reahed')
    this.setState({
      sidebarActive: sidebarState
    });
    if(sidebarState){
    console.log('fdsf')
    this.setState({
      leftMargin: 0
    });
    }else{
      this.setState({
      leftMargin: 0
    });
    }
   
    // eslint-disable-next-line react/destructuring-assignment
    console.log(this.state.leftMargin)
  }

  resize (){
    const currentHideNav = (window.innerWidth <= 760);
    this.toggle(currentHideNav)
  }

  render() {
    return (
      <StaticQuery
        query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            siteNavTitle
            siteTitleLong
            siteDescription
            siteKeywords
          }
        }
      }
    `}
        render={data => {
          const { siteNavTitle, siteTitleLong, siteDescription, siteKeywords } = data.site.siteMetadata
          const { children, sidebarRoot } = this.props
          const { collapsed, leftMargin, sidebarActive } = this.state
          return (
            <AntdLayout>
              <Helmet
                title={siteTitleLong}
                meta={[
                  { name: 'description', content: siteDescription },
                  { name: 'keywords', content: siteKeywords },
                ]}
              >
                <html lang="en" />
              </Helmet>

              <AntdLayout>
                <SidebarContents sidebarRoot={sidebarRoot} collapsed={collapsed} leftMargin={leftMargin} removeSidebar = {this.hideSidebar} />
                {/* eslint-disable-next-line react/destructuring-assignment */}
                <AntdLayout style={{ marginLeft: this.state.leftMargin }}>
                  <Header siteNavTitle={siteNavTitle} headerCollapsed={this.toggle} collapsed={collapsed} sidebarActive={sidebarActive} />
                  <AntdLayout>
                    <AntdContent
                      style={{
                        background: '#fff',
                        padding: 48,
                      }}
                    >
                      {children}
                    </AntdContent>
                    <TableOfContents />
                  </AntdLayout>
                </AntdLayout>
              </AntdLayout>
            </AntdLayout>
          )
        }}
      />
    )
  }
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

// const mapDispatchToProps = {
//  // setPostPageOn,
//  // setPostPageOff,
//  onSetSidebarDocked
// }

// export default connect(()=>({}), mapDispatchToProps) (RootLayout)
export default RootLayout
