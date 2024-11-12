import React from 'react'
import { useParams } from 'react-router-dom'

export const ManageOrder = () => {
    const { shiftId } = useParams();
    return (
        <div>ManageOrder, shiftId : {shiftId} </div>
    )
}
