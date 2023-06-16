import React, { useEffect, useState } from "react"
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import queryAPI_get from "../connect/queryAPI_get"
import MiniLoader from "../loading/MiniLoader"

function MountFilter({
    OpenMonthInfo,
    arrowCircle,
    selectedYear,
    setSelectedYear,
    yearList,
    todayYear,
    todayMonth,
    months,
    selectedMonth,
    setSelectedMonth,
    updateRows
}) {
    const [countInfo, setCountInfo] = useState({})
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true)
        queryAPI_get(`supervisions_count_info?year=${selectedYear}`).then(res => {
            res.json().then(json => {
                setCountInfo(json)
                setLoading(false)
            })
        })
    }, [selectedYear, updateRows])

    return (
        <div className='h-full overflow-hidden px-10 py-2 bg-[#ECECEC] items-center rounded-md grid gap-x-3 grid-rows-[40px_40px_40px_40px] grid-cols-[140px_130px_66px_66px_66px_66px_66px_66px_66px_66px_66px_66px_66px_66px]'>
            <label className='flex gap-1 items-center cursor-pointer' onClick={OpenMonthInfo}>
                <span className='text-[#564D4E80]'>ПО МЕСЯЦАМ</span>
                <ArrowCircleDownIcon ref={arrowCircle} className='text-[#6C757E]' style={{ transition: ".5s" }} />
            </label>
            <FormControl>
                <InputLabel id='demo-simple-select-label'>Год</InputLabel>
                <Select
                    size='small'
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={selectedYear}
                    label='Год'
                    sx={{ width: 120 }}
                    onChange={e => {
                        setSelectedYear(e.target.value)
                        if (e.target.value === todayYear && selectedMonth > todayMonth) {
                            setSelectedMonth(todayMonth)
                        }
                    }}
                >
                    {yearList.map((year, index) => (
                        <MenuItem value={year} key={index}>
                            {year} год
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {Object.entries(months).map(([mountIndex, mountName], index) => {
                mountIndex = Number(mountIndex)
                if (todayYear === selectedYear) {
                    if (mountIndex <= todayMonth) {
                        return (
                            <span
                                className='cursor-pointer hover:underline'
                                style={{ textDecorationLine: selectedMonth === mountIndex ? "underline" : null }}
                                onClick={() => {
                                    setSelectedMonth(mountIndex)
                                }}
                                key={index}
                            >
                                {mountName}
                            </span>
                        )
                    } else {
                        return (
                            <span className='text-[#564D4E80]' key={index}>
                                {mountName}
                            </span>
                        )
                    }
                } else {
                    return (
                        <span
                            className='cursor-pointer hover:underline'
                            style={{ textDecorationLine: selectedMonth === mountIndex ? "underline" : null }}
                            onClick={() => {
                                setSelectedMonth(mountIndex)
                            }}
                            key={index}
                        >
                            {mountName}
                        </span>
                    )
                }
            })}
            {loading ? (
                <div className='col-span-full row-span-3'>
                    <MiniLoader />
                </div>
            ) : (
                <>
                    <span>всего тех. надзоров</span>
                    <span>{countInfo["all_count"]}</span>
                    <span>{countInfo["count_months"]["01"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["02"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["03"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["04"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["05"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["06"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["07"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["08"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["09"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["10"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["11"]["all_count"]}</span>
                    <span>{countInfo["count_months"]["12"]["all_count"]}</span>

                    <span>выполнено тех. надзоров</span>
                    <span>{countInfo["completed"]}</span>
                    <span>{countInfo["count_months"]["01"]["completed"]}</span>
                    <span>{countInfo["count_months"]["02"]["completed"]}</span>
                    <span>{countInfo["count_months"]["03"]["completed"]}</span>
                    <span>{countInfo["count_months"]["04"]["completed"]}</span>
                    <span>{countInfo["count_months"]["05"]["completed"]}</span>
                    <span>{countInfo["count_months"]["06"]["completed"]}</span>
                    <span>{countInfo["count_months"]["07"]["completed"]}</span>
                    <span>{countInfo["count_months"]["08"]["completed"]}</span>
                    <span>{countInfo["count_months"]["09"]["completed"]}</span>
                    <span>{countInfo["count_months"]["10"]["completed"]}</span>
                    <span>{countInfo["count_months"]["11"]["completed"]}</span>
                    <span>{countInfo["count_months"]["12"]["completed"]}</span>

                    <span>учтено в КС</span>
                    <span>{countInfo["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["01"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["02"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["03"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["04"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["05"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["06"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["07"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["08"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["09"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["10"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["11"]["take_in_ks"]}</span>
                    <span>{countInfo["count_months"]["12"]["take_in_ks"]}</span>
                </>
            )}
        </div>
    )
}

export default MountFilter
