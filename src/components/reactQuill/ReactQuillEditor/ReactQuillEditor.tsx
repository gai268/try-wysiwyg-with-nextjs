import { Box, Divider, Grid, TextField, Typography } from "@mui/material";
import styled from '@emotion/styled';
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';


const StyledEditor = styled.div`
& .ql-container{
    border: 0 !important;
}
`

const modules = {
    toolbar: {
        container: "#toolbar",
        handlers: {
            'link': function(value: string) {
                if (value) {
                    var href = prompt('Enter the URL');
                    ((this as any).quill as Quill).format('link', href);
                } else {
                    ((this as any).quill as Quill).format('link', false);
                }
            }
        }
    }
}
export const ReactQuillEditor = () => {
    const [value, setValue] = useState('');

      // HTMLエディタで入力
    const handleChangeHTML = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const html = event.target.value
        setValue(html)
    }

    return (<>
        <Typography variant="h5">
            React-quill
        </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                WYSIWYGエディタ
                </Typography>
                <Box sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1, bgcolor: 'background.paper', color: 'text.secondary', p: 1,
                }}>
                    <div id="toolbar" style={{border: 0}}>
                        <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                        <option></option>
                        <option value="1"></option>
                        <option value="2"></option>
                        </select>
                        <button className="ql-bold"></button>
                        <button className="ql-italic"></button>
                        <select className="ql-color">
                        <option></option>
                        <option value="red"></option>
                        <option value="green"></option>
                        <option value="blue"></option>
                        <option value="orange"></option>
                        <option value="violet"></option>
                        <option value="#d0d1d2"></option>
                        </select>
                        <button className="ql-link"></button>
                    </div>
                    <StyledEditor>
                        <ReactQuill 
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        placeholder="ここに文章を書きましょう！"
                        />
                    </StyledEditor>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                HTML
                </Typography>
                <Box>
                    <TextField
                        aria-label="html"
                        minRows={3}
                        placeholder="HTML"
                        sx={{ width: '100%' }}
                        multiline
                        value={value}
                        onChange={handleChangeHTML}
                    />
                </Box>
            </Grid>
        </Grid>
    </>)
}