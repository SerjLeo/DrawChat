import axios from 'axios'
import Alert from './Alert'

export default class User {
    constructor(name){
        this.name = name
    }
    
    validateName(){
        if(this.name.length > 20 || this.name.length === 0)
          return false
        return true
    }

    async login(){
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            } 
            const body = {name: this.name}
            const res = await axios.post('/login', body, config)
            if(res.status === 201){
                return true
            } else {
                return false
            }
        } catch (error) {
            new Alert(error.message, 'error', 5000).showAlert();
        }
    }

    async logout(){
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await axios.delete('/logout', config)
            if(res.satus === 200){
                return true
            }
            else return false
        } catch (error) {
            new Alert(error.message, 'error', 5000).showAlert();
        }
    }
}