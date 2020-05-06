import axios from './axios'

const getPokemon = async id => {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const { data: speciesData } = await axios.get(data.species.url)
  const { color } = speciesData
  return { ...data, color }
}

export default getPokemon
