import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { useNavigate } from "react-router-dom"
// require('dotenv').config()

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigateTo = useNavigate()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${import.meta.env.VITE_API_POST_LOGIN}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})
            navigateTo('/app')

            // update loading state
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}