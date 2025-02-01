import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxWidth: 1200,
  margin: '20px auto',
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const InvigilatorList = () => {
  const [invigilators, setInvigilators] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchInvigilators();
  }, []);

  const fetchInvigilators = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invigilators');
      const data = await response.json();
      setInvigilators(data);
    } catch (error) {
      console.error('Error fetching invigilators:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invigilator?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/invigilators/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchInvigilators();
        }
      } catch (error) {
        console.error('Error deleting invigilator:', error);
      }
    }
  };

  const filteredInvigilators = invigilators.filter(invigilator =>
    Object.values(invigilator).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Invigilators List
      </Typography>

      <Box sx={{ maxWidth: 1200, margin: '20px auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search invigilators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvigilators
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invigilator) => (
                <TableRow key={invigilator._id}>
                  <TableCell>{invigilator.employeeId}</TableCell>
                  <TableCell>{invigilator.name}</TableCell>
                  <TableCell>{invigilator.email}</TableCell>
                  <TableCell>{invigilator.phone}</TableCell>
                  <TableCell>
                    <Chip label={invigilator.department} color="primary" />
                  </TableCell>
                  <TableCell>{invigilator.experience} years</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary"
                      onClick={() => navigate(`/edit-invigilator/${invigilator._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(invigilator._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvigilators.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </StyledTableContainer>
    </Box>
  );
};

export default InvigilatorList;
