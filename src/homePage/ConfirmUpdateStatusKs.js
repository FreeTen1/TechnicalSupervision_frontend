import { Button } from "@mui/material"
import React from "react"

function ConfirmUpdateStatusKs({ setTakeInKsAlert, removeTakeInKsState, updateStatusKs, selectedRows, notSelectedRows }) {
    return (
        <div className='flex absolute top-0 left-0 w-full h-full items-center justify-center bg-[#00000061] z-50'>
            <div className='w-[450px] h-[150px] grid grid-cols-1 grid-rows-[35px_1fr] bg-[#F0EFEF] rounded-md'>
                <div className='bg-[#B58181] rounded-t-md'></div>
                <div className='grid grid-cols-2 grid-rows-2 gap-3 justify-center items-center px-3 py-3'>
                    <span className='col-span-2 text-center'>
                        Вы точно хотите изменить статус на "Не учтено в КС" у позиций с номерами {removeTakeInKsState.join(", ")}
                    </span>
                    <Button
                        variant='contained'
                        color='success'
                        onClick={() => {
                            updateStatusKs(selectedRows, notSelectedRows)
                            setTakeInKsAlert(false)
                        }}
                    >
                        Подтвердить
                    </Button>
                    <Button
                        variant='contained'
                        style={{ background: "#6C757E" }}
                        onClick={() => {
                            setTakeInKsAlert(false)
                        }}
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmUpdateStatusKs
