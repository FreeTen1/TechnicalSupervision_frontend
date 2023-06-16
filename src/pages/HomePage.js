import React, { useEffect, useRef, useState } from "react"
import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import MountFilter from "../homePage/MountFilter"
import GeneralFilter from "../homePage/GeneralFilter"
import DataTable from "../homePage/DataTable"
import MiniLoader from "../loading/MiniLoader"
import { Modal, Typography } from "@mui/material"
import ModalContent from "../modalContent/ModalContent"
import queryAPI_get from "../connect/queryAPI_get"
import TransitionAlerts from "../alert"
import queryAPI_put from "../connect/queryAPI_put"
import ErrorAlert from "../errorAlert"
import ConfirmUpdateStatusKs from "../homePage/ConfirmUpdateStatusKs"

const today = new Date()
const todayMonth = today.getMonth() + 1
const todayYear = today.getFullYear()

const startYear = 2010
const yearList = Array.from({ length: todayYear + 1 - startYear }, (value, index) => startYear + index).reverse()

const months = {
    1: "Январь",
    2: "Февраль",
    3: "Март",
    4: "Апрель",
    5: "Май",
    6: "Июнь",
    7: "Июль",
    8: "Август",
    9: "Сентябрь",
    10: "Октябрь",
    11: "Ноябрь",
    12: "Декабрь",
}

function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { day: "numeric", month: "long", year: "numeric" }
    const formattedDate = date.toLocaleString("ru-RU", options)
    return formattedDate.replace(" г.", " года")
}

function HomePage() {
    // ref
    const mainGrid = useRef()
    const arrowCircle = useRef()
    // variables
    const [options, setOptions] = useState({})
    const [rowData, setRowData] = useState([])

    //  дополнительные переменные
    const [loading, setLoading] = useState(true)
    const [showCheckbox, setShowCheckbox] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [updateRows, setUpdateRows] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [excel, setExcel] = useState(false)
    const [confirmKs, setConfirmKs] = useState(false)
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [messageErrorAlert, setMessageErrorAlert] = useState("")

    // выбранная строка для детального открытия
    const [selectedRow, setSelectedRow] = useState(null)

    // выбранные строки
    const [selectedRows, setSelectedRows] = useState([])
    const [notSelectedRows, setNotSelectedRows] = useState([])
    const [currSelectedRows, setCurrSelectedRows] = useState([])
    const [takeInKsAlert, setTakeInKsAlert] = useState(false)
    const [removeTakeInKsState, setRemoveTakeInKsState] = useState([])

    // основные 2 фильтра год и месяц
    const [selectedYear, setSelectedYear] = useState(todayYear)
    const [selectedMonth, setSelectedMonth] = useState(todayMonth)

    // дополнительные фильтры. Если есть dateStart и dateEnd не берут в расчёт основные 2 фильтра
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")
    const [contractor, setContractors] = useState(null)
    const [statusKs, setStatusKs] = useState(null)
    const [completed, setCompleted] = useState(false)

    const OpenMonthInfo = () => {
        mainGrid.current.classList.toggle("grid-rows-[auto_70px_1fr]")
        mainGrid.current.classList.toggle("grid-rows-[auto_180px_1fr]")
        arrowCircle.current.classList.toggle("rotate-180")
    }

    // Заполнить списки
    useEffect(() => {
        queryAPI_get("lists").then(res => {
            if (res.ok) {
                res.json().then(json => {
                    setOptions(json)
                })
            }
        })
    }, [])

    // вывести данные с учётом фильтров
    function showRows(mainFilter, additionalFilter) {
        queryAPI_get(`supervisions?sort_key=id&sort_by=DESC&${mainFilter}&${additionalFilter}`).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    setRowData(json)
                    setLoading(false)
                })
            } else {
                res.json().then(json => {
                    setMessageErrorAlert(json["message"])
                    setOpenErrorAlert(true)
                    setLoading(false)
                })
            }
        })
    }

    // отслеживание изменения фильтров
    useEffect(() => {
        let mainFilter =
            dateStart && dateEnd ? `date_start=${dateStart}&date_end=${dateEnd}` : `year=${selectedYear}&month=${selectedMonth}`
        let additionalFilter = `${contractor ? "contractor_id=" + contractor.id + "&" : ""}${
            statusKs ? "status_ks_id=" + statusKs.id + "&" : ""
        }${completed ? "status_execution_id=2&" : ""}`
        if (dateStart || dateEnd) {
            if (dateStart && dateEnd) {
                setLoading(true)
                showRows(mainFilter, additionalFilter)
            }
        } else {
            setLoading(true)
            showRows(mainFilter, additionalFilter)
        }
    }, [selectedYear, selectedMonth, dateStart, dateEnd, contractor, statusKs, completed, updateRows])

    // отслеживание размера кнопки "сброс фильтров по дате"
    useEffect(() => {
        if (dateStart || dateEnd) {
            if (mainGrid.current.classList.contains("grid-rows-[auto_180px_1fr]")) {
                mainGrid.current.classList.toggle("grid-rows-[auto_70px_1fr]")
                mainGrid.current.classList.toggle("grid-rows-[auto_180px_1fr]")
            }
        }
    }, [dateStart, dateEnd])

    function updateStatusKs(take_in_ks_ids, notTakeInKsIds) {
        queryAPI_put({ take_in_ks_ids: take_in_ks_ids, not_take_in_ks_ids: notTakeInKsIds }, "take_in_ks").then(res => {
            if (res.ok) {
                setUpdateRows(!updateRows)
                setOpenAlert(true)
                setSelectedRows([])
                setShowCheckbox(false)
                setConfirmKs(false)
                setExcel(false)
            }
        })
    }

    // Выгрузка в excel
    function excelLoad(loadType) {
        queryAPI_get(`excel_load?supervision_ids=${selectedRows}&load_type=${loadType}`).then(res => {
            res.blob().then(resBlob => {
                const blob = new Blob([resBlob], {
                    type: res.headers["content-type"],
                })
                const link = document.createElement("a")
                link.href = window.URL.createObjectURL(blob)
                link.download = `Выгрузка.xlsx`
                link.click()
            })
        })
    }

    return (
        <div
            className='h-full bg-[#F5F5F5] grid grid-cols-[1fr] grid-rows-[auto_70px_1fr] transition-[grid-template-rows] duration-500 px-2'
            ref={mainGrid}
        >
            <TransitionAlerts openAlert={openAlert} setOpenAlert={setOpenAlert} />
            <ErrorAlert openAlert={openErrorAlert} setOpenAlert={setOpenErrorAlert} message={messageErrorAlert} />
            {takeInKsAlert && (
                <ConfirmUpdateStatusKs
                    setTakeInKsAlert={setTakeInKsAlert}
                    removeTakeInKsState={removeTakeInKsState}
                    updateStatusKs={updateStatusKs}
                    selectedRows={selectedRows}
                    notSelectedRows={notSelectedRows}
                />
            )}
            <div className='flex justify-between items-center py-2'>
                <div className='flex gap-3 flex-wrap'>
                    {!excel ? (
                        <Button
                            variant='outlined'
                            className='w-[180px]'
                            onClick={() => {
                                setSelectedRows([])
                                setShowCheckbox(true)
                                setConfirmKs(false)
                                setExcel(true)
                            }}
                        >
                            Выгрузить в Excel
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant='outlined'
                                className='flex gap-1 w-[145px]'
                                onClick={() => {
                                    excelLoad("inside")
                                    setSelectedRows([])
                                    setShowCheckbox(false)
                                    setConfirmKs(false)
                                    setExcel(false)
                                }}
                                style={{ background: "#CEFFCE", text: "white" }}
                            >
                                Внутренняя {<DownloadIcon />}
                            </Button>
                            <Button
                                variant='outlined'
                                className='flex gap-1 w-[145px]'
                                onClick={() => {
                                    excelLoad("outside")
                                    setSelectedRows([])
                                    setShowCheckbox(false)
                                    setConfirmKs(false)
                                    setExcel(false)
                                }}
                                style={{ background: "#CEFFCE", text: "white" }}
                            >
                                Внешняя {<DownloadIcon />}
                            </Button>
                        </>
                    )}

                    <Button
                        variant='outlined'
                        className='w-[180px]'
                        onClick={() => {
                            if (confirmKs) {
                                let notTakeInKsIds = rowData.filter(row => !selectedRows.includes(row["id"])).map(row => row.id)
                                let removeTakeInKs = currSelectedRows.filter(row => notTakeInKsIds.includes(row))
                                if (!removeTakeInKs.length) {
                                    updateStatusKs(selectedRows, notTakeInKsIds)
                                } else {
                                    setRemoveTakeInKsState(removeTakeInKs)
                                    setNotSelectedRows(notTakeInKsIds)
                                    setTakeInKsAlert(true)
                                }
                            } else {
                                let selRows = rowData.filter(row => row["status_ks_id"] === 1 && row).map(row => row.id)
                                setSelectedRows(selRows)
                                setCurrSelectedRows(selRows)
                                setShowCheckbox(true)
                                setConfirmKs(true)
                                setExcel(false)
                            }
                        }}
                        style={confirmKs ? { background: "#CEFFCE", text: "white" } : {}}
                    >
                        {confirmKs ? "Подтвердить" : "Учесть в КС"}
                    </Button>
                    {showCheckbox && (
                        <Button
                            variant='outlined'
                            color='error'
                            onClick={() => {
                                setSelectedRows([])
                                setShowCheckbox(false)
                                setConfirmKs(false)
                                setExcel(false)
                            }}
                        >
                            Отмена
                        </Button>
                    )}
                </div>

                <GeneralFilter
                    dateStart={dateStart}
                    setDateStart={setDateStart}
                    dateEnd={dateEnd}
                    setDateEnd={setDateEnd}
                    options={options}
                    contractor={contractor}
                    setContractors={setContractors}
                    statusKs={statusKs}
                    setStatusKs={setStatusKs}
                    completed={completed}
                    setCompleted={setCompleted}
                />

                <Button
                    variant='contained'
                    style={{ background: "#6C757E" }}
                    onClick={() => {
                        setModalEdit(false)
                        setOpenModal(true)
                    }}
                >
                    Внести запись
                </Button>
                <Modal
                    open={openModal}
                    onClose={() => {
                        setOpenModal(false)
                    }}
                    className='flex items-center justify-center'
                >
                    <div className='bg-[#EAEAEA] rounded-md grid grid-rows-[auto_1fr] w-3/4 h-[75%] min-h-[630px] shadow-lg'>
                        <ModalContent
                            setOpenModal={setOpenModal}
                            modalEdit={modalEdit}
                            options={options}
                            setUpdateRows={setUpdateRows}
                            setOpenAlert={setOpenAlert}
                            updateRows={updateRows}
                            selectedRow={selectedRow}
                        />
                    </div>
                </Modal>
            </div>
            <div className='flex py-2 justify-center'>
                {!(dateStart || dateEnd) ? (
                    <MountFilter
                        OpenMonthInfo={OpenMonthInfo}
                        arrowCircle={arrowCircle}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        yearList={yearList}
                        todayYear={todayYear}
                        todayMonth={todayMonth}
                        months={months}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        updateRows={updateRows}
                    />
                ) : (
                    <Button
                        variant='outlined'
                        color='error'
                        size='small'
                        onClick={() => {
                            setDateStart("")
                            setDateEnd("")
                        }}
                    >
                        Сбросить фильтра по дате начала
                    </Button>
                )}
            </div>
            <div className='overflow-y-auto'>
                {loading ? (
                    <MiniLoader />
                ) : rowData.length ? (
                    <DataTable
                        rowData={rowData}
                        showCheckbox={showCheckbox}
                        setModalEdit={setModalEdit}
                        setOpenModal={setOpenModal}
                        setSelectedRow={setSelectedRow}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                    />
                ) : dateStart && dateEnd ? (
                    <div className='flex w-full h-full justify-center items-center'>
                        <Typography variant='h4'>
                            Тех. надзоры с {formatDate(dateStart)} по {formatDate(dateEnd)} не найдены
                        </Typography>
                    </div>
                ) : (
                    <div className='flex w-full h-full justify-center items-center'>
                        <Typography variant='h4'>
                            Тех. надзоры за {months[selectedMonth].toLowerCase()} {selectedYear} года не найдены
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage
