import React, { useEffect, useState } from 'react'
import DataTable from './Datatable'
import { useDataContext } from '../contexts/DataContext';

const Financials = () => {
    const { state } = useDataContext();
    const [data, setData] = useState(state.balanceSheet)
    useEffect(() => {
        console.log(typeof state.balanceSheet)
        if(state.balanceSheet && typeof state.balanceSheet === "string") {
            const formated = state.balanceSheet.replace(/'/g, '"').replace(/nan/g, 'null');
            console.log('in financials: ', formated )

            setData(JSON.parse(formated))
        }

    }, [state])
  return (
    <div style={{overflowX: 'hidden', overflowY: 'scroll', height: '600px'}}>
        <DataTable tableData={data} />
    </div>
  )
}

export default Financials