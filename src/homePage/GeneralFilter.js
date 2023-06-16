import React from "react"
import SearchIcon from "@mui/icons-material/Search"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"

function GeneralFilter({
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    options,
    contractor,
    setContractors,
    statusKs,
    setStatusKs,
    completed,
    setCompleted,
}) {
    return (
        <div className='flex gap-5 bg-[#EDEDED] px-3 py-3 rounded-md border-[0.5px] border-solid border-[#A7A7A7] text-[#564D4E]'>
            <div className='flex gap-2 items-center'>
                <SearchIcon fontSize='large' />
                <p>ПОИСК:</p>
            </div>
            <div className='flex gap-4 flex-wrap'>
                <TextField
                    value={dateStart}
                    onChange={e => {
                        setDateStart(e.target.value)
                        if (!e.target.value) {
                            setDateEnd("")
                        } else if (!dateEnd) {
                            const currDate = new Date()
                            let year = currDate.getFullYear();
                            let month = (currDate.getMonth() + 1).toString().padStart(2, "0");
                            let day = currDate.getDate().toString().padStart(2, "0");
                            setDateEnd(`${year}-${month}-${day}`)
                        }
                    }}
                    InputLabelProps={{ shrink: true }}
                    label='Дата начала работ с'
                    variant='outlined'
                    size='small'
                    type='date'
                />
                <TextField
                    value={dateEnd}
                    onChange={e => {
                        setDateEnd(e.target.value)
                    }}
                    InputLabelProps={{ shrink: true }}
                    label='Дата начала работ по'
                    variant='outlined'
                    size='small'
                    type='date'
                />
                <Autocomplete
                    size='small'
                    options={options["contractors"] || []}
                    value={contractor}
                    onChange={(e, textValue) => {
                        setContractors(textValue)
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={option => option.name}
                    sx={{ width: 230 }}
                    renderInput={params => <TextField {...params} label='Подрядчик' />}
                    noOptionsText='Ничего не найдено'
                />
                <Autocomplete
                    size='small'
                    options={options["statuses_ks"] || []}
                    value={statusKs}
                    onChange={(e, textValue) => {
                        setStatusKs(textValue)
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={option => option.name}
                    sx={{ width: 150 }}
                    renderInput={params => <TextField {...params} label='Статус' />}
                    noOptionsText='Ничего не найдено'
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={completed}
                            onChange={e => {
                                setCompleted(e.target.checked)
                            }}
                        />
                    }
                    label='Показать только выполненные'
                />
            </div>
        </div>
    )
}

export default GeneralFilter
