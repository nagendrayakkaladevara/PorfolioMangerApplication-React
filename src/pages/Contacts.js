import { Alert, Button, Card, CardActions, CardContent, Snackbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const Contacts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [message, setMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://portfolioexpressapp.vercel.app/contacts');
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [reload]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://portfolioexpressapp.vercel.app/contacts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Item deleted successfully');
                setSnackbarOpen(true);
            } else {
                setMessage('Failed to delete item');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            setMessage('Failed to delete item');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
            setReload((reload) => !reload);
        }
    };


    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {loading &&
                    <span class="loader"></span>
                }
            </div>

            <div style={{ padding: '20px' }}>
                {data && data.map((item, index) => (
                    <Card key={index} sx={{ minWidth: 275, marginTop: 3 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {item._id}
                            </Typography>
                            <Typography variant="h5" component="div">
                                {item.name}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {item.mailaddress}
                            </Typography>
                            <Typography variant="body2">
                                {item.message}
                                <br />
                                <br />
                                {item.createdAt}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button color="error" onClick={() => handleDelete(item._id)}>
                                delete
                            </Button>
                        </CardActions>
                    </Card>
                ))}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={message}
                    action={
                        <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
                            CLOSE
                        </Button>
                    }
                />
            </div>
            <div style={{ padding: '20px' }}>
                {data && data.length === 0 && <Alert severity="warning">No records</Alert>}
            </div>

        </>
    )
}
export default Contacts;