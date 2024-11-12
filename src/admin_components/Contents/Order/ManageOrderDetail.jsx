import React from 'react'
import { useParams } from 'react-router-dom';

export const ManageOrderDetail = () => {
    const { shiftId, orderId } = useParams();
    return (
        <div>ManageOrderDetail, shiftId : {shiftId}, orderId: {orderId}</div>
    )
}
