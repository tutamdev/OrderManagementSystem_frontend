import React from 'react'
import { useParams } from 'react-router-dom'

export const MangeTable = () => {
    const { areaId } = useParams();
    return (
        <div>areaId {areaId}</div>
    )
}
