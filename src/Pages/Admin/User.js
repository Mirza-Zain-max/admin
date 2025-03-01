import React, { useEffect, useState } from 'react';
import { collection, getDocs, query,  doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { fireStore } from '../../Config/firebase';
import { Typography } from 'antd';
import { Table, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { UserOutlined } from '@ant-design/icons';

const User = () => {
  const { Title } = Typography;
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(fireStore, 'users');
        const q = query(usersCollection); // Example query
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
        setTotalPages(Math.ceil(userList.length / pageSize));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEdit = (user) => {
    // Implement your edit functionality here
    console.log('Edit user:', user);
  };

  const handleDisable = async (userId) => {
    try {
      const userDoc = doc(fireStore, 'users', userId);
      await updateDoc(userDoc, { disabled: true });
      setUsers(users.map(user => user.id === userId ? { ...user, disabled: true } : user));
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const handleEnable = async (userId) => {
    try {
      const userDoc = doc(fireStore, 'users', userId);
      await updateDoc(userDoc, { disabled: false });
      setUsers(users.map(user => user.id === userId ? { ...user, disabled: false } : user));
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(fireStore, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
    <Title>Registered Users</Title>
    <div className="table-responsive">
      <Table bordered hover className="text-center align-middle">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => (
            <tr key={user.email}>
              <td>{(page - 1) * pageSize + index + 1}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td><UserOutlined /><b>User</b></td>
              <td>
                <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
                  <Dropdown.Item onClick={() => handleEdit(user)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDisable(user.id)}>Disable</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleEnable(user.id)}>Enable</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDelete(user.id)}>Delete</Dropdown.Item>
                </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="">
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === page}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  </>
  );
};

export default User;