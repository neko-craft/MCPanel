import { createDraft, finishDraft, immerable } from 'immer'
import React, { createContext, useState, useContext } from 'react'

export const Context = createContext({ models: new Map<typeof Model, Model>() })

export const getProvider = (...models: Model[]) => {
  let update: (data: boolean) => void = () => {}
  let flag = false
  let value = { models: new Map<typeof Model, Model>() }
  const getModel = <M extends typeof Model> (model: M) => value.models.get(model)!! as InstanceType<M>
  models.forEach(it => {
    let model = it
    it.getModel = getModel
    let i = 0
    const proto = Object.getPrototypeOf(model)
    const modelClass = proto.constructor as typeof Model
    Object.getOwnPropertyNames(proto).forEach(name => {
      const f = it[name]
      if (name !== 'constructor' && typeof f === 'function') {
        it[name] = (...args: any[]) => {
          if (i === 0) model = createDraft(model)
          i++
          let result: any
          try {
            result = f.apply(it, args)
            i--
          } catch (e) {
            i = 0
            throw e
          } finally {
            if (i === 0) {
              model = finishDraft(model)
              value.models.set(modelClass, model)
              value = { models: value.models }
              update(!flag)
            }
          }
          return result
        }
      }
    })
    value.models.set(modelClass, model)
  })
  const Provider: React.FC = ({ children }) => {
    [flag, update] = useState(flag)
    return <Context.Provider value={value} children={children} />
  }
  return Object.assign(Provider, { getModel })
}

export const useModel = <T extends typeof Model> (model: T) =>
  useContext(Context).models.get(model)!! as InstanceType<T>

export class Model {
  public static [immerable] = true
  public getModel: <M extends typeof Model> (model: M) => InstanceType<M>
}
