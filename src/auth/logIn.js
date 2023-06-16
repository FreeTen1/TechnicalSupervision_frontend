import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useState } from "react"
import ErrorAlert from "../errorAlert"
import jwt_decode from "jwt-decode"
import queryAPI_post from "../connect/queryAPI_post"
import { MD5 } from "crypto-js"

function LogIn() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState(false)
    const [message, setMessage] = useState("")
    function authorization() {
        queryAPI_post({ login: login, password: MD5(password).toString() }, "auth").then(res => {
            if (res.status === 401) {
                res.json().then(json => {
                    setAlert(true)
                    setPassword("")
                    setMessage(json["message"])
                })
            } else if (res.status === 200) {
                res.json().then(json => {
                    const decodedToken = jwt_decode(json["access_token"])
                    localStorage.setItem("fio", decodedToken.fio)
                    localStorage.setItem("login", decodedToken.login)
                    localStorage.setItem("exp", decodedToken.exp)
                    window.location.reload()
                })
            } else {
                setAlert(true)
                setMessage(`Нет соединения с сервером. Ошибка ${res.status}`)
            }
        })
    }

    return (
        <div className='w-full, h-full flex justify-center items-center'>
            <ErrorAlert openAlert={alert} setOpenAlert={setAlert} message={message} />
            <form
                className='w-[350px] flex flex-col gap-4 items-center'
                onSubmit={e => {
                    e.preventDefault()
                    authorization()
                }}
            >
                <p>ВХОД В СИСТЕМУ</p>
                <TextField
                    className='w-full'
                    value={login}
                    onChange={e => {
                        setLogin(e.target.value)
                    }}
                    label='Логин'
                    variant='outlined'
                    size='small'
                    required
                />
                <TextField
                    className='w-full'
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)
                    }}
                    label='Пароль'
                    type='password'
                    variant='outlined'
                    size='small'
                    required
                />

                <Button variant='outlined' className='w-[180px]' type='submit'>
                    Войти
                </Button>
            </form>
        </div>
    )
}

export default LogIn
