import axios from 'axios'

const instance = axios.create({
  'content-type': 'application/json',
})

export default instance
