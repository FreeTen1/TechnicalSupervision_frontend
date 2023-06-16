import React, { useEffect, useState } from "react"
import { Outlet, NavLink, useLocation } from "react-router-dom"
import queryAPI_get from "../connect/queryAPI_get"
import LogIn from "../auth/logIn"
import LogoutIcon from "@mui/icons-material/Logout"
import queryAPI_delete from "../connect/queryAPI_delete"

function Layout() {
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        queryAPI_get("auth").then(res => {
            if (res.status === 200) {
                setAuth(true)
            }
            setLoading(false)
        })
    }, [location.pathname])

    return (
        <div className='h-full grid grid-cols-[1fr] grid-rows-[60px_1fr] '>
            <header className='flex items-center justify-between bg-[#212429] text-[#979797] px-10 text-lg font-semibold'>
                <div className='flex gap-20'>
                    <p>test</p>
                    <div className='flex gap-6 text-[#979797] flex-wrap'>
                        {auth && (
                            <>
                                <NavLink to='/'>Главная</NavLink>
                                {/* <NavLink to='settings'>Настройки</NavLink> */}
                            </>
                        )}
                    </div>
                </div>
                <p className='flex gap-4 items-center'>
                    {auth && (
                        <>
                            {localStorage.getItem("fio")}
                            <LogoutIcon
                                onClick={() => {
                                    queryAPI_delete({}, "auth").then(res => {
                                        if (res.ok) {
                                            window.location.reload()
                                        }
                                    })
                                }}
                                className='cursor-pointer hover:text-[#FFF]'
                                style={{ transition: ".5s" }}
                                titleAccess='Выход'
                            />
                        </>
                    )}
                </p>
            </header>

            {!loading && <main className='overflow-hidden'>{auth ? <Outlet /> : <LogIn />}</main>}
        </div>
    )
}

export default Layout
