/* eslint-disable no-console */
/* eslint-disable unicorn/prevent-abbreviations */
import * as esbuild from 'esbuild'
import * as fs from 'node:fs'
import * as path from 'node:path'

const startTime = Date.now()

// dependencies provided by the LLRT runtime
// see https://github.com/awslabs/llrt?tab=readme-ov-file#using-aws-sdk-v3-with-llrt
const llrtExternal = [
  '@aws-sdk/client-dynamodb',
  '@aws-sdk/lib-dynamodb',
  '@aws-sdk/client-kms',
  '@aws-sdk/client-lambda',
  '@aws-sdk/client-s3',
  '@aws-sdk/client-secrets-manager',
  '@aws-sdk/client-ses',
  '@aws-sdk/client-sns',
  '@aws-sdk/client-sqs',
  '@aws-sdk/client-sts',
  '@aws-sdk/client-ssm',
  '@aws-sdk/client-cloudwatch-logs',
  '@aws-sdk/client-cloudwatch-events',
  '@aws-sdk/client-eventbridge',
  '@aws-sdk/client-sfn',
  '@aws-sdk/client-xray',
  '@aws-sdk/client-cognito-identity',
  '@aws-sdk/util-dynamodb',
  '@aws-sdk/credential-providers',
  '@smithy/signature-v4',
  'uuid',
]

const distDir = path.join(__dirname, 'dist')

// remove dist dir and recreate it and a subfolder for metafiles
fs.rmSync(distDir, { force: true, recursive: true })
fs.mkdirSync(path.join(distDir, 'meta'), { recursive: true })

// build every lambda function in the folder ./src whose folder ends with .fn
const entryPoints: Array<{ name: string; path: string }> = []

// list folders in folder
const folderPath = path.join(__dirname, 'src')
const folderContents = fs.readdirSync(path.join(__dirname, 'src'))
for (const item of folderContents) {
  if (item.includes('dist')) continue

  if (item.endsWith('.fn')) {
    entryPoints.push({
      name: item.replace('.fn', ''),
      path: path.join(folderPath, item),
    })
  }
}

// build all entrypoints

const runtimeFolder = path.join(__dirname, 'runtime')
const runtimeName = fs.readdirSync(runtimeFolder).at(-1)

if (!runtimeName) {
  throw new Error(
    'No LLRT runtime found. Run `yarn run codegen` to download the latest runtime'
  )
}

const runtimePath = path.join(runtimeFolder, runtimeName)

void Promise.all(
  entryPoints.map(async (entryPoint) => {
    const outdir = path.join(entryPoint.path.replace(__dirname, 'dist'))

    const outfile = path.join(outdir, 'index.js')

    // see https://github.com/awslabs/llrt?tab=readme-ov-file#esbuild
    const result = await esbuild.build({
      bundle: true,
      entryPoints: [entryPoint.path],
      external: llrtExternal,
      format: 'esm',
      metafile: true,
      minify: false,
      outfile,
      platform: 'node',
      target: 'es2020',
    })

    await Promise.all([
      new Promise((resolve, reject) => {
        // copy bootstrap file to dist
        fs.cp(
          path.join(runtimePath as string),
          outdir,
          {
            recursive: true,
          },
          (error) => {
            if (error) {
              reject(error)
            } else resolve(true)
          }
        )
      }),
      new Promise((resolve, reject) => {
        // write metafile to dist/meta/<entrypoint>.meta.json
        fs.writeFile(
          path.join(distDir, 'meta', `${entryPoint.name}.meta.json`),
          JSON.stringify(result.metafile, null, 2),
          (error) => {
            if (error) {
              reject(error)
            } else resolve(true)
          }
        )
      }),
    ])
  })
).then(() => {
  console.log(`✨  Backend built in: ${Date.now() - startTime}ms`)
})
