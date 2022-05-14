import { Box, Container, Divider, Grid, IconButton, TextareaAutosize, TextField, Typography } from '@mui/material'
import { Editor, EditorState, RichUtils } from 'draft-js'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'draft-js/dist/Draft.css';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
const Home: NextPage = () => {
  // ページ読み込みが完了したか
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [editorHTML, setEditorHTML] = useState<string>()

  // 初期化処理
  useEffect(() => {
    // ページ読み込み完了状態にする
    setIsLoaded(true)
  }, [])

  // 太字
  const handleClickBold = () => {
    const state = RichUtils.toggleInlineStyle(editorState, 'BOLD')
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))
  }
  // 斜体
  const handleClickItalic = () => {
    const state = RichUtils.toggleInlineStyle(editorState, 'ITALIC')
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))
  }
  // 下線
  const handleClickUnderline = () => {
    const state = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))
  }

  // WYSIWYGエディタで入力
  const handleChangeWYSIWYG = (state: EditorState) => {
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))
  }
  // HTMLエディタで入力
  const handleChangeHTML = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = event.target.value
    setEditorHTML(html)
    const editorState = EditorState.createWithContent(stateFromHTML(html));
    setEditorState(editorState)
  }

  return (
    <>
      <Head>
        <title>wysiwyg with NextJs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{display: isLoaded ? undefined: "none"}}>
        <Container maxWidth="xl" component={'main'}>
          {isLoaded && (
            <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                WYSIWYGエディタ
                </Typography>
                <Box sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1, bgcolor: 'background.paper', color: 'text.secondary', p: 1,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 0.5 }}>
                    <IconButton aria-label="太字" onClick={handleClickBold.bind(this)} size='small'><FormatBoldIcon /></IconButton>
                    <IconButton aria-label="斜体" onClick={handleClickItalic.bind(this)} size='small'><FormatItalicIcon /></IconButton>
                    <IconButton aria-label="下線" onClick={handleClickUnderline.bind(this)} size='small'><FormatUnderlinedIcon /></IconButton>
                    <IconButton aria-label="コードブロック" onClick={handleClickBold.bind(this)} size='small'><CodeIcon /></IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton aria-label="リスト" onClick={handleClickBold.bind(this)} size='small'><FormatListBulletedIcon /></IconButton>
                    <IconButton aria-label="番号付きリスト" onClick={handleClickBold.bind(this)} size='small'><FormatListNumberedIcon /></IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton aria-label="リンク" onClick={handleClickBold.bind(this)} size='small'><LinkIcon /></IconButton>
                    <IconButton aria-label="画像" onClick={handleClickBold.bind(this)} size='small'><ImageIcon /></IconButton>
                  </Box>
                  <Box sx={{px: 1, py: 2}}>
                    <Editor 
                    editorKey="test-key"
                    placeholder="ここに文章を書きましょう！"
                    editorState={editorState} 
                    onChange={handleChangeWYSIWYG}/>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  HTMLエディタ
                </Typography>
                <Box>
                <TextField
                  aria-label="html"
                  minRows={3}
                  placeholder="HTML"
                  sx={{ width: '100%' }}
                  multiline
                  value={editorHTML}
                  onChange={handleChangeHTML}
                />
                </Box>
              </Grid>
            </Grid>
            </>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Home
