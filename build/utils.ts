import { loadEnv as loadEnvVite } from 'vite'

// Read all environment variable configuration files to process.env
export function loadEnv(mode: string, root: string): ViteEnv {
  const env = loadEnvVite(mode, root)
  const ret: any = {}

  for (const envName of Object.keys(env)) {
    let realName: string | boolean | Recordable | number = env[envName].replace(/\\n/g, '\n')
    try {
      realName = JSON.parse(realName as string)
    } catch (error) {}

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    ret[envName] = realName
    process.env[envName] = realName as never
  }
  return ret
}
