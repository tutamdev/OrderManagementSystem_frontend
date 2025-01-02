import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import { closeShift, getActiveShift, getAllShift } from '../../../services/admin_services/ShiftService';
import { Link } from 'react-router-dom';


const prioritizeShiftActive = (shifts, shiftWorking) => {
    // Lọc bỏ shiftWorking ra khỏi shifts
    const filteredShifts = shifts.filter(shift => shift.shiftId !== shiftWorking.shiftId);
    // Đưa shiftWorking lên đầu mảng
    return [shiftWorking, ...filteredShifts];
};

export const ManageShift = () => {
    const [data, setData] = useState([]);
    const [shiftWorking, setShiftWorking] = useState();
    const [refresh, setRefresh] = useState(false);

    const fetchShifts = async () => {
        let dataResponse = null;
        let shiftworkingresponse = null;

        try {
            const shiftsResponse = await getAllShift();
            if (shiftsResponse.data.code === 200) {
                dataResponse = shiftsResponse.data.result;
            }

            const shiftActiveResponse = await getActiveShift();
            if (shiftActiveResponse.data.code === 200) {
                shiftworkingresponse = shiftActiveResponse.data.result;
                setShiftWorking(shiftworkingresponse);
            }
        } catch (error) {
            console.log("Error fetching shifts or active shift:", error);
        } finally {
            if (shiftworkingresponse) {
                const updatedShifts = prioritizeShiftActive(dataResponse, shiftworkingresponse);
                setData(updatedShifts);
            } else {
                setData(dataResponse);
            }
        }
    };

    const handleCloseShift = async (shiftId) => {
        try {
            const response = await closeShift(shiftId);
            if (response.data.code === 200) {
                // fetchShifts();
                setRefresh((prev) => !prev);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        document.title = "Quản lý ca làm việc";
        fetchShifts();
    }, [refresh]);

    const columns = [
        {
            title: 'Mã ca',
            dataIndex: 'shiftId',
            key: 'shiftId',
            align: 'center',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Ngày làm việc',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
        },
        {
            title: 'Thời gian mở',
            dataIndex: 'startTime',
            key: 'startTime',
            align: 'center',
        },
        {
            title: 'Thời gian đóng',
            dataIndex: 'endTime',
            key: 'endTime',
            align: 'center',
            render: (endTime) => (endTime ? endTime : '--:--:--'),
        },
        {
            title: 'Trạng thái',
            key: 'shiftId',
            align: 'center',
            render: (_, { isEnabled }) => (
                <Tag color={isEnabled ? 'green' : 'volcano'} key={isEnabled}>
                    {isEnabled ? 'Ca đang mở' : 'Ca đã đóng'}
                </Tag>
            ),
        },
        {
            title: 'Chức năng',
            key: 'actions',
            align: 'center',
            render: (_, { shiftId, isEnabled }) => (
                <Space>
                    <Link to={`${shiftId}`}>
                        <Button variant='filled' >Xem chi tiết ca</Button>
                    </Link>

                    <Popconfirm
                        placement='topLeft'
                        title="Bạn có muốn đóng ca này không?"
                        onConfirm={() => handleCloseShift(shiftId)} // Thực hiện hành động khi xác nhận
                        okText="Đồng ý"
                        cancelText="Hủy"
                        disabled={!isEnabled} // Vô hiệu hóa Popconfirm nếu ca không hoạt động
                    >
                        <Button
                            type="default"
                            danger
                            disabled={!isEnabled} // Vô hiệu hóa nút nếu ca không hoạt động
                        >
                            Đóng ca
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className='flex border-b p-2'>
                <p className='flex-grow ml-2 text-2xl'>Quản lý ca làm việc</p>
            </div>
            <Table columns={columns} dataSource={data} rowKey="shiftId" pagination={{ position: ["bottomCenter"], pageSize: 8 }} />
        </div>
    )

}
