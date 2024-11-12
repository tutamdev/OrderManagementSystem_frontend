import React from 'react'
import { useParams } from 'react-router-dom'

export const ManageFood = () => {
    const { categoryId } = useParams();
    return (
        <div>categoryId: {categoryId}</div>
    )
}
