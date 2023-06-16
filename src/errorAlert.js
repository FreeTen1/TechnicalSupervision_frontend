import React, { useEffect } from "react"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import CloseIcon from "@mui/icons-material/Close"

function ErrorAlert({ openAlert, setOpenAlert, message }) {
    useEffect(() => {
        if (openAlert) {
            setTimeout(() => {
                setOpenAlert(false)
            }, 2000)
        }
    }, [openAlert])

    return (
        <Box
            sx={{
                position: "absolute",
                top: "40px",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 999,
            }}
        >
            <Collapse in={openAlert}>
                <Alert
                    action={
                        <IconButton
                            aria-label='close'
                            color='inherit'
                            size='small'
                            onClick={() => {
                                setOpenAlert(false)
                            }}
                        >
                            <CloseIcon fontSize='inherit' />
                        </IconButton>
                    }
                    severity='error'
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>
            </Collapse>
        </Box>
    )
}

export default ErrorAlert
