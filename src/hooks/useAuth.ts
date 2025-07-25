import api from "../utils/api";
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import useFlashMessage from "./useFlashMessage";
import type { IUser } from "../types/IUser";

export default function useAuth() {

    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, [])


    async function register(user: IUser) {
        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })

            await authUser(data)

        } catch (error: any) {
            msgText = error.response.data.message
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)

    }


    async function login(user: IUser) {
        let msgText = 'Login realizado com sucesso'
        let msgType = 'success'

        try {
            const data = await api.post('/users/login', user).then((response) => {
                return response.data
            })

            await authUser(data)

        } catch (error:any) {
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }

    async function authUser(data:any) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        navigate('/')

    }

    function logout() {
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'sucess'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = null
        navigate('/')

        setFlashMessage(msgText, msgType)
    }

    return { authenticated, register, logout, login }
}
