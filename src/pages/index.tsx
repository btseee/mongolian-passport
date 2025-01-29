import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import WorldMap from "../components/WorldMap"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
        <WorldMap />
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>