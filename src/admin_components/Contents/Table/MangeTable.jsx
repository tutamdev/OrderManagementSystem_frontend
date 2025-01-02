import { Button, Empty, Modal, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteTable, getTablesByAreaId } from '../../../services/admin_services/TableService';
import { ModalCreateTable } from './ModalCreateTable';

export const MangeTable = () => {
    const { areaId } = useParams();
    const navigate = useNavigate();
    const [dataTables, setDataTables] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const hanldeCreateTable = () => {
        setIsModalOpen(true);
    }

    const confirmDelete = async (tableId) => {
        try {
            const response = await deleteTable(tableId);
            if (response.data.code === 200) {
                fetchTables();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const cancel = (e) => {
    };
    const fetchTables = async () => {
        try {
            const response = await getTablesByAreaId(areaId);
            if (response.data.code === 200) {
                setDataTables(response.data.result)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTables();
    }, [areaId])

    useEffect(() => {
        document.title = "Quản lý bàn ăn"
    }, [])
    return (
        <div>
            <div className='flex border-b p-2 justify-between'>
                <Button
                    variant='filled'
                    color='primary'
                    onClick={() => { navigate(-1) }}
                >
                    Trở về
                </Button>
                <Button
                    variant='filled'
                    color='primary'
                    onClick={hanldeCreateTable}
                >
                    Tạo bàn ăn mới
                </Button>
            </div>
            <div className='p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-4 gap-5 justify-items-center'>
                {dataTables.map((table) => (
                    <Popconfirm
                        key={table.tableId}
                        title="Xoá bàn ăn"
                        description="Bạn có muốn xoá bàn này không?"
                        onConfirm={() => confirmDelete(table.tableId)}
                        onCancel={cancel}
                        okText="Đồng ý xoá"
                        cancelText="Từ chối"
                    >

                        <button
                            className={`border rounded-lg w-64 h-32 shadow 
                                ${table.status === "AVAILABLE" ? "bg-[#FFF]" :
                                    table.status === "UNAVAILABLE" ? "bg-[#3CD19D]" :
                                        table.status === "MAINTENANCE" ? "bg-[#F46F5E]" :
                                            "bg-[#CCC]"
                                }`}
                        >
                            <h3 className='font-semibold'>{table.tableName}</h3>
                            <p>{table.description}</p>
                        </button>
                    </Popconfirm>
                ))}
            </div>
            <Modal title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}>
                <ModalCreateTable
                    areaId={areaId}
                    handleCancel={handleCancel}
                    fetchTables={fetchTables}
                />
            </Modal>

        </div >
    )
}
