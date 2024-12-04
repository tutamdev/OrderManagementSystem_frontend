import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Input, Form, Select } from "antd";
import { getAllDiscount, updateDiscount } from "../../../services/admin_services/DiscountService";
import { useForm } from "antd/es/form/Form";
import { ModalCreateDiscount } from "./ModalCreateDiscount";
import { ModalupdateDiscount } from "./ModalUpdateDiscount";

const { Option } = Select;
export const ManageDiscount = () => {
    const [data, setData] = useState([]);
    const [discountUpdate, setDiscountUpdate] = useState({});
    const fetchDiscount = async () => {
        try {
            const response = await getAllDiscount();
            if (response.data.code === 200) setData(response.data.result)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDiscount();
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalUpdateOpen(false);
    };
    const createDiscount = () => {
        setIsModalOpen(true);
    }

    const columns = [
        {
            title: "Discount Code",
            dataIndex: "discountCode",
            key: "discountCode",
            align: "center"
        },
        {
            title: "Discount Type",
            dataIndex: "discountType",
            key: "discountType",
            align: "center"
        },
        {
            title: "Discount Value",
            dataIndex: "discountValue",
            key: "discountValue",
            align: "center",
            render: (value, record) =>
                record.discountType === "PERCENT" ? `${value}%` : `${value.toLocaleString()} VND`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (_, record) => (
                <Switch
                    disabled
                    checked={record.status}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <div className="">
                    <Button
                        onClick={() => {
                            setDiscountUpdate(record);
                            setIsModalUpdateOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="">
            <div className='flex border-b p-2'>
                <p className='flex-grow ml-2 text-2xl'>Quản lý hoá đơn</p>
                <Button
                    variant='filled'
                    color='primary'
                    onClick={createDiscount}
                >
                    Tạo mới Discount
                </Button>
            </div>
            <Table columns={columns} dataSource={data} rowKey="discountCode" />
            <Modal title="Create Discount" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <ModalCreateDiscount handleCancel={handleCancel} fetchDiscount={fetchDiscount} />
            </Modal>
            <Modal title="Update Discount" open={isModalUpdateOpen} onCancel={handleCancel} footer={null}>
                <ModalupdateDiscount discountUpdate={discountUpdate} handleCancel={handleCancel} fetchDiscount={fetchDiscount} />
            </Modal>
        </div>
    );
}
