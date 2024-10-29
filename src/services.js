import axios from 'axios';

const API_URL = 'http://localhost:8000/api';


export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};


export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export const updateUser = async (id, userData) => {
  try {
    const response = await axios.patch(`${API_URL}/user/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/user/${id}`);
    console.log(`User with ID ${id} deleted.`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};


export const reload = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/reload`, userData);
      return response.data;
    } catch (error) {
      console.error('Error reload balance:', error);
      throw error;
    }
  };

  export const getBalance = async (params) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/balance/?document=${params.document}&phone=${params.phone}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error; 
    }
  };


  export const pay = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/payment/pay`, userData);
      return response.data;
    } catch (error) {
      console.error('Error pay:', error);
      throw error;
    }
  };

  export const confirmOk = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/payment/confirm`, userData);
      return response.data;
    } catch (error) {
      console.error('Error pay:', error);
      throw error;
    }
  };