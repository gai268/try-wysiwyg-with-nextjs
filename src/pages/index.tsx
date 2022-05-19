import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, styled, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { CompositeDecorator, ContentBlock, ContentState, convertToRaw, Editor, EditorState, Modifier, RichUtils } from 'draft-js'
import type { NextPage } from 'next'
import Head from 'next/head'
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react'
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    '&.Mui-disabled': {
      border: 0,
    },
    '&.MuiButtonBase-root': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const Home: NextPage = () => {
  // ページ読み込みが完了したか
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  
  // WYSIWYGエディタの装飾
  const Link = ({ entityKey, contentState, children }: any) => {
    let { url } = contentState.getEntity(entityKey).getData();
    return (
        <a style={{ color: "blue", fontStyle: "italic" }}
           href={url} target="_blank" rel="noreferrer">
          {children}
        </a>
    );
  };
  const linkStrategy = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "LINK"
        );
    }, callback);
  };
  const decorator = new CompositeDecorator([
    {
      strategy: linkStrategy,
      component: Link,
    },
  ]);

  // リンクダイアログ
  const [isOpenLinkDialog, setIsOpenLinkDialog] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>("");  
  
  // エディタ
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator))
  const [editorHTML, setEditorHTML] = useState<string>()
  // 書式ボタンの選択状態
  enum TextFormat {
    Bold = "Bold",
    Italic = "Italic",
    Underline = "Underline",
    Code = "Code",
    Link = "Link"
  }
  const [selectedTextFormats, setSelectedTextFormats] = useState<TextFormat[]>();
  
  enum ListFormat {
    UnorederedListItem = "UnorederedListItem",
    OrederedListItem = "OrederedListItem",
  }
  const [selectedListFormat, setSelectedListFormat] = useState<ListFormat>();
  
  // WYSIWYGエディタの入力・カーソル移動
  const handleChangeWYSIWYG = (state: EditorState) => {
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))

    // エディタツールバーのボタンON/OFF切り替え
    const selectedTextFormats: TextFormat[] = []
    const anchorKey = state.getSelection().getAnchorKey()
    const blockType = state.getCurrentContent().getBlockForKey(anchorKey).getType()

    const entityKey = state.getCurrentContent().getBlockForKey(anchorKey).getEntityAt(state.getSelection().getStartOffset() - 1)
    const entity = entityKey ? state.getCurrentContent().getEntity(entityKey) : undefined

    if(state.getCurrentInlineStyle().has('BOLD')){
      selectedTextFormats.push(TextFormat.Bold)
    }
    if(state.getCurrentInlineStyle().has('ITALIC')){
      selectedTextFormats.push(TextFormat.Italic)
    }
    if(state.getCurrentInlineStyle().has('UNDERLINE')){
      selectedTextFormats.push(TextFormat.Underline)
    }
    if(state.getCurrentInlineStyle().has('CODE')){
      selectedTextFormats.push(TextFormat.Code)
    }
    if(blockType === 'unordered-list-item') {
      setSelectedListFormat(ListFormat.UnorederedListItem)
    }else if(blockType === 'ordered-list-item'){
      setSelectedListFormat(ListFormat.OrederedListItem)
    }else {
      setSelectedListFormat(undefined)
    }
    if(entity?.getType() === "LINK"){
      selectedTextFormats.push(TextFormat.Link)
    }
  
    setSelectedTextFormats(selectedTextFormats)
    setLinkUrl(entity?.getType() === "LINK" ? entity.getData().url : "")
  }
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
  // コード
  const handleClickCode = () => {
    const state = RichUtils.toggleCode(editorState)
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))
  }
  // リスト
  const handleClickList = () => {
    const state = RichUtils.toggleBlockType(editorState, 'unordered-list-item')
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))
  }
  // 順序付きリスト
  const handleClickOrderdList = () => {
    const state = RichUtils.toggleBlockType(editorState, 'ordered-list-item')
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

  // リンクダイアログを開く
  const openLinkDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setIsOpenLinkDialog(true);
  }
  const closeLinkDialog = () => {
    setIsOpenLinkDialog(false);
  }

  // リンク解除
  const removeLink = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const state = RichUtils.toggleLink(editorState, selection, null)
      setEditorState(state);
      setEditorHTML(stateToHTML(state.getCurrentContent()))
    }
    closeLinkDialog()
  }
  // リンク追加
  const addLink = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    // URLが未入力の場合はリンクを解除する
    if(!linkUrl){
      removeLink(event)
      return
    }
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
      url: linkUrl,
    })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    })
    const state = RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    )
    setEditorState(state)
    setEditorHTML(stateToHTML(state.getCurrentContent()))

    closeLinkDialog()
  }


  // 初期化処理
  useEffect(() => {
    // ページ読み込み完了状態にする
    setIsLoaded(true)
  }, [])

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
            <Typography variant="h5">
              Draft.js
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
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                    <StyledToggleButtonGroup size='small' value={selectedTextFormats} onChange={(event, value: TextFormat[]) => setSelectedTextFormats(value)}>
                      <ToggleButton value={TextFormat.Bold} aria-label="太字" onClick={handleClickBold}><FormatBoldIcon /></ToggleButton>
                      <ToggleButton value={TextFormat.Italic} aria-label="斜体" onClick={handleClickItalic}><FormatItalicIcon /></ToggleButton>
                      <ToggleButton value={TextFormat.Underline} aria-label="下線" onClick={handleClickUnderline} ><FormatUnderlinedIcon /></ToggleButton>
                      <ToggleButton value={TextFormat.Code} aria-label="コードブロック" onClick={handleClickCode}><CodeIcon /></ToggleButton>
                    </StyledToggleButtonGroup>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                    <StyledToggleButtonGroup exclusive size='small' value={selectedListFormat} onChange={(event, value: ListFormat) => setSelectedListFormat(value)}>
                      <ToggleButton value={ListFormat.UnorederedListItem} aria-label="リスト" onClick={handleClickList}><FormatListBulletedIcon /></ToggleButton>
                      <ToggleButton value={ListFormat.OrederedListItem} aria-label="順序付きリスト" onClick={handleClickOrderdList} ><FormatListNumberedIcon /></ToggleButton>
                    </StyledToggleButtonGroup>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                    <StyledToggleButtonGroup size='small' value={selectedTextFormats} onChange={(event, value: TextFormat[]) => setSelectedTextFormats(value)}>
                      <ToggleButton value={TextFormat.Link} aria-label="リンク" onClick={openLinkDialog}><LinkIcon /></ToggleButton>
                    </StyledToggleButtonGroup>
                    {/* <IconButton aria-label="画像" onClick={handleClickImage} sx={{borderRadius: 1}}><ImageIcon /></IconButton> */}
                  </Box>
                  <Box sx={{px: 1, py: 2}}>
                    <Editor editorKey="wysiwyg1" placeholder="ここに文章を書きましょう！"
                     editorState={editorState} onChange={handleChangeWYSIWYG}/>
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
            <Dialog open={isOpenLinkDialog} onClose={closeLinkDialog} fullWidth>
              <DialogTitle>リンクを編集</DialogTitle>
              <DialogContent>
                <TextField autoFocus margin="dense" id="linkUrl" 
                label="リンク先URL" type="url"
                placeholder="https://example.com/"
                fullWidth variant="standard"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeLinkDialog}>キャンセル</Button>
                <Button onClick={addLink}>OK</Button>
              </DialogActions>
            </Dialog>
            </>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Home
