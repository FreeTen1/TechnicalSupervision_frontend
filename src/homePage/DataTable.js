import React from "react"
import { DataGrid, ruRU } from "@mui/x-data-grid"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const columns = [
    { field: "id", headerName: "№ п/п", width: 65 },
    {
        field: "datetime_start",
        headerName: "Дата, время начала работ",
        width: 180,
        valueFormatter: params => new Date(params.value).toLocaleDateString("ru-RU", { hour: "numeric", minute: "numeric" }),
    },
    {
        field: "datetime_end",
        headerName: "Дата, время окончания работ",
        width: 200,
        valueFormatter: params => new Date(params.value).toLocaleDateString("ru-RU", { hour: "numeric", minute: "numeric" }),
    },
    { field: "station", headerName: "Станция (место проведения работ)", flex: 1 },
    { field: "contractor", headerName: "Подрядчик", flex: 1 },
    { field: "status_ks", headerName: "Статус", width: 200 },
    { field: "note", headerName: "Примечание", flex: 1 },
    { field: "status_execution", headerName: "Статус выполнения", width: 150 },
    { field: "department_responsible", headerName: "Ответственное подразделение", width: 150 },
]

const theme = createTheme(ruRU)

// const rows = [
//     { id: 1, datetime_start: "example", station: "example", contractor: "example", status_ks: "example", note: "example", status_execution: "example" },
// ]

function DataTable({ rowData, showCheckbox, setModalEdit, setOpenModal, setSelectedRow, selectedRows, setSelectedRows }) {
    const handleRowClick = params => {
        setSelectedRow(params.id)
        setModalEdit(true)
        setOpenModal(true)
    }

    return (
        <ThemeProvider theme={theme}>
            <DataGrid
                style={{ height: "100%", width: "100%" }}
                rows={rowData}
                columns={columns}
                onRowClick={!showCheckbox ? handleRowClick : () => {}}
                checkboxSelection={showCheckbox}
                disableRowSelectionOnClick={!showCheckbox}
                disableColumnMenu
                getRowClassName={params => {
                    return "cursor-pointer"
                }}
                showCellVerticalBorder
                showColumnVerticalBorder
                withBorderColor='bg-red-100'
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 20,
                        },
                    },
                }}
                pageSizeOptions={[20]}
                rowSelectionModel={selectedRows}
                onRowSelectionModelChange={e => {
                    setSelectedRows(e)
                }}
            />
        </ThemeProvider>
    )
}

export default DataTable
