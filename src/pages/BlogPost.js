import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Slide, Snackbar, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


// ---------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'HTML',
    'CSS',
    'SCSS',
    'JavaScript',
    'TypeScript',
    'ReactJS',
    'Next.js',
    'Express.js',
    'Node.js',
    'MongoDB',
    'Java',
    'MySQL',
    'Assets',
    'VSCode'
];


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function generateDateTimeString() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    // Concatenate the date and time components
    const dateTimeString = `${day}${month}${year}${hours}${minutes}`;

    return dateTimeString;
}

const BlogPost = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [message, setMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const Post_id = generateDateTimeString();

    console.log(Post_id, 'Post_id');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://portfolioexpressapp.vercel.app/blogcatalog');
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
            const response = await fetch(`https://portfolioexpressapp.vercel.app/blog/${id}`, {
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

    const handleRefresh = () => {
        setReload(!reload);
    }

    const [open, setOpen] = React.useState(false);
    const [postData, setPostData] = useState(null);

    const handleClickOpen = async (id) => {
        setOpen(true);
        setLoading(true);
        try {
            const response = await fetch(`https://portfolioexpressapp.vercel.app/blog/${id}`);
            const jsonData = await response.json();
            setPostData(jsonData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    console.log(postData, "postData");

    const handleClose = () => {
        setOpen(false);
    };


    const [editableData, setEditableData] = useState(null);
    const [editing, setEditing] = useState(false);

    const handleInputChange = (e, key) => {
        const { value } = e.target;
        setEditableData(prevData => ({
            ...prevData,
            [key]: value,
        }));
    };

    const toggleEditing = () => {
        setEditing(prevEditing => !prevEditing);
        if (!editing) {
            setEditableData({ ...postData });
        }
    };

    const saveChanges = () => {
        console.log("Updated data:", editableData);
        setEditing(false);
    };

    const [createPostOpen, setCreatePostOpen] = React.useState(false);


    // ----------------------------------------------------------------
    const [personName, setPersonName] = React.useState([]);

    const [createBlogPostData, setCreateBlogPostData] = useState({
        post_id: '',
        title: '',
        date_published: '',
        categories: [],
        description: [{ paragraph1: '', paragraph2: '', paragraph3: '' }],
        featured_image: '',
        code: '',
        link: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreateBlogPostData({ ...createBlogPostData, [name]: value, categories: personName, post_id: Post_id });
    };


    const handleCreatePostClose = () => {
        setCreatePostOpen(false);
        setCreateBlogPostData({
            post_id: '',
            title: '',
            date_published: '',
            categories: [],
            description: [{ paragraph1: '', paragraph2: '', paragraph3: '' }],
            featured_image: '',
            code: '',
            link: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreatePostOpen(false);
        console.log(createBlogPostData, "createBlogPostData");
        try {
            const response = await fetch('https://portfolioexpressapp.vercel.app/blog', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createBlogPostData)
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const responseData = await response.json();
            alert('Post created:', responseData);
            console.log('Post created:', responseData);

            // setCreateBlogPostData({
            //     post_id: '',
            //     title: '',
            //     date_published: '',
            //     categories: [],
            //     description: [{ paragraph1: '', paragraph2: '', paragraph3: '' }],
            //     featured_image: '',
            //     code: '',
            //     link: ''
            // });

        } catch (error) {
            console.error('Error submitting blog post:', error);
            alert('Failed to submit blog post. Please try again later.');
        }
    };

    const handleDescriptionChange = (index) => (e) => {
        const { value } = e.target;
        setCreateBlogPostData(prevData => ({
            ...prevData,
            description: prevData.description.map((paragraph, i) =>
                i === 0 ? { ...paragraph, [`paragraph${index + 1}`]: value } : paragraph
            )
        }));
    };


    // --

    const theme = useTheme();

    const handleChangee = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    console.log(personName, "personName")

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {loading &&
                    <span class="loader"></span>
                }
            </div>
            <div style={{ display: "flex", justifyContent: 'center', gap: "30px" }}>
                <Button variant="outlined" color="error" onClick={() => setCreatePostOpen(true)}>Create Post</Button>
                <Button variant="outlined" onChange={handleRefresh}>Refresh</Button>
            </div>

            <div style={{ padding: '20px' }}>
                {data &&
                    data.map((item, index) => (
                        <>
                            <div className='tranperentblur m-10 p-5 shadow-pop-brConstent'>
                                <p className='flex justify-end blogcarddate' style={{ fontSize: "10px" }}>{item.date}</p>
                                <p className="blogcardtitle">{item.title}</p>
                                <p className="blogcarddiscription">{item.into}</p>
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
                                    <Button variant="outlined" color="success" onClick={() => handleClickOpen(item.id)}>
                                        Open
                                    </Button>
                                </div>
                            </div>
                        </>
                    ))
                }
            </div>
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
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', height: "200px", alignItems: 'center' }}>
                        <span class="loader"></span>
                    </div>
                )}

                {postData && (
                    <>
                        <DialogTitle>{editing ? "Edit Post" : postData.title}</DialogTitle>
                        <DialogContent>
                            {editing ? (
                                <>
                                    <input type="text" value={editableData._id} onChange={(e) => handleInputChange(e, '_id')} />
                                    <input type="text" value={editableData.link} onChange={(e) => handleInputChange(e, 'link')} />
                                    <input type="text" value={editableData.date} onChange={(e) => handleInputChange(e, 'date')} />
                                    <input type="text" value={editableData.createdAt} onChange={(e) => handleInputChange(e, 'createdAt')} />
                                    <input type="text" value={editableData.code} onChange={(e) => handleInputChange(e, 'code')} />
                                </>
                            ) : (
                                <>
                                    <p>id - {postData._id}</p>
                                    <p>Link - {postData.link}</p>
                                    <p>date - {postData.date}</p>
                                    <p>createdAt - {postData.createdAt}</p>
                                    <p>code - {postData.code}</p>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        {postData.description && postData.description.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <p>{item.paragraph1}</p>
                                                <br />
                                                <p>{item.paragraph2}</p>
                                                <br />
                                                <p>{item.paragraph3}</p>
                                            </React.Fragment>
                                        ))}
                                    </DialogContentText>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            {!editing ? (
                                <>
                                    <Button onClick={handleClose}>Close</Button>
                                    <Button onClick={toggleEditing}>Edit</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={toggleEditing}>Cancel</Button>
                                    <Button onClick={saveChanges}>Save</Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>




            <Dialog
                open={createPostOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCreatePostClose}
                aria-describedby="alert-dialog-slide-description"
            >

                <div style={{ padding: '15px', margin: '20px', boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", width: '500px' }}>
                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <label htmlFor="title">
                            <TextField id="outlined-basic" label="Title" variant="outlined" fullWidth type="text" name="title" value={createBlogPostData.title} onChange={handleChange} />
                        </label>
                        <label htmlFor="date_published">
                            <TextField id="outlined-basic" type='date' variant="outlined" fullWidth name="date_published" value={createBlogPostData.date_published} onChange={handleChange} />
                        </label>
                        <label>
                            {/* <input type="text" name="categories" value={createPostOpen.categories.join(',')} onChange={handleChange} /> */}

                            <div>
                                <FormControl sx={{ m: 1 }} fullWidth>
                                    <InputLabel id="demo-multiple-chip-label">Categories</InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple

                                        value={personName}
                                        onChange={handleChangee}
                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {names.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getStyles(name, personName, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </label>
                        <label htmlFor="featured_image">
                            <input type="text" name="featured_image" value={createBlogPostData.featured_image} onChange={handleChange} placeholder="Image" />
                        </label>
                        <label htmlFor="code">
                            <TextField id="outlined-basic" type="text" label="Code" fullWidth multiline rows={6} name="code" value={createBlogPostData.code} onChange={handleChange} />
                        </label>
                        <label htmlFor="link">
                            <TextField id="outlined-basic" label="link" type="text" fullWidth name="link" value={createBlogPostData.link} onChange={handleChange} />
                        </label>

                        <TextField type="text" fullWidth multiline rows={6} label="Description Paragraph 1:"
                            id="description1"
                            name="description1"
                            value={createBlogPostData.description[0].paragraph1}
                            onChange={handleDescriptionChange(0)}
                        />
                        <TextField type="text" fullWidth multiline rows={6} label="Description Paragraph 2:"
                            id="description2"
                            name="description2"
                            value={createBlogPostData.description[0].paragraph2}
                            onChange={handleDescriptionChange(1)}
                        />

                        <TextField label="Description Paragraph 3:" type="text" fullWidth multiline rows={6}
                            id="description3"
                            name="description3"
                            value={createBlogPostData.description[0].paragraph3}
                            onChange={handleDescriptionChange(2)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>

                <Button onClick={handleCreatePostClose}>Close</Button>

            </Dialog>






        </>
    )
}

export default BlogPost;