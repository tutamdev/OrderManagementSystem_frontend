import React from 'react'
import { useParams } from 'react-router-dom'

export const EmployeeDetail = () => {
    const { id } = useParams();
    return (
        <div>EmployeeDetail: {id}</div>
    )
}
