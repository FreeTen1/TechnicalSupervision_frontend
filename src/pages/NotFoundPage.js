import React from "react"
import { Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className='flex items-center justify-center fixed top-0 left-0 w-full h-full bg-white'>
            <div className='flex flex-col items-center'>
                <Typography variant='h1'>404</Typography>
                <Typography variant='h6'>Страница не найдена</Typography>
                <Button
                    onClick={() => {
                        navigate("/")
                    }}
                    variant='contained'
                >
                    Вернуться на главную
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage
