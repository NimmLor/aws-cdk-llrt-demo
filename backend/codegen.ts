/* eslint-disable node/no-sync */
/* eslint-disable no-console */
import AdmZip from 'adm-zip'
import fs from 'node:fs'
import path from 'node:path'

const owner = 'awslabs'
const repo = 'llrt'
const assetName = 'llrt-lambda-arm64.zip'

const downloadPath = path.join(__dirname, 'runtime')

// delete all files in downloadPath
const cleanupDownloadPath = () => {
  const folderContent = fs.readdirSync(downloadPath)
  fs.rmSync(downloadPath, { force: true, recursive: true })
  fs.mkdirSync(downloadPath, { recursive: true })

  const latestVersion = folderContent
    .at(-1)
    ?.replace('llrt-lambda-arm64-', '')
    .replace('.zip', '')

  return latestVersion
}

const getLatestRelease = async () => {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`GitHub API responded with status ${response.status}`)
  }

  return (await response.json()) as {
    assets: Array<{ browser_download_url: string; name: string }>
    tag_name: string
  }
}

const downloadAsset = async (assetUrl: string, postfix: string) => {
  const response = await fetch(assetUrl)
  if (!response.ok) {
    throw new Error(`Failed to download asset with status ${response.status}`)
  }

  const blob = await response.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  const previousVersion = cleanupDownloadPath()

  // unzip and write the buffer
  new AdmZip(buffer).extractAllTo(
    path.join(downloadPath, `${assetName.replace('.zip', '')}-${postfix}`),
    true
  )

  if (!previousVersion) {
    console.log(`✨ Downloaded LLRT \u001B[32m${postfix}\u001B[0m`)
  } else if (previousVersion === postfix) {
    console.log('✨ LLRT is \u001B[32mup-to-date\u001B[0m!')
  } else {
    console.log(
      `✨ Updated LLRT from \u001B[33m${previousVersion}  →  \u001B[32m${postfix}\u001B[0m`
    )
  }
}

const findAndDownloadAsset = async () => {
  try {
    const release = await getLatestRelease()
    const asset = release.assets.find(
      (findAsset) => findAsset.name === assetName
    )
    if (!asset) {
      throw new Error(`${assetName} not found in the latest release.`)
    }

    await downloadAsset(asset.browser_download_url, release.tag_name)
  } catch (error) {
    if (error instanceof Error)
      console.error('Error:', 'message' in error ? error.message : error)
  }
}

void findAndDownloadAsset()
