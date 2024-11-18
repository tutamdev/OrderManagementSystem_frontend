import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Popconfirm, Table, Tooltip } from 'antd';
import { ModalCreateArea } from './ModalCreateArea';
import { deleteArea, getAllArea } from '../../../services/AreaService';
import { Link } from 'react-router-dom';
import { ModalUpdateArea } from './ModalUpdateArea';

export const ManageArea = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [areaUpdate, setAreaUpdate] = useState();

    useEffect(() => {
        document.title = "Quản lý khu vực"
        fetchAllArea();
    }, []);
    const fetchAllArea = async () => {
        try {
            const response = await getAllArea();
            if (response.data.code === 200) {
                const result = response.data.result || [];
                setData(result);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleUpdateOk = () => {
        setIsModalUpdateOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleUpdateCancel = () => {
        setIsModalUpdateOpen(false);
    };
    const handleCreateArea = () => {
        showModal();
    };
    const handleView = () => {
        // console.log("view");
    };
    const handleUpdate = (areaId) => {
        const areaSelected = data.find((area) => area.areaId === areaId);
        setAreaUpdate(areaSelected)
        setIsModalUpdateOpen(true);
    };
    const handleDelete = async (areaId) => {
        try {
            const response = await deleteArea(areaId);
            if (response.data.code === 200) {
                notification.success({
                    message: "Xoá khu vực thành công",
                    description: "Xoá thành công",
                    duration: 1
                });
                fetchAllArea();
            }
        } catch (error) {

        }
    };
    const columns = [
        {
            title: 'Tên khu vực',
            dataIndex: 'areaName',
            key: 'areaId',
            align: 'center',
            render: (areaName, area) => {
                return (
                    <div>
                        <Link to={String(area.areaId)}>{areaName}</Link>
                    </div>
                )
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            align: 'center'
        },
        {
            title: "Chức năng",
            key: "areaId",
            align: 'center',
            width: "40%",
            render: (area) => {
                return (
                    <div className='flex gap-4 justify-center'>
                        <Button color='default' variant='outlined' className='-my-2'
                            onClick={() => handleUpdate(area.areaId)}
                        >Sửa khu vực</Button>
                        <Popconfirm
                            title="Xoá khu vực"
                            description="Bạn có muốn xoá khu vực này không?"
                            onConfirm={() => { handleDelete(area.areaId) }}
                            okText="Xác nhận xoá"
                            cancelText="Huỷ bỏ"
                        >
                            <Button color="danger" variant="outlined" className='-my-2'
                            >Xoá khu vực</Button>
                        </Popconfirm>
                        <Button color="primary" variant="outlined" className='-my-2'
                            onClick={handleView}
                        >
                            <Link to={area.areaId}>Xem danh sách bàn ăn</Link>
                        </Button>
                    </div >
                )
            }
        }
    ];
    return (
        <>
            <div>
                <div className='flex border-b p-2'>
                    <p className='flex-grow ml-2 text-2xl'>Quản lý khu vực</p>
                    <Button
                        variant='filled'
                        color='primary'
                        onClick={handleCreateArea}
                    >
                        Tạo mới khu vực
                    </Button>
                </div>
                <Table rowKey="areaId" columns={columns} dataSource={data} loading={loading} pagination={{ position: ["bottomCenter"], pageSize: 8 }} />
            </div>
            <Modal
                title="Tạo khu vực"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}>
                <ModalCreateArea handleCancel={handleCancel} fetchAllArea={fetchAllArea} />
            </Modal>
            <Modal
                title="Cập nhật khu vực"
                open={isModalUpdateOpen}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
                footer={null}
            >
                <ModalUpdateArea areaUpdate={areaUpdate} handleUpdateCancel={handleUpdateCancel} fetchAllArea={fetchAllArea} />
            </Modal>
        </>
    )
}
