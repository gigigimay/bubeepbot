import _ from 'lodash'
import { IIndexable } from '../types'

export interface MemoryData<T> {
  [username: string]: T
}

export type MemoryGetValue = ((v: string) => string | Promise<string>) | null

export type MemoryConfig = IIndexable<MemoryGetValue>

type SaveMemory = (param: string, username: string, config: MemoryConfig,) => Promise<string[] | undefined>

export const createMemoryInstance = <T>(config: MemoryConfig): {
  memory: MemoryData<T>
  saveMemory: SaveMemory
} => {
  const memory: MemoryData<T> = {}

  const saveMemory: SaveMemory = async (
    param: string,
    username: string,
  ) => {
    const params = param.split(' ')
    const key = params[0].replace(/^--/, '')
    const getValue = config[key]
    if (params.length === 2 && params[0].startsWith('--') && getValue !== undefined) {
      const rawValue = param[1]
      const value: string = getValue ? await getValue(rawValue) : rawValue
      _.set(memory, `${username}.${key}`, value)
      return [[`[${username}] ${key}:`, value].join(' ')]
    }
  }

  return {
    memory,
    saveMemory,
  }
}
