import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layouts/Layout"
import WorldMap from "../components/Layouts/WorldMap"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
        <div className="flex flex-col items-center justify-center h-full"> 
          <WorldMap />
        </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>