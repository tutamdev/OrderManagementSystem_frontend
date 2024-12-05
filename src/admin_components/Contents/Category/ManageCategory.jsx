import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Popconfirm, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { deleteCategory, getAllCategory } from '../../../services/admin_services/CategoryService';
import { ModalCreateCategory } from './ModalCreateCategory';
import { ModalUpdateCategory } from './ModalUpdateCategory';

export const ManageCategory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryUpdate, setCategoryUpdate] = useState();


    useEffect(() => {
        document.title = "Quản lý thể loại món"
        fetchAllCategory();
    }, []);
    const fetchAllCategory = async () => {
        try {
            const response = await getAllCategory();
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
    const handleUpdate = (category) => {
        setCategoryUpdate(category)
        setIsModalUpdateOpen(true);
    };
    const handleDelete = async (category) => {
        try {
            const response = await deleteCategory(category.categoryId);
            if (response.data.code === 200) {
                notification.success({
                    message: "Xoá thể loại món thành công",
                    description: "Xoá thành công",
                    duration: 1
                });
                fetchAllCategory();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const columns = [
        {
            title: 'Tên thể loại món',
            dataIndex: 'name',
            key: 'categoryId',
            align: 'center',
            render: (categoryName, category) => {
                return (
                    <div>
                        <Link to={String(category.categoryId)}>{categoryName}</Link>
                    </div>
                )
            },
        },
        {
            title: "Chức năng",
            key: "categoryId",
            align: 'center',
            width: "40%",
            render: (_, category) => {
                return (
                    <div className='flex gap-4 justify-center'>
                        <Button color='default' variant='outlined' className='-my-2'
                            onClick={() => handleUpdate(category)}
                        >Sửa thể loại món</Button>
                        <Popconfirm
                            title="Xoá khu vực"
                            description="Bạn có muốn xoá khu vực này không?"
                            onConfirm={() => { handleDelete(category) }}
                            okText="Xác nhận xoá"
                            cancelText="Huỷ bỏ"
                        >
                            <Button color="danger" variant="outlined" className='-my-2'
                            >Xoá khu vực</Button>
                        </Popconfirm>
                        <Button color="primary" variant="outlined" className='-my-2'>
                            <Link to={category.categoryId}>Xem danh món ăn</Link>
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
                    <p className='flex-grow ml-2 text-2xl'>Quản lý thể loại món</p>
                    <Button
                        variant='filled'
                        color='primary'
                        onClick={handleCreateArea}
                    >
                        Tạo mới thể loại món
                    </Button>
                </div>
                <Table rowKey="categoryId" columns={columns} dataSource={data} loading={loading} pagination={{ position: ["bottomCenter"], pageSize: 8 }} />
            </div>
            <Modal
                title="Tạo thể loại món"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}>
                <ModalCreateCategory handleCancel={handleCancel} fetchAllCategory={fetchAllCategory} />
            </Modal>
            <Modal
                title="Cập nhật khu vực"
                open={isModalUpdateOpen}
                onOk={handleUpdateOk}
                onCancel={handleUpdateCancel}
                footer={null}
            >
                <ModalUpdateCategory categoryUpdate={categoryUpdate} handleUpdateCancel={handleUpdateCancel} fetchAllCategory={fetchAllCategory} />
            </Modal>
        </>
    )
}
