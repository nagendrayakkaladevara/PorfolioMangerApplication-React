import { Button } from "@mui/material";
import React, { useState } from "react";
import Contacts from "./Contacts";
import BlogPost from "./BlogPost";

const Application = () => {
    const [screen, setScreen] = useState('');
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: (screen === '') ? '100vh' : "100px", gap: "20px" }}>
                <Button variant="contained" onClick={() => setScreen('Contacts')}>Contacts</Button>
                <Button variant="contained" onClick={() => setScreen('BlogPost')}>Blog Post</Button>
            </div>

            {screen === 'Contacts' &&
                <>
                    <Contacts />
                </>
            }
            {screen === 'BlogPost' &&
                <>
                    <BlogPost />
                </>
            }
        </>
    )
}
export default Application;