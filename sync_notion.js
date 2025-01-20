const path = require('path')
const fs = require('fs')
const { Client } = require('@notionhq/client')
const { NotionToMarkdown } = require('notion-to-md')
require('dotenv').config()

const notion = new Client({ auth: process.env.NOTION_API_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: notion, config: { convertImagesToBase64: true } })

const OUTPUT_DIR = '_posts' // Directory to save Markdown files
const IMAGES_DIR = './assets/img'
const IMAGES_URL_PATH = '/assets/img'

// Custom transformer for image blocks
n2m.setCustomTransformer('image', async (block) => {
  const imageBlock = block.image
  const type = imageBlock.type // external or file
  const imageUrl = imageBlock[type].url

  const imageExtension = path.extname(imageUrl).split('?')[0] // Get the image extension from url, can use mime type as well
  const imageName = `${block.id}${imageExtension}` // Use block ID as the image name
  const localImagePath = path.join(IMAGES_DIR, imageName)
  const urlImagePath = path.join(IMAGES_URL_PATH, imageName)

  try {
    // Download the image using fetch
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    const buffer = await response.arrayBuffer()

    // Save the image locally
    fs.writeFileSync(localImagePath, Buffer.from(buffer))

    // Return the Markdown image syntax with the local path
    let caption = 'Default caption'
    if (imageBlock.caption.length > 0) {
      caption = imageBlock.caption[0].plain_text
    }

    // return `![${caption}](${urlImagePath})`
    return `![${caption}](${localImagePath})`
  } catch (error) {
    console.error(error)
    return `![Image](${imageUrl})` // Fallback to the original URL if download fails
  }
})

// Fetch data from Notion
async function fetchNotionData () {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Status', // Adjust this to match your Notion database's status property
        select: { equals: 'Deploy' }
      }
    })

    return response.results
  } catch (error) {
    console.error('Error fetching data from Notion:', error.message)
    process.exit(1)
  }
}

// Convert Notion page to Markdown
async function convertToMarkdown (page) {
  try {
    const mdBlocks = await n2m.pageToMarkdown(page.id)
    return n2m.toMarkdownString(mdBlocks).parent
  } catch (error) {
    console.error(`Error converting page ${page.id} to Markdown:`, error.message)
    return null
  }
}

// Update Notion page status
async function updatePageStatus (pageId) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          select: { name: 'Published' }
        }
      }
    })
    console.log(`Updated page ${pageId} status to Published.`)
  } catch (error) {
    console.error(`Failed to update status for page ${pageId}:`, error.message)
  }
}

// Save Markdown files
async function saveMarkdown (pages) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  for (const page of pages) {
    const title = page.properties.Name.title[0]?.plain_text || 'untitled'
    const date = new Date(page.created_time).toISOString().split('T')[0] // Extract creation date
    const slug = title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const filename = `${OUTPUT_DIR}/${date}-${slug}.markdown`
    const markdown = await convertToMarkdown(page)

    if (markdown) {
      const frontmatter = `\
---
title: "${title}"
id: "${page.id}"
layout: post
---
`
      fs.writeFileSync(filename, frontmatter + markdown, 'utf8')
      console.log(`Saved: ${filename}`)
      await updatePageStatus(page.id)
    } else {
      console.error(`Failed to save markdown for page: ${page.id}`)
    }
  }
}

// Main function
async function main () {
  console.log('Fetching data from Notion...')
  const pages = await fetchNotionData()
  console.log(`Fetched ${pages.length} pages.`)

  console.log('Saving markdown files...')
  await saveMarkdown(pages)
  console.log('Sync complete!')
}

// Run the script
main()
