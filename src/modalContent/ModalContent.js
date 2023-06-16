import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import queryAPI_get from "../connect/queryAPI_get"
import queryAPI_post from "../connect/queryAPI_post"
import queryAPI_put from "../connect/queryAPI_put"
import queryAPI_delete from "../connect/queryAPI_delete"
import FullLoader from "../loading/FullLoader"
import ErrorAlert from "../errorAlert"

function ModalContent({ setOpenModal, modalEdit, options, setUpdateRows, updateRows, setOpenAlert, selectedRow }) {
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [errorAlertMessage, setErrorAlertMessage] = useState("")

    const [diffHrs, setDiffHrs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [confirmDeletion, setConfirmDeletion] = useState(false)

    // при создании
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")
    const [station, setStation] = useState("")
    const [departmentResponsible, setDepartmentResponsible] = useState("")
    const [departmentDistance, setDepartmentDistance] = useState("")
    const [artist, setArtist] = useState("")
    const [dayType, setDayType] = useState(1)
    const [typeWork, setTypeWork] = useState("")
    const [contractor, setContractor] = useState(null)
    const [manufacturerInfo, setManufacturerInfo] = useState("")
    const [orderNumber, setOrderNumber] = useState("")
    const [note, setNote] = useState("")

    // при редактировании
    const [statusKs, setStatusKs] = useState("")
    const [paid, setPaid] = useState("")
    const [amount, setAmount] = useState(0)
    const [statusesExecution, setStatusesExecution] = useState("")
    const [comment, setComment] = useState("")

    useEffect(() => {
        const date1 = new Date(dateStart)
        const date2 = new Date(dateEnd)
        const diffMs = Math.abs(date2 - date1)
        setDiffHrs(Math.round(diffMs / 36e5))
    }, [dateStart, dateEnd])

    useEffect(() => {
        if (modalEdit) {
            setLoading(true)
            queryAPI_get(`supervisions/${selectedRow}`).then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        setDateStart(json["datetime_start"].replace(" ", "T"))
                        setDateEnd(json["datetime_end"].replace(" ", "T"))
                        setStation(json["station"] || "")
                        setDepartmentDistance(json["department_distance"] || "")
                        setDepartmentResponsible(json["department_responsible_id"] || "")
                        setArtist(json["artist"] || "")
                        setDayType(json["day_type_id"] || "")
                        setTypeWork(json["type_work"] || "")
                        setContractor(options["contractors"].find(item => item.id === json["contractor_id"]))
                        setManufacturerInfo(json["manufacturer_info"] || "")
                        setOrderNumber(json["order_number"] || "")
                        setNote(json["note"] || "")

                        setStatusKs(json["status_ks_id"] || "")
                        setPaid(json["paid_status_id"] || "")
                        setAmount(json["amount"] || "")
                        setStatusesExecution(json["status_execution_id"] || "")
                        setComment(json["comment"] || "")

                        setLoading(false)
                    })
                }
            })
        }
    }, [])

    return loading ? (
        <FullLoader />
    ) : (
        <>
            <div className='flex bg-[#D9D9D9] px-10 py-2 justify-between items-center rounded-t-md'>
                <p className='font-semibold text-base text-[#394858]'>
                    {modalEdit ? `Просмотр записи №${selectedRow}` : "Новая запись"}
                </p>
                <p
                    className='text-[#716D6D] cursor-pointer hover:text-[#e31515] transition-colors'
                    onClick={() => {
                        setOpenModal(false)
                    }}
                >
                    &#10006;
                </p>
            </div>
            <form
                className='px-10 py-4 grid gap-2 grid-cols-[180px_180px_200px_1fr] grid-rows-[auto_auto_auto_auto_auto_auto_auto_auto_auto] items-center auto-cols-min'
                onSubmit={e => {
                    e.preventDefault()
                    const data = {
                        datetime_start: dateStart.replace("T", " "),
                        datetime_end: dateEnd.replace("T", " "),
                        day_type_id: dayType || null,
                        department_responsible_id: departmentResponsible || null,
                        station: station || null,
                        department_distance: departmentDistance || null,
                        artist: artist || null,
                        type_work: typeWork || null,
                        contractor_id: contractor ? contractor.id : null,
                        manufacturer_info: manufacturerInfo || null,
                        order_number: orderNumber || null,
                        note: note || null,
                        status_ks_id: 2,
                        paid_status_id: null,
                        amount: null,
                        status_execution_id: 1,
                    }
                    if (modalEdit) {
                        data.status_ks_id = statusKs || 2
                        data.paid_status_id = paid || null
                        data.amount = amount || null
                        data.status_execution_id = statusesExecution || null
                        data.comment = statusKs === 1 ? comment : null
                        queryAPI_put(data, `supervisions/${selectedRow}`).then(res => {
                            if (res.ok) {
                                setUpdateRows(!updateRows)
                                setOpenAlert(true)
                                setOpenModal(false)
                            } else {
                                res.json().then(json => {
                                    alert(json["message"])
                                })
                            }
                        })
                    } else {
                        queryAPI_post(data, "supervisions").then(res => {
                            if (res.ok) {
                                setOpenAlert(true)
                                setOpenModal(false)
                                setUpdateRows(!updateRows)
                            } else {
                                res.json().then(json => {
                                    alert(json["message"])
                                })
                            }
                        })
                    }
                }}
            >
                <ErrorAlert openAlert={openErrorAlert} setOpenAlert={setOpenErrorAlert} message={errorAlertMessage} />
                <TextField
                    className='important_field'
                    value={dateStart}
                    onChange={e => {
                        const date1 = new Date(e.target.value)
                        const date2 = new Date(dateEnd)
                        if (!e.target.value || date1 >= date2) {
                            setDateEnd("")
                        }
                        setDateStart(e.target.value)
                    }}
                    InputLabelProps={{ shrink: true }}
                    label='Дата, время начала работ:'
                    variant='outlined'
                    size='small'
                    type='datetime-local'
                    required
                />
                <TextField
                    className='important_field'
                    value={dateEnd}
                    onChange={e => {
                        const myDateStart = new Date(dateStart)
                        const myDateEnd = new Date(e.target.value)
                        if (!dateStart) {
                            setErrorAlertMessage("Сначала выберите дату начала работ")
                            setOpenErrorAlert(true)
                        } else if (e.target.value && myDateEnd < myDateStart) {
                            setErrorAlertMessage("Дата и время окончания должны быть больше даты и время конца работ")
                            setOpenErrorAlert(true)
                        } else {
                            setDateEnd(e.target.value)
                        }
                    }}
                    InputLabelProps={{ shrink: true }}
                    label='Дата, время окончания работ:'
                    variant='outlined'
                    size='small'
                    type='datetime-local'
                    required
                />
                <span className='place-self-center'>Время всего: {diffHrs ? diffHrs : 0} ч.</span>
                <TextField
                    className='row-span-3'
                    value={station}
                    onChange={e => {
                        setStation(e.target.value)
                    }}
                    label='Станция (место проведения работ):'
                    multiline
                    rows={10}
                />
                <TextField
                    value={departmentDistance}
                    onChange={e => {
                        setDepartmentDistance(e.target.value)
                    }}
                    className='col-span-2'
                    label='Отдел, Дистанция:'
                    variant='outlined'
                    size='small'
                />
                <FormControl className='col-span-1'>
                    <InputLabel size='small'>Отв. подразделение:</InputLabel>
                    <Select
                        size='small'
                        label='Отв. подразделение:'
                        value={departmentResponsible}
                        onChange={e => {
                            setDepartmentResponsible(e.target.value)
                        }}
                        required
                    >
                        {options["responsible_departments"].map((value, index) => (
                            <MenuItem value={value.id} key={index}>
                                {value.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Autocomplete
                    size='small'
                    options={options["artists"].map(option => option.fio) || []}
                    value={artist}
                    onInput={(e, textValue) => {
                        setArtist(e.target.value)
                    }}
                    onChange={(e, textValue) => {
                        setArtist(textValue)
                    }}
                    className='col-span-2'
                    freeSolo
                    renderInput={params => <TextField {...params} label='Ф. И. О. осуществляющего технический надзор' />}
                />
                <FormControl className='col-span-1'>
                    <InputLabel size='small'>Тип дня:</InputLabel>
                    <Select
                        size='small'
                        label='Тип дня:'
                        value={dayType}
                        onChange={e => {
                            setDayType(e.target.value)
                        }}
                        required
                    >
                        {options["day_types"].map((value, index) => (
                            <MenuItem value={value.id} key={index}>
                                {value.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    value={typeWork}
                    onChange={e => {
                        setTypeWork(e.target.value)
                    }}
                    className='col-span-4'
                    label='Вид проводимой работы (объем произведенной работы):'
                    variant='outlined'
                    size='small'
                />
                <Autocomplete
                    size='small'
                    options={options["contractors"] || []}
                    className='col-span-4'
                    value={contractor}
                    onChange={(e, textValue) => {
                        setContractor(textValue)
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={option => option.name}
                    renderInput={params => <TextField {...params} label='Название сторонней организации:' />}
                    noOptionsText='Ничего не найдено'
                />
                <TextField
                    value={manufacturerInfo}
                    onChange={e => {
                        setManufacturerInfo(e.target.value)
                    }}
                    className='col-span-2'
                    label='Фамилия, Имя, телефон производителя:'
                    variant='outlined'
                    size='small'
                />
                <TextField
                    value={orderNumber}
                    onChange={e => {
                        setOrderNumber(e.target.value)
                    }}
                    className='col-span-2'
                    label='Номер совместного приказа:'
                    variant='outlined'
                    size='small'
                />
                <TextField
                    className='col-span-4'
                    value={note}
                    onChange={e => {
                        setNote(e.target.value)
                    }}
                    label='Примечание:'
                    multiline
                    rows={2}
                />
                {modalEdit && (
                    <>
                        <FormControl>
                            <InputLabel size='small'>Учтено в кс:</InputLabel>
                            <Select
                                size='small'
                                label='Учтено в кс:'
                                value={statusKs}
                                onChange={e => {
                                    setStatusKs(e.target.value)
                                }}
                                defaultValue={null}
                                required
                            >
                                <MenuItem value=''>Не выбрано</MenuItem>
                                {options["statuses_ks"].map((value, index) => (
                                    <MenuItem value={value.id} key={index}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel size='small'>Оплачено:</InputLabel>
                            <Select
                                size='small'
                                label='Оплачено:'
                                value={paid}
                                onChange={e => {
                                    setPaid(e.target.value)
                                }}
                                defaultValue={null}
                            >
                                <MenuItem value=''>Не выбрано</MenuItem>
                                {options["paid_statuses"].map((value, index) => (
                                    <MenuItem value={value.id} key={index}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            value={amount}
                            onChange={e => {
                                setAmount(e.target.value)
                            }}
                            label='Сумма, руб.:'
                            size='small'
                            // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            autoComplete='off'
                        />

                        <FormControl>
                            <InputLabel size='small'>Статус выполнения:</InputLabel>
                            <Select
                                size='small'
                                label='Статус выполнения:'
                                value={statusesExecution}
                                onChange={e => {
                                    setStatusesExecution(e.target.value)
                                }}
                                defaultValue={null}
                                required
                            >
                                <MenuItem value=''>Не выбрано</MenuItem>
                                {options["statuses_execution"].map((value, index) => (
                                    <MenuItem value={value.id} key={index}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {statusKs === 1 && (
                            <TextField
                                value={comment}
                                onChange={e => {
                                    setComment(e.target.value)
                                }}
                                className='col-span-4'
                                label='Комментарий'
                                variant='outlined'
                                size='small'
                                required
                            />
                        )}
                    </>
                )}

                {confirmDeletion && (
                    <div className='flex absolute top-0 left-0 w-full h-full items-center justify-center'>
                        <div className='w-[450px] h-[150px] grid grid-cols-1 grid-rows-[35px_1fr] bg-[#F0EFEF] rounded-md'>
                            <div className='bg-[#B58181] rounded-t-md'></div>
                            <div className='grid grid-cols-2 grid-rows-2 gap-3 justify-center items-center px-3 py-3'>
                                <span className='col-span-2 text-center'>Удалить запись №{selectedRow}</span>
                                <Button
                                    variant='contained'
                                    color='error'
                                    onClick={() => {
                                        setLoading(true)
                                        queryAPI_delete({}, `supervisions/${selectedRow}`).then(res => {
                                            if (res.ok) {
                                                setConfirmDeletion(false)
                                                setOpenAlert(true)
                                                setOpenModal(false)
                                                setUpdateRows(!updateRows)
                                                setLoading(false)
                                            } else {
                                                res.json().then(json => {
                                                    alert(json["message"])
                                                })
                                            }
                                        })
                                    }}
                                >
                                    Удалить
                                </Button>
                                <Button
                                    variant='contained'
                                    style={{ background: "#6C757E" }}
                                    onClick={() => {
                                        setConfirmDeletion(false)
                                    }}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='col-span-4 flex items-center justify-between px-10 py-2'>
                    {modalEdit ? (
                        <Button
                            variant='contained'
                            color='error'
                            className='w-[150px]'
                            onClick={() => {
                                setConfirmDeletion(true)
                            }}
                        >
                            Удалить
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    <Button variant='contained' style={{ background: "#6C757E" }} className='w-[150px]' type='submit'>
                        Сохранить
                    </Button>
                    <div></div>
                </div>
            </form>
        </>
    )
}

export default ModalContent
