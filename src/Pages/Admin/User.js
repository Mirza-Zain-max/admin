/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { fireStore } from '../../Config/firebase';
import { Button, Popconfirm, Typography, Table, Pagination, Row, Col, Modal, Input, Form } from 'antd';
import { EditFilled, EyeOutlined } from '@ant-design/icons';
import { Container } from 'react-bootstrap';

const User = () => {
  const { Title } = Typography;
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [form] = Form.useForm();
  const pageSize = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(fireStore, 'users');
        const q = query(usersCollection);
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const handleToggleDisable = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const userRef = doc(fireStore, 'users', userId);
      await updateDoc(userRef, { isDisabled: newStatus });

      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, isDisabled: newStatus } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      render: (text, user) => (
        <>
          {visiblePasswords[user.id] ? text : '*******'}
          <Button type="link" onClick={() => togglePasswordVisibility(user.id)}>
            <EyeOutlined />
          </Button>
        </>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: () => (
        <span>
          👤<b>User</b>
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, user) => (
        <>
          <Popconfirm
            title={`Are you sure you want to ${user.isDisabled ? 'enable' : 'disable'} this user?`}
            onConfirm={() => handleToggleDisable(user.id, user.isDisabled)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={user.isDisabled ? 'default' : 'primary'}>
              {user.isDisabled ? 'Enable' : 'Disable'}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Container>
        <Row>
          <Col span={24}>
            <Title>Registered Users</Title>
            <Table
              bordered
              loading={loading}
              dataSource={paginatedUsers}
              columns={columns}
              pagination={false}
              rowKey="id"
            />
            <Pagination
              className="mt-3"
              current={page}
              total={users.length}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default User;
