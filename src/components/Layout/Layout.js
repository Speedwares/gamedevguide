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
    leftMargin: siteCfg.theme.sidebarMenuWidth
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    console.log('first')
  }


  toggle = (collapsedState) => {
    this.setState({
      collapsed: collapsedState,
    });

    if (collapsedState){
      this.setState({
        leftMargin: 0
      });
    } else if(!collapsedState && window.innerWidth > 620) {
      this.setState({
        leftMargin: siteCfg.theme.sidebarMenuWidth
      });
    } else {
    	this.setState({
        leftMargin: 250
      });
    }
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
          const { collapsed, leftMargin } = this.state
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
                <SidebarContents sidebarRoot={sidebarRoot} collapsed={collapsed} leftMargin={leftMargin} />
                {/* eslint-disable-next-line react/destructuring-assignment */}
                <AntdLayout style={{ marginLeft: this.state.leftMargin }}>
                  <Header siteNavTitle={siteNavTitle} headerCollapsed={this.toggle} collapsed={collapsed} />
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
