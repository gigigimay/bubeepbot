import { Pokemon } from './../types'
import axios from './axios'

const getPokemon = async (id: number): Promise<Pokemon> => {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const { data: speciesData } = await axios.get(data.species.url)

  return {
    id: data.id,
    name: data.name,
    types: data.types,
    sprite: data.sprites.front_default,
    color: speciesData.color.name,
  }
}

export default getPokemon
