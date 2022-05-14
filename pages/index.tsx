import { Box, Container, Divider, IconButton } from '@mui/material'
import { Editor, EditorState, RichUtils } from 'draft-js'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'draft-js/dist/Draft.css';
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

  // 初期化処理
  useEffect(() => {
    // ページ読み込み完了状態にする
    setIsLoaded(true)
  }, [])

  const _onBoldClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
  const _onItalicClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
  const _onUnderlineClick = () => setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{display: isLoaded ? undefined: "none"}}>
        <Container maxWidth="xl" component={'main'}>
          {isLoaded && (
            <>
            <Box sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: 'background.paper',
              color: 'text.secondary',
              p: 1,
              }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content',  
                gap: 0.5,              
              }}>
                <IconButton aria-label="太字" onClick={_onBoldClick.bind(this)} size='small'><FormatBoldIcon /></IconButton>
                <IconButton aria-label="斜体" onClick={_onItalicClick.bind(this)} size='small'><FormatItalicIcon /></IconButton>
                <IconButton aria-label="下線" onClick={_onUnderlineClick.bind(this)} size='small'><FormatUnderlinedIcon /></IconButton>
                <IconButton aria-label="コードブロック" onClick={_onBoldClick.bind(this)} size='small'><CodeIcon /></IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton aria-label="リスト" onClick={_onBoldClick.bind(this)} size='small'><FormatListBulletedIcon /></IconButton>
                <IconButton aria-label="番号付きリスト" onClick={_onBoldClick.bind(this)} size='small'><FormatListNumberedIcon /></IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton aria-label="リンク" onClick={_onBoldClick.bind(this)} size='small'><LinkIcon /></IconButton>
                <IconButton aria-label="画像" onClick={_onBoldClick.bind(this)} size='small'><ImageIcon /></IconButton>
              </Box>
              <Box sx={{px: 1, py: 2}}>
                <Editor 
                editorKey="test-key"
                placeholder="ここに文章を書きましょう！"
                editorState={editorState} 
                onChange={setEditorState}/>
              </Box>

            </Box>
            </>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Home
